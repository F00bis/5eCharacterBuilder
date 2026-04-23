import { describe, expect, it } from 'vitest';
import type { Character, Equipment } from '../types';
import { getWeaponAttack } from './attackCalculations';

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
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
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

function baseWeapon(overrides: Partial<Equipment> = {}): Equipment {
  return {
    name: 'Weapon',
    rarity: 'common',
    weight: 1,
    description: 'Test weapon',
    weaponCategory: 'Martial Melee',
    damage: '1d8 piercing',
    properties: [],
    ...overrides,
  };
}

describe('getWeaponAttack finesse ability selection', () => {
  it('uses DEX for finesse weapon when DEX mod is higher (weaponProperties)', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 14,
        dexterity: 18,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Rapier',
      weaponProperties: ['Finesse'],
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(7);
    expect(attack.damage).toBe('1d8+4');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Dexterity modifier', value: 4 });
    expect(attack.damageBonusSources).toContainEqual({ name: 'Dexterity modifier', value: 4 });
  });

  it('uses STR for finesse weapon when STR mod is higher', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 20,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Whip',
      weaponProperties: ['Finesse'],
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(8);
    expect(attack.damage).toBe('1d8+5');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Strength modifier', value: 5 });
    expect(attack.damageBonusSources).toContainEqual({ name: 'Strength modifier', value: 5 });
  });

  it('uses STR on finesse tie', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 16,
        dexterity: 16,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Dagger',
      weaponProperties: ['Finesse', 'Light'],
      damage: '1d4 piercing',
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(6);
    expect(attack.damage).toBe('1d4+3');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Strength modifier', value: 3 });
    expect(attack.damageBonusSources).toContainEqual({ name: 'Strength modifier', value: 3 });
  });

  it('detects finesse from legacy properties list', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 12,
        dexterity: 18,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Legacy Rapier',
      properties: ['Finesse'],
      weaponProperties: undefined,
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(7);
    expect(attack.damage).toBe('1d8+4');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Dexterity modifier', value: 4 });
  });

  it('keeps non-finesse ranged weapons DEX-based', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 20,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Longbow',
      weaponCategory: 'Martial Ranged',
      weaponProperties: ['Ammunition', 'Two-Handed'],
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(5);
    expect(attack.damage).toBe('1d8+2');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Dexterity modifier', value: 2 });
  });

  it('keeps non-finesse melee weapons STR-based', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 18,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const weapon = baseWeapon({
      name: 'Longsword',
      weaponProperties: ['Versatile'],
    });

    const attack = getWeaponAttack(character, weapon);

    expect(attack.toHit).toBe(7);
    expect(attack.damage).toBe('1d8+4');
    expect(attack.toHitBreakdown[0]).toEqual({ name: 'Strength modifier', value: 4 });
  });
});
