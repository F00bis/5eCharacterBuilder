import { srdClasses } from '../data/srdClasses';
import { srdSubclassSpells } from '../data/srdSubclassSpells';
import { db, type SpellProgression } from '../db';
import { DEFAULT_SPELL_PROGRESSIONS } from '../db/spellProgressions';
import type { Ability, ClassEntry } from '../types';

let spellProgressionCache: Map<string, SpellProgression> | null = null;

const defaultProgressionMap = new Map(
  DEFAULT_SPELL_PROGRESSIONS.map(p => [p.className, p as SpellProgression])
);

export async function loadSpellProgressions(): Promise<void> {
  const progressions = await db.spellProgressions.toArray();
  spellProgressionCache = new Map(progressions.map(p => [p.className, p]));
}

export function getSpellProgression(className: string): SpellProgression | undefined {
  if (spellProgressionCache) {
    return spellProgressionCache.get(className);
  }
  return defaultProgressionMap.get(className);
}

export interface SpellEntitlement {
  cantripsKnown: number;
  spellsKnown: number;
  canPrepare: boolean;
  preparedSpellsMax?: number;
  spellcastingAbility: Ability;
  warlockPactSlots?: {
    slots: number;
    slotLevel: number;
  };
  mysticArcanum?: number[];
  subclassSpellData?: {
    spellsKnown: number;
    cantripsKnown: number;
    spellList: string;
  };
}

const WARLOCK_PACT_SLOTS = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
const WARLOCK_PACT_LEVEL = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5];

function getCantripsAtLevel(className: string, characterLevel: number): number {
  const progression = getSpellProgression(className);
  return progression?.cantripProgression[characterLevel] ?? 0;
}

function getSpellsKnownAtLevel(className: string, characterLevel: number): number {
  const progression = getSpellProgression(className);
  return progression?.spellsKnownProgression[characterLevel] ?? 0;
}

function getSpellSlotsAtLevel(className: string, characterLevel: number, spellLevel: number): number {
  const progression = getSpellProgression(className);
  if (!progression) return 0;
  const slotsAtCharacterLevel = progression.spellSlotProgression[characterLevel];
  return slotsAtCharacterLevel?.[spellLevel] ?? 0;
}

function getClassSpellData(className: string): { cantrips: number[]; spellsKnown: number[]; spellPrepType: 'prepared' | 'known'; ability: Ability } | null {
  const dndClass = srdClasses.find(c => c.name === className);
  if (!dndClass || !dndClass.spellcastingAbility) {
    return null;
  }

  const spellsKnown: number[] = [];
  for (let level = 1; level <= 20; level++) {
    spellsKnown.push(getSpellsKnownAtLevel(className, level));
  }

  const cantrips: number[] = [];
  for (let level = 1; level <= 20; level++) {
    cantrips.push(getCantripsAtLevel(className, level));
  }

  return {
    cantrips,
    spellsKnown,
    spellPrepType: dndClass.spellPrepType || 'known',
    ability: dndClass.spellcastingAbility,
  };
}

function getSubclassSpellData(subclassName: string, totalLevel: number): { cantripsKnown: number; spellsKnown: number; spellList: string } | null {
  const subclass = srdSubclassSpells.find(s => s.subclassName === subclassName);
  if (!subclass) {
    return null;
  }

  const cantripsKnown = subclass.cantripsKnownAtLevel?.[totalLevel] ?? 0;
  const spellsKnown = subclass.spellsKnownAtLevel?.[totalLevel] ?? 0;

  return {
    cantripsKnown,
    spellsKnown,
    spellList: subclass.spellList,
  };
}

