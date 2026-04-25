import { describe, it, expect } from 'vitest';
import type { Character } from '../types';
import type { DndClass } from '../types/classes';
import { getArmorClass } from './armorClass';

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [],
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
    level: 1,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 10,
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 2,
    skills: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    feats: [],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const barbarianClass: DndClass = {
  name: 'Barbarian',
  hitDie: 12,
  primaryAbility: 'strength',
  savingThrows: ['strength', 'constitution'],
  skillProficienciesChoices: 2,
  skillOptions: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
  asiLevels: [4, 8, 12, 16, 19],
  startingEquipment: {
    startingGoldFormula: '2d4 * 10',
    startingGoldAverage: 50,
    choices: [],
    fixedEquipment: [],
  },
  features: [
    {
      name: 'Unarmored Defense',
      description: 'Barbarian unarmored defense',
      levelAcquired: 1,
      effects: {
        acCalculation: {
          base: 10,
          abilityModifiers: ['dexterity', 'constitution'],
          requiresNoArmor: true,
          requiresNoShield: false,
          allowShield: true,
        },
      },
    },
  ],
};

const monkClass: DndClass = {
  name: 'Monk',
  hitDie: 8,
  primaryAbility: 'dexterity',
  savingThrows: ['strength', 'dexterity'],
  skillProficienciesChoices: 1,
  skillOptions: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
  asiLevels: [4, 8, 12, 16, 19],
  startingEquipment: {
    startingGoldFormula: '5d4',
    startingGoldAverage: 12,
    choices: [],
    fixedEquipment: [],
  },
  features: [
    {
      name: 'Unarmored Defense',
      description: 'Monk unarmored defense',
      levelAcquired: 1,
      effects: {
        acCalculation: {
          base: 10,
          abilityModifiers: ['dexterity', 'wisdom'],
          requiresNoArmor: true,
          requiresNoShield: true,
          allowShield: false,
        },
      },
    },
  ],
};

const sorcererClass: DndClass = {
  name: 'Sorcerer',
  hitDie: 6,
  primaryAbility: 'charisma',
  savingThrows: ['constitution', 'charisma'],
  skillProficienciesChoices: 2,
  skillOptions: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
  asiLevels: [4, 8, 12, 16, 19],
  spellcastingAbility: 'charisma',
  spellPrepType: 'known',
  startingEquipment: {
    startingGoldFormula: '3d4 * 10',
    startingGoldAverage: 75,
    choices: [],
    fixedEquipment: [],
  },
  features: [
    {
      name: 'Sorcerous Origin',
      description: 'Choose a sorcerous origin',
      levelAcquired: 1,
      choices: {
        count: 1,
        options: ['Draconic Bloodline', 'Wild Magic'],
      },
    },
    {
      name: 'Draconic Resilience',
      description: 'Draconic resilience AC',
      levelAcquired: 1,
      requiredFeatureChoice: {
        featureKey: 'sorcerer-1-sorcerous-origin',
        expectedValue: 'Draconic Bloodline',
      },
      effects: {
        acCalculation: {
          base: 13,
          abilityModifiers: ['dexterity'],
          requiresNoArmor: true,
          requiresNoShield: false,
          allowShield: true,
        },
      },
    },
  ],
};

const classMap = new Map<string, DndClass>([
  ['Barbarian', barbarianClass],
  ['Monk', monkClass],
  ['Sorcerer', sorcererClass],
]);

