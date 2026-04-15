import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Character } from '../types';
import { getCharacterFeatures } from './characterFeatures';

vi.mock('../db/index', () => ({
  db: {
    races: {
      get: vi.fn(),
    },
  },
}));

vi.mock('../db/classes', () => ({
  getClassByName: vi.fn(),
}));

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
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('getCharacterFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters feature to selected choice only', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['strength' as const, 'constitution' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'acrobatics'],
      asiLevels: [4, 6, 8, 12, 14, 16, 19],
      features: [
        {
          name: 'Fighting Style',
          description: 'Choose a fighting style: Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting.',
          levelAcquired: 1,
          choices: { count: 1, options: ['Archery', 'Defense', 'Dueling', 'Great Weapon Fighting', 'Protection', 'Two-Weapon Fighting'] },
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      featureChoices: {
        'fighter-1-fighting-style': 'Defense',
      },
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features[0].description).toBe('Fighting Style: Defense');
  });

  it('skips features without user selection', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['strength' as const, 'constitution' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'acrobatics'],
      asiLevels: [4, 6, 8, 12, 14, 16, 19],
      features: [
        {
          name: 'Fighting Style',
          description: 'Choose a fighting style.',
          levelAcquired: 1,
          choices: { count: 1, options: ['Archery', 'Defense'] },
        },
        {
          name: 'Second Wind',
          description: 'On your turn, you can use a bonus action to regain hit points.',
          levelAcquired: 1,
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      featureChoices: {},
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features).toHaveLength(1);
    expect(result.classFeatures[0].features[0].name).toBe('Second Wind');
  });

  it('handles multiple feature choices', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['strength' as const, 'constitution' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'acrobatics'],
      asiLevels: [4, 6, 8, 12, 14, 16, 19],
      features: [
        {
          name: 'Fighting Style',
          description: 'Choose a fighting style.',
          levelAcquired: 1,
          choices: { count: 1, options: ['Archery', 'Defense', 'Dueling'] },
        },
        {
          name: 'Action Surge',
          description: 'You can push yourself beyond your normal limits for a moment.',
          levelAcquired: 2,
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      featureChoices: {
        'fighter-1-fighting-style': 'Defense',
      },
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features).toHaveLength(2);
    expect(result.classFeatures[0].features[0].description).toBe('Fighting Style: Defense');
    expect(result.classFeatures[0].features[1].name).toBe('Action Surge');
  });

  it('handles string vs array choice values', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['strength' as const, 'constitution' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'acrobatics'],
      asiLevels: [4, 6, 8, 12, 14, 16, 19],
      features: [
        {
          name: 'Fighting Style',
          description: 'Choose a fighting style.',
          levelAcquired: 1,
          choices: { count: 1, options: ['Archery', 'Defense'] },
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const characterWithStringChoice = baseCharacter({
      featureChoices: {
        'fighter-1-fighting-style': 'Defense',
      },
    });

    const characterWithArrayChoice = baseCharacter({
      featureChoices: {
        'fighter-1-fighting-style': ['Defense'],
      },
    });

    const resultString = await getCharacterFeatures(characterWithStringChoice);
    const resultArray = await getCharacterFeatures(characterWithArrayChoice);

    expect(resultString.classFeatures[0].features[0].description).toBe('Fighting Style: Defense');
    expect(resultArray.classFeatures[0].features[0].description).toBe('Fighting Style: Defense');
  });

  it('renders non-level-1 martial subclass choice with detail text', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['strength' as const, 'constitution' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'acrobatics'],
      asiLevels: [4, 6, 8, 12, 14, 16, 19],
      features: [
        {
          name: 'Martial Archetype',
          description: 'Choose an archetype.',
          levelAcquired: 3,
          choices: {
            count: 1,
            options: ['Champion', 'Battle Master', 'Eldritch Knight'],
            optionDetails: {
              'Champion': 'A straightforward warrior focused on critical hits and athletic prowess.',
              'Battle Master': 'A tactical fighter who uses maneuvers and superiority dice.',
              'Eldritch Knight': 'A weapon master who blends martial combat with wizard magic.',
            },
          },
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      classes: [{ className: 'Fighter', level: 3 }],
      featureChoices: {
        'fighter-3-martial-archetype': 'Champion',
      },
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features[0].description).toBe(
      'Martial Archetype: Champion: A straightforward warrior focused on critical hits and athletic prowess.'
    );
  });

  it('renders non-level-1 spellcaster subclass choice with detail text', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Wizard',
      hitDie: 6,
      primaryAbility: 'intelligence' as const,
      savingThrows: ['intelligence' as const, 'wisdom' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['arcana', 'history'],
      asiLevels: [4, 8, 12, 16, 19],
      features: [
        {
          name: 'Arcane Tradition',
          description: 'Choose a school.',
          levelAcquired: 2,
          choices: {
            count: 1,
            options: ['School of Evocation', 'School of Illusion'],
            optionDetails: {
              'School of Evocation': 'Focuses on shaping powerful elemental blasts while protecting allies.',
              'School of Illusion': 'Specializes in deceptive magic that confuses and misdirects enemies.',
            },
          },
        },
      ],
      startingEquipment: {
        startingGoldFormula: '4d4×10',
        startingGoldAverage: 100,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      classes: [{ className: 'Wizard', level: 2 }],
      featureChoices: {
        'wizard-2-arcane-tradition': 'School of Evocation',
      },
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features[0].description).toBe(
      'Arcane Tradition: School of Evocation: Focuses on shaping powerful elemental blasts while protecting allies.'
    );
  });

  it('renders non-level-1 oath choice with detail text', async () => {
    const { db } = await import('../db/index');
    const { getClassByName } = await import('../db/classes');

    vi.mocked(db.races.get).mockResolvedValue({
      id: 'human',
      name: 'Human',
      abilityScoreIncreases: [],
      speed: 30,
      size: 'Medium' as const,
      languages: ['Common'],
      additionalLanguages: 1,
      features: [],
      savingThrowFeatures: [],
    });

    vi.mocked(getClassByName).mockResolvedValue({
      name: 'Paladin',
      hitDie: 10,
      primaryAbility: 'strength' as const,
      savingThrows: ['wisdom' as const, 'charisma' as const],
      skillProficienciesChoices: 2,
      skillOptions: ['athletics', 'persuasion'],
      asiLevels: [4, 8, 12, 16, 19],
      features: [
        {
          name: 'Sacred Oath',
          description: 'Choose an oath.',
          levelAcquired: 3,
          choices: {
            count: 1,
            options: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'],
            optionDetails: {
              'Oath of Devotion': 'A classic holy knight dedicated to honesty, courage, and justice.',
              'Oath of the Ancients': 'A guardian of life and light who protects joy and the natural world.',
              'Oath of Vengeance': 'A relentless avenger who hunts down greater evils.',
            },
          },
        },
      ],
      startingEquipment: {
        startingGoldFormula: '5d4×10',
        startingGoldAverage: 125,
        choices: [],
        fixedEquipment: [],
      },
    });

    const character = baseCharacter({
      classes: [{ className: 'Paladin', level: 3 }],
      featureChoices: {
        'paladin-3-sacred-oath': 'Oath of Devotion',
      },
    });

    const result = await getCharacterFeatures(character);
    expect(result.classFeatures[0].features[0].description).toBe(
      'Sacred Oath: Oath of Devotion: A classic holy knight dedicated to honesty, courage, and justice.'
    );
  });
});