export function calculateSpellEntitlements(
  classes: ClassEntry[],
  subclass?: string,
): SpellEntitlement | null {
  if (classes.length === 0) {
    return null;
  }

  let primarySpellcastingClass: string | null = null;
  let primarySpellcastingLevel = 0;
  let spellcastingAbility: Ability = 'intelligence';

  for (const entry of classes) {
    const classData = getClassSpellData(entry.className);
    if (classData) {
      if (!primarySpellcastingClass) {
        primarySpellcastingClass = entry.className;
        spellcastingAbility = classData.ability;
      }
      primarySpellcastingLevel += entry.level;
    }
  }

  const fullCasterClasses = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'];
  const halfCasterClasses = ['Paladin', 'Ranger'];
  const warlockClasses = ['Warlock'];

  let cantripsKnown = 0;
  let spellsKnown = 0;
  let canPrepare = false;
  let preparedSpellsMax: number | undefined;
  let warlockPactSlots: { slots: number; slotLevel: number } | undefined;
  let mysticArcanum: number[] | undefined;
  let subclassSpellData: { spellsKnown: number; cantripsKnown: number; spellList: string } | undefined;

  const totalLevel = classes.reduce((sum, c) => sum + c.level, 0);

  if (primarySpellcastingClass) {
    const classData = getClassSpellData(primarySpellcastingClass);
    if (classData) {
      const isFullCaster = fullCasterClasses.includes(primarySpellcastingClass);
      const isHalfCaster = halfCasterClasses.includes(primarySpellcastingClass);
      const isWarlock = warlockClasses.includes(primarySpellcastingClass);

      if (isWarlock) {
        const levelIndex = Math.min(primarySpellcastingLevel - 1, 19);
        cantripsKnown = classData.cantrips[levelIndex] || 0;
        spellsKnown = Math.min(primarySpellcastingLevel, 15) + 1;
        if (primarySpellcastingLevel >= 11) {
          mysticArcanum = [];
          if (primarySpellcastingLevel >= 11) mysticArcanum.push(6);
          if (primarySpellcastingLevel >= 13) mysticArcanum.push(7);
          if (primarySpellcastingLevel >= 15) mysticArcanum.push(8);
          if (primarySpellcastingLevel >= 17) mysticArcanum.push(9);
        }
        warlockPactSlots = {
          slots: WARLOCK_PACT_SLOTS[levelIndex],
          slotLevel: WARLOCK_PACT_LEVEL[levelIndex],
        };
        canPrepare = false;
      } else if (isFullCaster || isHalfCaster) {
        const levelIndex = Math.min(primarySpellcastingLevel - 1, 19);
        cantripsKnown = classData.cantrips[levelIndex] || 0;
        spellsKnown = classData.spellsKnown[levelIndex] || 0;
        canPrepare = classData.spellPrepType === 'prepared';
        if (canPrepare) {
          preparedSpellsMax = primarySpellcastingLevel + (spellcastingAbility === 'charisma' || spellcastingAbility === 'wisdom' ? 1 : 0);
        }
      }
    }
  }

  if (subclass) {
    const ekData = getSubclassSpellData(subclass, totalLevel);
    if (ekData) {
      subclassSpellData = {
        spellsKnown: ekData.spellsKnown,
        cantripsKnown: ekData.cantripsKnown,
        spellList: ekData.spellList,
      };
      if (ekData.cantripsKnown > 0) {
        cantripsKnown = Math.max(cantripsKnown, ekData.cantripsKnown);
      }
      if (ekData.spellsKnown > 0) {
        spellsKnown = Math.max(spellsKnown, ekData.spellsKnown);
      }
      if (!primarySpellcastingClass) {
        spellcastingAbility = 'intelligence';
        canPrepare = false;
      }
    }
  }

  if (cantripsKnown === 0 && spellsKnown === 0 && !warlockPactSlots) {
    return null;
  }

  return {
    cantripsKnown,
    spellsKnown,
    canPrepare,
    preparedSpellsMax,
    spellcastingAbility,
    warlockPactSlots,
    mysticArcanum,
    subclassSpellData,
  };
}

export function getSpellListForClass(className: string, subclassName?: string): string[] {
  if (subclassName === 'Eldritch Knight' || subclassName === 'Arcane Trickster') {
    return ['Wizard'];
  }
  
  const classSpellLists: Record<string, string[]> = {
    Bard: ['Bard'],
    Cleric: ['Cleric'],
    Druid: ['Druid'],
    Paladin: ['Paladin'],
    Ranger: ['Ranger'],
    Sorcerer: ['Sorcerer'],
    Warlock: ['Warlock'],
    Wizard: ['Wizard'],
  };

  return classSpellLists[className] || [];
}

export function getMaxAccessibleSpellLevel(
  classes: ClassEntry[],
  subclass?: string
): number | null {
  if (!classes || classes.length === 0) {
    return null;
  }

  const fullCasterClasses = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'];
  const halfCasterClasses = ['Paladin', 'Ranger'];
  const warlockClasses = ['Warlock'];

  let primarySpellcastingClass: string | null = null;
  let primarySpellcastingLevel = 0;

  for (const entry of classes) {
    const classData = getClassSpellData(entry.className);
    if (classData) {
      if (!primarySpellcastingClass) {
        primarySpellcastingClass = entry.className;
      }
      primarySpellcastingLevel += entry.level;
    }
  }

  if (!primarySpellcastingClass) {
    if (subclass === 'Eldritch Knight' || subclass === 'Arcane Trickster') {
      return 2;
    }
    return null;
  }

  if (warlockClasses.includes(primarySpellcastingClass)) {
    const levelIndex = Math.min(primarySpellcastingLevel - 1, 19);
    return WARLOCK_PACT_LEVEL[levelIndex];
  }

  if (halfCasterClasses.includes(primarySpellcastingClass)) {
    return Math.ceil(primarySpellcastingLevel / 2);
  }

  if (fullCasterClasses.includes(primarySpellcastingClass)) {
    const progression = getSpellProgression(primarySpellcastingClass);
    if (progression) {
      for (let spellLevel = 9; spellLevel >= 1; spellLevel--) {
        if (getSpellSlotsAtLevel(primarySpellcastingClass, primarySpellcastingLevel, spellLevel) > 0) {
          return spellLevel;
        }
      }
    }
  }

  return null;
}