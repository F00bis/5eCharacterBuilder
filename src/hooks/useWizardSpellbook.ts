import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { getSpellsByClass } from '../db/spells';
import {
  calculateSpellEntitlements,
  filterAvailableWizardSpells,
  getMaxAccessibleSpellLevel,
} from '../utils/spellCalculations';
import type { AddSpellResult } from '../utils/spellCalculations';
import type { CharacterSpell, DndSpell } from '../types';

export interface UseWizardSpellbookResult {
  isWizard: boolean;
  spellbookSpells: CharacterSpell[];
  spellbookCount: number;
  spellbookMax: number;
  nearCap: boolean;
  availableToAdd: DndSpell[];
  isLoading: boolean;
  addSpell: (spell: DndSpell) => AddSpellResult;
  removeSpell: (spellName: string) => void;
}

export function useWizardSpellbook(): UseWizardSpellbookResult {
  const { character, update } = useCharacter();

  const [allWizardSpells, setAllWizardSpells] = useState<DndSpell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!character) return;

    let cancelled = false;

    getSpellsByClass('Wizard').then((spells) => {
      if (!cancelled) {
        setAllWizardSpells(spells);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [character]);

  const isWizard = useMemo(() => {
    if (!character) return false;
    return character.classes.some((c) => c.className === 'Wizard');
  }, [character]);

  const entitlement = useMemo(() => {
    if (!character) return null;
    return calculateSpellEntitlements(
      character.classes,
      character.abilityScores,
      character.subclass,
    );
  }, [character]);

  const spellbookSpells = useMemo(() => {
    if (!character) return [];
    return character.spells.filter(
      (spell) => spell.source === 'Class' || spell.source === 'Spellbook',
    );
  }, [character]);

  const spellbookCount = spellbookSpells.length;
  const spellbookMax = entitlement?.spellsKnown ?? 0;
  const nearCap =
    spellbookMax > 0 && spellbookCount / spellbookMax >= 0.9;

  const maxWizardSpellLevel = useMemo(() => {
    if (!character) return null;
    const wizardClass = character.classes.find(
      (c) => c.className === 'Wizard',
    );
    if (!wizardClass) return null;
    return getMaxAccessibleSpellLevel([wizardClass], character.subclass);
  }, [character]);

  const availableToAdd = useMemo(() => {
    const levelFiltered =
      maxWizardSpellLevel !== null
        ? allWizardSpells.filter(
            (spell) => spell.level <= maxWizardSpellLevel,
          )
        : allWizardSpells;
    return filterAvailableWizardSpells(levelFiltered, spellbookSpells);
  }, [allWizardSpells, spellbookSpells, maxWizardSpellLevel]);

  const addSpell = useCallback(
    (spell: DndSpell): AddSpellResult => {
      if (!character) {
        throw new Error('No character available');
      }

      const newSpell: CharacterSpell = {
        ...spell,
        prepared: false,
        source: 'Spellbook',
      };

      update({ spells: [...character.spells, newSpell] });

      return { spell, addedAt: new Date() };
    },
    [character, update],
  );

  const removeSpell = useCallback(
    (spellName: string): void => {
      if (!character) return;

      const newSpells = character.spells.filter(
        (spell) => spell.name !== spellName,
      );

      update({ spells: newSpells });
    },
    [character, update],
  );

  return {
    isWizard,
    spellbookSpells,
    spellbookCount,
    spellbookMax,
    nearCap,
    availableToAdd,
    isLoading,
    addSpell,
    removeSpell,
  };
}
