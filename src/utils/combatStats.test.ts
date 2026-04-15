import { describe, it, expect } from 'vitest';
import type { Character } from '../types';
import { calculateMaxHp } from './combatStats';

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Fighter', level: 5 }],
    raceStatSelections: [],
    baseAbilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    featureChoices: {},
    hpRolls: [],
    level: 5,
    xp: 3500,
    portrait: null,
    hpBonus: 0,
    hp: 40,
    maxHp: 40,
    currentHp: 40,
    tempHp: 0,
    ac: 16,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: {successes: 0, failures: 0},
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    currency: {cp: 0, sp: 0, ep: 0, gp: 0, pp: 0},
    spellSlots: [],
    spells: [],
    statusEffects: [],
    feats: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    ...overrides,
  };
}

describe('calculateMaxHp', () => {
  it('calculates HP with all components (hpRolls + conMod×level + hpBonus)', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      hpRolls: [6, 7],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 16, // +3 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 5,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(6 + 7 + (3 * 3) + 5);
    expect(result).toBe(27);
  });

  it('handles empty hpRolls array', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      hpRolls: [],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 14, // +2 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(0 + (2 * 3) + 0);
    expect(result).toBe(6);
  });

  it('handles undefined hpRolls by falling back to maxHp', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 14, // +2 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
      maxHp: 30,
      hpRolls: undefined,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(30 + (2 * 3) + 0);
    expect(result).toBe(36);
  });

  it('handles zero hpBonus', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      hpRolls: [8, 6, 7],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 14, // +2 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(8 + 6 + 7 + (2 * 3) + 0);
    expect(result).toBe(27);
  });

  it('handles CON 8 (-1 modifier)', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 5 }],
      hpRolls: [6, 7, 6, 8],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 8, // -1 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(6 + 7 + 6 + 8 + (-1 * 5) + 0);
    expect(result).toBe(22);
  });

  it('handles CON 20 (+5 modifier)', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 4 }],
      hpRolls: [6, 7, 6],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 20, // +5 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(6 + 7 + 6 + (5 * 4) + 0);
    expect(result).toBe(39);
  });

  it('handles single level character', () => {
    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 1 }],
      hpRolls: [10],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 14, // +2 modifier
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hpBonus: 0,
    });

    const result = calculateMaxHp(character);
    expect(result).toBe(10 + (2 * 1) + 0);
    expect(result).toBe(12);
  });
});
