import type { Ability } from '../types';

export interface SubclassSpellData {
  subclassName: string;
  className: string;
  spellcastingAbility: Ability;
  spellPrepType?: 'prepared' | 'known';
  spellsKnownAtLevel?: Record<number, number>;
  cantripsKnownAtLevel?: Record<number, number>;
  spellList: string;
}

export const srdSubclassSpells: SubclassSpellData[] = [
  {
    subclassName: 'Eldritch Knight',
    className: 'Fighter',
    spellcastingAbility: 'intelligence',
    spellPrepType: 'known',
    cantripsKnownAtLevel: {
      3: 0,
      4: 0,
      10: 1,
    },
    spellsKnownAtLevel: {
      3: 0,
      4: 1,
      7: 2,
      8: 2,
      9: 3,
      10: 3,
      11: 3,
      12: 4,
      13: 4,
      14: 4,
      15: 5,
      16: 5,
      17: 5,
      18: 5,
      19: 5,
      20: 5,
    },
    spellList: 'Wizard',
  },
  {
    subclassName: 'Arcane Trickster',
    className: 'Rogue',
    spellcastingAbility: 'intelligence',
    spellPrepType: 'known',
    cantripsKnownAtLevel: {
      3: 0,
      4: 0,
      10: 1,
    },
    spellsKnownAtLevel: {
      3: 0,
      4: 1,
      7: 2,
      8: 2,
      9: 3,
      10: 3,
      11: 3,
      12: 4,
      13: 4,
      14: 4,
      15: 5,
      16: 5,
      17: 5,
      18: 5,
      19: 5,
      20: 5,
    },
    spellList: 'Wizard',
  },
];