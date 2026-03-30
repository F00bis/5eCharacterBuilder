export interface SpellProgression {
  id?: number;
  className: string;
  cantripProgression: Record<number, number>;
  spellsKnownProgression: Record<number, number>;
  spellSlotProgression: Record<number, number>;
  isCustom: boolean;
}

export const DEFAULT_SPELL_PROGRESSIONS: Omit<SpellProgression, 'id'>[] = [
  {
    className: 'Bard',
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
    spellsKnownProgression: { 1: 2, 2: 3, 3: 4, 4: 4, 5: 5, 7: 6, 8: 6, 9: 7, 10: 7, 11: 8, 13: 9, 14: 9, 15: 10, 17: 10, 18: 10, 19: 11 },
    spellSlotProgression: { 1: 4, 2: 3, 3: 3, 4: 1, 5: 1 },
    isCustom: false,
  },
  {
    className: 'Cleric',
    cantripProgression: { 1: 3, 4: 4, 10: 5 },
    spellsKnownProgression: { 1: 4, 2: 5, 3: 6, 4: 6, 5: 7, 6: 7, 7: 8, 8: 8, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 13, 18: 14, 19: 14, 20: 15 },
    spellSlotProgression: { 1: 4, 2: 3, 3: 3, 4: 1, 5: 1 },
    isCustom: false,
  },
  {
    className: 'Druid',
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
    spellsKnownProgression: { 1: 4, 2: 5, 3: 6, 4: 6, 5: 7, 6: 7, 7: 8, 8: 8, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 13, 18: 14, 19: 14, 20: 15 },
    spellSlotProgression: { 1: 4, 2: 3, 3: 3, 4: 1, 5: 1 },
    isCustom: false,
  },
  {
    className: 'Paladin',
    cantripProgression: { 3: 0, 10: 1, 17: 2 },
    spellsKnownProgression: { 2: 2, 3: 3, 4: 3, 5: 4, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 17: 6, 19: 6, 20: 6 },
    spellSlotProgression: { 1: 0, 2: 0, 3: 3, 4: 4, 5: 4 },
    isCustom: false,
  },
  {
    className: 'Ranger',
    cantripProgression: { 2: 2, 13: 3 },
    spellsKnownProgression: { 2: 0, 3: 2, 4: 3, 5: 3, 7: 4, 8: 4, 9: 4, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 6, 18: 6, 19: 6, 20: 6 },
    spellSlotProgression: { 1: 0, 2: 0, 3: 2, 4: 3, 5: 3 },
    isCustom: false,
  },
  {
    className: 'Sorcerer',
    cantripProgression: { 1: 4, 10: 5 },
    spellsKnownProgression: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 15, 16: 15, 17: 15, 18: 15, 19: 15, 20: 15 },
    spellSlotProgression: { 1: 4, 2: 3, 3: 3, 4: 1, 5: 1 },
    isCustom: false,
  },
  {
    className: 'Warlock',
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
    spellsKnownProgression: { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5 },
    spellSlotProgression: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    isCustom: false,
  },
  {
    className: 'Wizard',
    cantripProgression: { 1: 3, 4: 4, 10: 5 },
    spellsKnownProgression: { 1: 3, 2: 4, 3: 4, 4: 4, 5: 5, 7: 5, 8: 5, 9: 5, 10: 6, 11: 6, 12: 6, 13: 7, 14: 7, 15: 7, 17: 7, 18: 8, 19: 8, 20: 8 },
    spellSlotProgression: { 1: 4, 2: 3, 3: 3, 4: 1, 5: 1 },
    isCustom: false,
  },
];
