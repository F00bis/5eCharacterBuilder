import { describe, it, expect } from 'vitest';
import type { Character } from '../types';
import { getSkillBreakdown, getAllSkillBreakdowns } from './skills';
import { getAbilityBreakdown } from './abilityScores';

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

describe('getSkillBreakdown', () => {
  it('calculates skill bonus with no proficiency (just ability modifier)', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 16, // +3 modifier
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 16,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });

    const abilityBreakdown = getAbilityBreakdown('strength', character);
    const breakdown = getSkillBreakdown('athletics', character, abilityBreakdown);

    expect(breakdown.skill).toBe('athletics');
    expect(breakdown.ability).toBe('strength');
    expect(breakdown.proficiencyLevel).toBe('none');
    expect(breakdown.abilityModifier).toBe(3);
    expect(breakdown.proficiencyBonus).toBe(0);
    expect(breakdown.featBonus).toBe(0);
    expect(breakdown.equipmentBonus).toBe(0);
    expect(breakdown.totalBonus).toBe(3);
    expect(breakdown.sources).toHaveLength(1);
    expect(breakdown.sources[0]).toEqual({
      name: 'Strength modifier',
      type: 'ability',
      value: 3,
    });
  });

  it('adds proficiency bonus when proficient', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 14, // +2 modifier
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 14,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'athletics', ability: 'strength', level: 'proficient' }],
    });

    const abilityBreakdown = getAbilityBreakdown('strength', character);
    const breakdown = getSkillBreakdown('athletics', character, abilityBreakdown);

    expect(breakdown.proficiencyLevel).toBe('proficient');
    expect(breakdown.abilityModifier).toBe(2);
    expect(breakdown.proficiencyBonus).toBe(3);
    expect(breakdown.totalBonus).toBe(5); // 2 + 3
    expect(breakdown.sources).toHaveLength(2);
    expect(breakdown.sources[1]).toEqual({
      name: 'Proficiency bonus',
      type: 'proficiency',
      value: 3,
    });
  });

  it('doubles proficiency bonus with expertise', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 16, // +3 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 16,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'stealth', ability: 'dexterity', level: 'expertise' }],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.proficiencyLevel).toBe('expertise');
    expect(breakdown.abilityModifier).toBe(3);
    expect(breakdown.proficiencyBonus).toBe(6); // 3 * 2
    expect(breakdown.totalBonus).toBe(9); // 3 + 6
    expect(breakdown.sources).toHaveLength(2);
    expect(breakdown.sources[1]).toEqual({
      name: 'Expertise',
      type: 'expertise',
      value: 6,
    });
  });

  it('adds feat skill modifiers', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 14, // +2 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'stealth', ability: 'dexterity', level: 'proficient' }],
      feats: [
        {
          name: 'Skill Expert',
          description: 'Gain proficiency and expertise in a skill',
          statModifiers: {},
          skillModifiers: { stealth: 2 },
        },
      ],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.featBonus).toBe(2);
    expect(breakdown.totalBonus).toBe(7); // 2 (ability) + 3 (proficiency) + 2 (feat)
    expect(breakdown.sources).toHaveLength(3);
    expect(breakdown.sources[2]).toEqual({
      name: 'Skill Expert',
      type: 'feat',
      value: 2,
    });
  });

  it('adds equipment skill modifiers', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 14, // +2 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      equipment: [
        {
          name: 'Cloak of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Grants advantage on Stealth checks',
          skillModifiers: { stealth: 5 },
          equipped: true,
        },
      ],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.equipmentBonus).toBe(5);
    expect(breakdown.totalBonus).toBe(7); // 2 (ability) + 5 (equipment)
    expect(breakdown.sources).toHaveLength(2);
    expect(breakdown.sources[1]).toEqual({
      name: 'Cloak of Elvenkind',
      type: 'equipment',
      value: 5,
    });
  });

  it('stacks all bonus sources correctly', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 18, // +4 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 18,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 4,
      skills: [{ skill: 'stealth', ability: 'dexterity', level: 'expertise' }],
      feats: [
        {
          name: 'Skill Expert',
          description: 'Gain proficiency and expertise in a skill',
          statModifiers: {},
          skillModifiers: { stealth: 2 },
        },
      ],
      equipment: [
        {
          name: 'Cloak of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Grants advantage on Stealth checks',
          skillModifiers: { stealth: 5 },
          equipped: true,
        },
      ],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.abilityModifier).toBe(4);
    expect(breakdown.proficiencyBonus).toBe(8); // 4 * 2 (expertise)
    expect(breakdown.featBonus).toBe(2);
    expect(breakdown.equipmentBonus).toBe(5);
    expect(breakdown.totalBonus).toBe(19); // 4 + 8 + 2 + 5
    expect(breakdown.sources).toHaveLength(4);
  });

  it('handles multiple feat bonuses to the same skill', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 14, // +2 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      feats: [
        {
          name: 'Skill Expert',
          description: 'Gain proficiency and expertise in a skill',
          statModifiers: {},
          skillModifiers: { stealth: 2 },
        },
        {
          name: 'Shadow Touched',
          description: 'Learn invisibility and increase stealth',
          statModifiers: {},
          skillModifiers: { stealth: 1 },
        },
      ],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.featBonus).toBe(3); // 2 + 1
    expect(breakdown.totalBonus).toBe(5); // 2 (ability) + 3 (feats)
    expect(breakdown.sources).toHaveLength(3); // ability + 2 feats
  });

  it('handles multiple equipment bonuses to the same skill', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 14, // +2 modifier
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      equipment: [
        {
          name: 'Cloak of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Grants advantage on Stealth checks',
          skillModifiers: { stealth: 5 },
          equipped: true,
        },
        {
          name: 'Boots of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Your steps make no sound',
          skillModifiers: { stealth: 3 },
          equipped: true,
        },
      ],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('stealth', character, abilityBreakdown);

    expect(breakdown.equipmentBonus).toBe(8); // 5 + 3
    expect(breakdown.totalBonus).toBe(10); // 2 (ability) + 8 (equipment)
    expect(breakdown.sources).toHaveLength(3); // ability + 2 equipment
  });

  it('handles negative ability modifiers', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 8, // -1 modifier
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 8,
        wisdom: 10,
        charisma: 10,
      },
    });

    const abilityBreakdown = getAbilityBreakdown('intelligence', character);
    const breakdown = getSkillBreakdown('arcana', character, abilityBreakdown);

    expect(breakdown.abilityModifier).toBe(-1);
    expect(breakdown.totalBonus).toBe(-1);
  });

  it('defaults to none proficiency when skill not in character.skills', () => {
    const character = baseCharacter({
      skills: [{ skill: 'athletics', ability: 'strength', level: 'proficient' }],
    });

    const abilityBreakdown = getAbilityBreakdown('dexterity', character);
    const breakdown = getSkillBreakdown('acrobatics', character, abilityBreakdown);

    expect(breakdown.proficiencyLevel).toBe('none');
    expect(breakdown.proficiencyBonus).toBe(0);
  });
});

