import { describe, it, expect } from 'vitest';
import type { Character } from '../types';
import { getAbilityBreakdown, calculateProficiencyBonus } from './abilityScores';

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

describe('getAbilityBreakdown', () => {
  it('calculates racialBonus from raceStatSelections', () => {
    const character = baseCharacter({
      raceStatSelections: [
        { ability: 'strength', amount: 2 },
        { ability: 'charisma', amount: 1 },
      ],
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });

    const strBreakdown = getAbilityBreakdown('strength', character);
    expect(strBreakdown.racialBonus).toBe(2);
    expect(strBreakdown.totalScore).toBe(12);

    const chaBreakdown = getAbilityBreakdown('charisma', character);
    expect(chaBreakdown.racialBonus).toBe(1);
    expect(chaBreakdown.totalScore).toBe(11);
  });

  it('uses baseScore from baseAbilityScores', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 15,
        dexterity: 12,
        constitution: 10,
        intelligence: 8,
        wisdom: 13,
        charisma: 10,
      },
      abilityScores: {
        strength: 17,
        dexterity: 14,
        constitution: 12,
        intelligence: 10,
        wisdom: 15,
        charisma: 12,
      },
    });

    const breakdown = getAbilityBreakdown('strength', character);
    expect(breakdown.baseScore).toBe(15);
    expect(breakdown.totalScore).toBe(15);
  });

  it('returns 0 racialBonus when no selection for ability', () => {
    const character = baseCharacter({
      raceStatSelections: [
        { ability: 'strength', amount: 2 },
      ],
    });

    const dexBreakdown = getAbilityBreakdown('dexterity', character);
    expect(dexBreakdown.racialBonus).toBe(0);
  });

  it('calculates totalScore = base + racial + feats + equipment', () => {
    const character = baseCharacter({
      raceStatSelections: [
        { ability: 'strength', amount: 1 },
      ],
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      feats: [
        { name: 'Heavy Armor Master', description: '', statModifiers: { strength: 1 } },
      ],
      equipment: [
        {
          name: 'Gauntlets of Ogre Power',
          rarity: 'uncommon',
          weight: 1,
          description: '',
          statModifiers: { strength: 2 },
          equipped: true,
        },
      ],
    });

    const breakdown = getAbilityBreakdown('strength', character);
    expect(breakdown.baseScore).toBe(10);
    expect(breakdown.racialBonus).toBe(1);
    expect(breakdown.featSources).toHaveLength(1);
    expect(breakdown.featSources[0].value).toBe(1);
    expect(breakdown.equipmentSources).toHaveLength(1);
    expect(breakdown.equipmentSources[0].value).toBe(2);
    expect(breakdown.totalScore).toBe(14);
  });

  it('falls back to abilityScores when baseAbilityScores is missing', () => {
    const character = baseCharacter({
      baseAbilityScores: undefined,
      abilityScores: {
        strength: 15,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });

    const breakdown = getAbilityBreakdown('strength', character);
    expect(breakdown.baseScore).toBe(15);
  });
});

describe('calculateProficiencyBonus', () => {
  it('returns +2 for levels 1-4', () => {
    expect(calculateProficiencyBonus(1)).toBe(2);
    expect(calculateProficiencyBonus(2)).toBe(2);
    expect(calculateProficiencyBonus(3)).toBe(2);
    expect(calculateProficiencyBonus(4)).toBe(2);
  });

  it('returns +3 for levels 5-8', () => {
    expect(calculateProficiencyBonus(5)).toBe(3);
    expect(calculateProficiencyBonus(6)).toBe(3);
    expect(calculateProficiencyBonus(7)).toBe(3);
    expect(calculateProficiencyBonus(8)).toBe(3);
  });

  it('returns +4 for levels 9-12', () => {
    expect(calculateProficiencyBonus(9)).toBe(4);
    expect(calculateProficiencyBonus(10)).toBe(4);
    expect(calculateProficiencyBonus(11)).toBe(4);
    expect(calculateProficiencyBonus(12)).toBe(4);
  });

  it('returns +5 for levels 13-16', () => {
    expect(calculateProficiencyBonus(13)).toBe(5);
    expect(calculateProficiencyBonus(14)).toBe(5);
    expect(calculateProficiencyBonus(15)).toBe(5);
    expect(calculateProficiencyBonus(16)).toBe(5);
  });

  it('returns +6 for levels 17-20', () => {
    expect(calculateProficiencyBonus(17)).toBe(6);
    expect(calculateProficiencyBonus(18)).toBe(6);
    expect(calculateProficiencyBonus(19)).toBe(6);
    expect(calculateProficiencyBonus(20)).toBe(6);
  });

  it('handles edge cases', () => {
    expect(calculateProficiencyBonus(0)).toBe(1);
    expect(calculateProficiencyBonus(-1)).toBe(1);
  });
});
