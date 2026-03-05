import type { Ability, Character, ProficiencyLevel, Skill } from '../types';
import { getAbilityBreakdown, type AbilityBreakdown } from './abilityScores';

export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  athletics: 'strength',
  acrobatics: 'dexterity',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  arcana: 'intelligence',
  history: 'intelligence',
  investigation: 'intelligence',
  nature: 'intelligence',
  religion: 'intelligence',
  animalHandling: 'wisdom',
  insight: 'wisdom',
  medicine: 'wisdom',
  perception: 'wisdom',
  survival: 'wisdom',
  deception: 'charisma',
  intimidation: 'charisma',
  performance: 'charisma',
  persuasion: 'charisma',
};

export const SKILL_DISPLAY_NAMES: Record<Skill, string> = {
  athletics: 'Athletics',
  acrobatics: 'Acrobatics',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  arcana: 'Arcana',
  history: 'History',
  investigation: 'Investigation',
  nature: 'Nature',
  religion: 'Religion',
  animalHandling: 'Animal Handling',
  insight: 'Insight',
  medicine: 'Medicine',
  perception: 'Perception',
  survival: 'Survival',
  deception: 'Deception',
  intimidation: 'Intimidation',
  performance: 'Performance',
  persuasion: 'Persuasion',
};

export const SKILLS_BY_ABILITY: Record<Ability, Skill[]> = {
  strength: ['athletics'],
  dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
  constitution: [],
  intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
  wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
  charisma: ['deception', 'intimidation', 'performance', 'persuasion'],
};

export interface SkillBonusSource {
  name: string;
  type: 'ability' | 'proficiency' | 'expertise' | 'feat' | 'equipment';
  value: number;
}

export interface SkillBreakdown {
  skill: Skill;
  ability: Ability;
  proficiencyLevel: ProficiencyLevel;
  abilityModifier: number;
  proficiencyBonus: number;
  featBonus: number;
  equipmentBonus: number;
  totalBonus: number;
  sources: SkillBonusSource[];
}

export function getSkillBreakdown(
  skill: Skill,
  character: Character,
  abilityBreakdown: AbilityBreakdown
): SkillBreakdown {
  const ability = SKILL_ABILITY_MAP[skill];
  const abilityModifier = abilityBreakdown.modifier;

  // Find proficiency level from character.skills
  const skillProficiency = character.skills.find((s) => s.skill === skill);
  const proficiencyLevel: ProficiencyLevel = skillProficiency?.level ?? 'none';

  // Calculate proficiency contribution
  let proficiencyBonus = 0;
  if (proficiencyLevel === 'proficient') {
    proficiencyBonus = character.proficiencyBonus;
  } else if (proficiencyLevel === 'expertise') {
    proficiencyBonus = character.proficiencyBonus * 2;
  }

  // Sum feat skill bonuses
  let featBonus = 0;
  for (const feat of character.feats) {
    const bonus = feat.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      featBonus += bonus;
    }
  }

  // Sum equipment skill bonuses
  let equipmentBonus = 0;
  for (const item of character.equipment) {
    const bonus = item.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      equipmentBonus += bonus;
    }
  }

  const totalBonus = abilityModifier + proficiencyBonus + featBonus + equipmentBonus;

  // Build sources array for tooltip
  const sources: SkillBonusSource[] = [];

  // Always include ability modifier
  const abilityName = ability.charAt(0).toUpperCase() + ability.slice(1);
  sources.push({
    name: `${abilityName} modifier`,
    type: 'ability',
    value: abilityModifier,
  });

  // Add proficiency/expertise if applicable
  if (proficiencyLevel === 'proficient') {
    sources.push({
      name: 'Proficiency bonus',
      type: 'proficiency',
      value: proficiencyBonus,
    });
  } else if (proficiencyLevel === 'expertise') {
    sources.push({
      name: 'Expertise',
      type: 'expertise',
      value: proficiencyBonus,
    });
  }

  // Add feat bonuses
  for (const feat of character.feats) {
    const bonus = feat.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({
        name: feat.name,
        type: 'feat',
        value: bonus,
      });
    }
  }

  // Add equipment bonuses
  for (const item of character.equipment) {
    const bonus = item.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({
        name: item.name,
        type: 'equipment',
        value: bonus,
      });
    }
  }

  return {
    skill,
    ability,
    proficiencyLevel,
    abilityModifier,
    proficiencyBonus,
    featBonus,
    equipmentBonus,
    totalBonus,
    sources,
  };
}

export function getAllSkillBreakdowns(character: Character): SkillBreakdown[] {
  // Compute all ability breakdowns once
  const abilityBreakdowns: Record<Ability, AbilityBreakdown> = {
    strength: getAbilityBreakdown('strength', character),
    dexterity: getAbilityBreakdown('dexterity', character),
    constitution: getAbilityBreakdown('constitution', character),
    intelligence: getAbilityBreakdown('intelligence', character),
    wisdom: getAbilityBreakdown('wisdom', character),
    charisma: getAbilityBreakdown('charisma', character),
  };

  // Get all 18 skills
  const allSkills: Skill[] = Object.keys(SKILL_ABILITY_MAP) as Skill[];

  return allSkills.map((skill) => {
    const ability = SKILL_ABILITY_MAP[skill];
    const abilityBreakdown = abilityBreakdowns[ability];
    return getSkillBreakdown(skill, character, abilityBreakdown);
  });
}