describe('getArmorClass', () => {
  it('returns base AC with dexterity modifier when no armor and no relevant classes', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(12);
    expect(result.sources).toEqual([
      { description: 'Base (no armor)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
    ]);
  });

  it('calculates barbarian unarmored defense without shield', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      classes: [{ className: 'Barbarian', level: 1 }],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(15);
    expect(result.sources).toEqual([
      { description: 'Unarmored Defense (Barbarian)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
      { description: 'Constitution modifier', value: 3 },
    ]);
  });

  it('calculates barbarian unarmored defense with shield', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      classes: [{ className: 'Barbarian', level: 1 }],
      equipment: [
        {
          name: 'Shield',
          rarity: 'common',
          weight: 6,
          description: 'A shield',
          armorCategory: 'Shield',
          armorClass: 2,
          equipped: true,
        },
      ],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(17);
    expect(result.sources).toEqual([
      { description: 'Unarmored Defense (Barbarian)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
      { description: 'Constitution modifier', value: 3 },
      { description: 'Shield', value: 2 },
    ]);
  });

  it('calculates monk unarmored defense without shield', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 16,
        charisma: 10,
      },
      classes: [{ className: 'Monk', level: 1 }],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(15);
    expect(result.sources).toEqual([
      { description: 'Unarmored Defense (Monk)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
      { description: 'Wisdom modifier', value: 3 },
    ]);
  });

  it('reverts to base AC when monk wields a shield', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 16,
        charisma: 10,
      },
      classes: [{ className: 'Monk', level: 1 }],
      equipment: [
        {
          name: 'Shield',
          rarity: 'common',
          weight: 6,
          description: 'A shield',
          armorCategory: 'Shield',
          armorClass: 2,
          equipped: true,
        },
      ],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(14);
    expect(result.sources).toEqual([
      { description: 'Base (no armor)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
      { description: 'Shield', value: 2 },
    ]);
  });

  it('ignores class features when wearing armor', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      classes: [{ className: 'Barbarian', level: 1 }],
      equipment: [
        {
          name: 'Leather Armor',
          rarity: 'common',
          weight: 10,
          description: 'Light armor',
          armorCategory: 'Light',
          armorClass: 11,
          equipped: true,
        },
      ],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(13);
    expect(result.sources).toEqual([
      { description: 'Leather Armor (Light)', value: 11 },
      { description: 'Dexterity modifier', value: 2 },
    ]);
  });

  it('activates draconic resilience for draconic bloodline sorcerer', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 16,
      },
      classes: [{ className: 'Sorcerer', level: 1 }],
      featureChoices: {
        'sorcerer-1-sorcerous-origin': 'Draconic Bloodline',
      },
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(15);
    expect(result.sources).toEqual([
      { description: 'Draconic Resilience (Sorcerer)', value: 13 },
      { description: 'Dexterity modifier', value: 2 },
    ]);
  });

  it('does not activate draconic resilience for wild magic sorcerer', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 16,
      },
      classes: [{ className: 'Sorcerer', level: 1 }],
      featureChoices: {
        'sorcerer-1-sorcerous-origin': 'Wild Magic',
      },
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(12);
    expect(result.sources).toEqual([
      { description: 'Base (no armor)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
    ]);
  });

  it('picks the highest available unarmored AC for multiclass characters', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 8,
        charisma: 10,
      },
      classes: [
        { className: 'Barbarian', level: 1 },
        { className: 'Monk', level: 1 },
      ],
    });
    const result = getArmorClass(character, classMap);
    // Barbarian: 10 + 2 + 3 = 15
    // Monk: 10 + 2 - 1 = 11
    // Base: 10 + 2 = 12
    expect(result.total).toBe(15);
    expect(result.sources).toEqual([
      { description: 'Unarmored Defense (Barbarian)', value: 10 },
      { description: 'Dexterity modifier', value: 2 },
      { description: 'Constitution modifier', value: 3 },
    ]);
  });

  it('supports homebrew class AC calculations', () => {
    const homebrewClass: DndClass = {
      name: 'Iron Monk',
      hitDie: 8,
      primaryAbility: 'strength',
      savingThrows: ['strength', 'constitution'],
      skillProficienciesChoices: 1,
      skillOptions: ['athletics'],
      asiLevels: [4],
      startingEquipment: {
        startingGoldFormula: '5d4',
        startingGoldAverage: 12,
        choices: [],
        fixedEquipment: [],
      },
      features: [
        {
          name: 'Steel Skin',
          description: 'AC = 12 + Con',
          levelAcquired: 1,
          effects: {
            acCalculation: {
              base: 12,
              abilityModifiers: ['constitution'],
              requiresNoArmor: true,
              requiresNoShield: true,
              allowShield: false,
            },
          },
        },
      ],
    };

    const homebrewMap = new Map<string, DndClass>([['Iron Monk', homebrewClass]]);
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 16,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      classes: [{ className: 'Iron Monk', level: 1 }],
    });
    const result = getArmorClass(character, homebrewMap);
    expect(result.total).toBe(15);
    expect(result.sources).toEqual([
      { description: 'Steel Skin (Iron Monk)', value: 12 },
      { description: 'Constitution modifier', value: 3 },
    ]);
  });

  it('ignores features above class level', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      classes: [{ className: 'Barbarian', level: 0 }],
    });
    const result = getArmorClass(character, classMap);
    expect(result.total).toBe(12);
  });
});
