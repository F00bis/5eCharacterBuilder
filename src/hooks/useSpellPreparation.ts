import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import type { CharacterSpell } from '../types';
import {
  buildUpdatedSpells,
  calculateSpellEntitlements,
  getAvailableSpellsForCaster,
  groupSpellsByLevel,
  type AvailableSpellResult,
  type SpellEntitlement,
} from '../utils/spellCalculations';

export interface DisplaySpell extends CharacterSpell {
  canToggle: boolean;
  toggleDisabledReason?: string;
}

type QuotaColor = 'green' | 'amber' | 'red';

export interface UseSpellPreparationResult {
  canPrepare: boolean;
  displaySpells: Map<number, DisplaySpell[]>;
  preparedCount: number;
  preparedMax: number;
  quotaColor: QuotaColor;
  atLimit: boolean;
  isLoading: boolean;
  togglePrepare: (spellName: string) => void;
  warningMessage: string | null;
}

function computeQuotaColor(prepared: number, max: number): QuotaColor {
  if (max === 0) return 'green';
  const ratio = prepared / max;
  if (ratio > 1) return 'red';
  if (ratio > 0.75) return 'amber';
  return 'green';
}

/** Tracks optimistic toggle overrides that haven't been confirmed by the DB yet. */
interface PendingMutation {
  spellName: string;
  prepared: boolean;
}

function derivePreparedNames(availableSpells: CharacterSpell[]): Set<string> {
  const names = new Set<string>();
  for (const spell of availableSpells) {
    if (spell.prepared && spell.level > 0) {
      names.add(spell.name);
    }
  }
  return names;
}

function applyMutations(baseNames: Set<string>, mutations: PendingMutation[]): Set<string> {
  const result = new Set(baseNames);
  for (const mutation of mutations) {
    if (mutation.prepared) {
      result.add(mutation.spellName);
    } else {
      result.delete(mutation.spellName);
    }
  }
  return result;
}

function buildDisplaySpells(
  availableSpells: CharacterSpell[],
  spellbook: CharacterSpell[],
  canPrepare: boolean,
  isWizard: boolean,
  effectivePrepared: Set<string>,
): Map<number, DisplaySpell[]> {
  const spellsWithOptimistic: DisplaySpell[] = availableSpells.map((spell) => {
    const isPreparedOptimistic = effectivePrepared.has(spell.name);
    const isCantrip = spell.level === 0;

    let canToggle = false;
    let toggleDisabledReason: string | undefined;

    if (!canPrepare) {
      canToggle = false;
    } else if (isCantrip) {
      canToggle = false;
    } else if (isWizard) {
      const inSpellbook = spellbook.some((s) => s.name === spell.name);
      if (!inSpellbook) {
        canToggle = false;
        toggleDisabledReason = 'Not in spellbook';
      } else {
        canToggle = true;
      }
    } else {
      canToggle = true;
    }

    return {
      ...spell,
      prepared: isCantrip ? spell.prepared : isPreparedOptimistic,
      canToggle,
      toggleDisabledReason,
    };
  });

  const grouped = groupSpellsByLevel(spellsWithOptimistic);
  const result = new Map<number, DisplaySpell[]>();

  for (const [level, spells] of grouped.entries()) {
    result.set(level, spells as DisplaySpell[]);
  }

  return result;
}

export function useSpellPreparation(): UseSpellPreparationResult {
  const { character, update } = useCharacter();

  const [availableResult, setAvailableResult] = useState<AvailableSpellResult | null>(null);
  const [pendingMutations, setPendingMutations] = useState<PendingMutation[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track which character we've fetched for, so we know when to show loading
  const [fetchedCharacterId, setFetchedCharacterId] = useState<number | undefined>(undefined);

  // Fetch available spells when character changes — single setState on resolve
  useEffect(() => {
    if (!character) return;

    let cancelled = false;

    getAvailableSpellsForCaster(character).then((result) => {
      if (!cancelled) {
        setAvailableResult(result);
        setFetchedCharacterId(character.id);
        setPendingMutations([]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [character]);

  // Derive loading state: loading if we have a character but haven't fetched its data yet
  const isLoading = character !== null && fetchedCharacterId !== character.id;

  const canPrepare = availableResult?.canPrepare ?? false;
  const preparedMax = availableResult?.preparedSpellsMax ?? 0;

  const isWizard = useMemo(() => {
    if (!character) return false;
    return character.classes.some((c) => c.className === 'Wizard');
  }, [character]);

  const entitlement: SpellEntitlement | null = useMemo(() => {
    if (!character) return null;
    return calculateSpellEntitlements(character.classes, character.abilityScores, character.subclass);
  }, [character]);

  // Derive base prepared names from the fetched available result
  const basePreparedNames = useMemo(() => {
    if (!availableResult) return new Set<string>();
    return derivePreparedNames(availableResult.availableSpells);
  }, [availableResult]);

  // Apply optimistic mutations on top of the base
  const effectivePrepared = useMemo(
    () => applyMutations(basePreparedNames, pendingMutations),
    [basePreparedNames, pendingMutations],
  );

  const preparedCount = effectivePrepared.size;
  const quotaColor = computeQuotaColor(preparedCount, preparedMax);
  const atLimit = canPrepare && preparedMax > 0 && preparedCount >= preparedMax;

  const displaySpells = useMemo(() => {
    if (!availableResult) return new Map<number, DisplaySpell[]>();
    return buildDisplaySpells(
      availableResult.availableSpells,
      availableResult.spellbook,
      canPrepare,
      isWizard,
      effectivePrepared,
    );
  }, [availableResult, canPrepare, isWizard, effectivePrepared]);

  const togglePrepare = useCallback(
    (spellName: string) => {
      if (!character || !entitlement || !availableResult) return;

      const isCurrentlyPrepared = effectivePrepared.has(spellName);

      // Block preparing when at limit (but always allow unpreparing)
      if (!isCurrentlyPrepared && atLimit) {
        setWarningMessage('At preparation limit');

        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
        warningTimerRef.current = setTimeout(() => {
          setWarningMessage(null);
          warningTimerRef.current = null;
        }, 2500);
        return;
      }

      const mutation: PendingMutation = { spellName, prepared: !isCurrentlyPrepared };

      // Optimistic update — append mutation
      setPendingMutations((prev) => [...prev, mutation]);

      // Build the updated spells array via pure function
      const updatedSpells = buildUpdatedSpells(
        character.spells,
        { spellName, prepared: mutation.prepared },
        entitlement,
      );

      // Persist to DB; on failure, remove this specific mutation to revert
      update({ spells: updatedSpells }).catch(() => {
        setPendingMutations((prev) =>
          prev.filter((m) => !(m.spellName === mutation.spellName && m.prepared === mutation.prepared)),
        );
      });
    },
    [character, entitlement, availableResult, effectivePrepared, atLimit, update],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, []);

  return {
    canPrepare,
    displaySpells,
    preparedCount,
    preparedMax,
    quotaColor,
    atLimit,
    isLoading,
    togglePrepare,
    warningMessage,
  };
}