describe('getAllSkillBreakdowns', () => {
  it('returns breakdowns for all 18 skills', () => {
    const character = baseCharacter();
    const breakdowns = getAllSkillBreakdowns(character);

    expect(breakdowns).toHaveLength(18);
  });

  it('includes all standard D&D skills', () => {
    const character = baseCharacter();
    const breakdowns = getAllSkillBreakdowns(character);

    const skillNames = breakdowns.map((b) => b.skill);
    expect(skillNames).toContain('athletics');
    expect(skillNames).toContain('acrobatics');
    expect(skillNames).toContain('sleightOfHand');
    expect(skillNames).toContain('stealth');
    expect(skillNames).toContain('arcana');
    expect(skillNames).toContain('history');
    expect(skillNames).toContain('investigation');
    expect(skillNames).toContain('nature');
    expect(skillNames).toContain('religion');
    expect(skillNames).toContain('animalHandling');
    expect(skillNames).toContain('insight');
    expect(skillNames).toContain('medicine');
    expect(skillNames).toContain('perception');
    expect(skillNames).toContain('survival');
    expect(skillNames).toContain('deception');
    expect(skillNames).toContain('intimidation');
    expect(skillNames).toContain('performance');
    expect(skillNames).toContain('persuasion');
  });

  it('correctly calculates bonuses for proficient skills', () => {
    const character = baseCharacter({
      baseAbilityScores: {
        strength: 16, // +3
        dexterity: 14, // +2
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      abilityScores: {
        strength: 16,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [
        { skill: 'athletics', ability: 'strength', level: 'proficient' },
        { skill: 'stealth', ability: 'dexterity', level: 'expertise' },
      ],
    });

    const breakdowns = getAllSkillBreakdowns(character);

    const athletics = breakdowns.find((b) => b.skill === 'athletics');
    expect(athletics?.totalBonus).toBe(6); // 3 (ability) + 3 (proficiency)

    const stealth = breakdowns.find((b) => b.skill === 'stealth');
    expect(stealth?.totalBonus).toBe(8); // 2 (ability) + 6 (expertise)

    const acrobatics = breakdowns.find((b) => b.skill === 'acrobatics');
    expect(acrobatics?.totalBonus).toBe(2); // 2 (ability), no proficiency
  });
});
