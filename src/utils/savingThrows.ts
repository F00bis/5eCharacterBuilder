import type { Ability, Character, ProficiencyLevel } from '../types';
import { getAbilityBreakdown } from './abilityScores';
import { srdClasses } from '../data/srdClasses';

export type SavingThrowSourceType = 'ability' | 'proficiency' | 'expertise' | 'bonus' | 'advantage';

export interface SavingThrowSource {
  type: SavingThrowSourceType;
  value: number;
  description: string;
}

export interface SavingThrowBreakdown {
  ability: Ability;
  total: number;
  sources: SavingThrowSource[];
}

export const ABILITY_DISPLAY_NAMES: Record<Ability, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

const RACIAL_ADVANTAGE_MAP: Record<string, { abilities: Ability[]; description: string }> = {
  dwarf: { abilities: ['constitution'], description: 'vs poison' },
  elf: { abilities: ['charisma'], description: 'vs charmed' },
  gnome: { abilities: ['intelligence', 'wisdom', 'charisma'], description: 'vs magic' },
  'half-elf': { abilities: ['charisma'], description: 'vs charmed' },
};

function getCharacterSavingThrowProficiency(
  ability: Ability,
  character: Character
): ProficiencyLevel {
  const classProficiencies = new Set<Ability>();

  for (const classEntry of character.classes) {
    const dndClass = srdClasses.find((c) => c.name === classEntry.className);
    if (dndClass) {
      for (const savingThrow of dndClass.savingThrows) {
        classProficiencies.add(savingThrow);
      }
    }
  }

  for (const feat of character.feats) {
    const featProf = feat.savingThrowProficiencies?.[ability];
    if (featProf === 'proficient' || featProf === 'expertise') {
      return featProf;
    }
  }

  if (classProficiencies.has(ability)) {
    return 'proficient';
  }

  return 'none';
}

function getRacialAdvantage(ability: Ability, character: Character): { hasAdvantage: boolean; description: string } {
  const raceLower = character.race.toLowerCase();
  const racialInfo = RACIAL_ADVANTAGE_MAP[raceLower];
  
  if (!racialInfo) {
    return { hasAdvantage: false, description: '' };
  }

  if (racialInfo.abilities.includes(ability)) {
    return { hasAdvantage: true, description: racialInfo.description };
  }

  return { hasAdvantage: false, description: '' };
}

export function getSavingThrowBreakdown(ability: Ability, character: Character): SavingThrowBreakdown {
  const abilityBreakdown = getAbilityBreakdown(ability, character);
  const abilityModifier = abilityBreakdown.modifier;

  const proficiencyLevel = getCharacterSavingThrowProficiency(ability, character);

  let proficiencyBonus = 0;
  if (proficiencyLevel === 'proficient') {
    proficiencyBonus = character.proficiencyBonus;
  } else if (proficiencyLevel === 'expertise') {
    proficiencyBonus = character.proficiencyBonus * 2;
  }

  let equipmentBonus = 0;
  for (const item of character.equipment) {
    const bonus = item.savingThrowModifiers?.[ability];
    if (bonus !== undefined && bonus !== 0) {
      equipmentBonus += bonus;
    }
  }

  const total = abilityModifier + proficiencyBonus + equipmentBonus;

  const sources: SavingThrowSource[] = [];

  sources.push({
    type: 'ability',
    value: abilityModifier,
    description: 'Ability Modifier',
  });

  if (proficiencyLevel === 'proficient') {
    const classSources: string[] = [];
    for (const classEntry of character.classes) {
      const dndClass = srdClasses.find((c) => c.name === classEntry.className);
      if (dndClass && dndClass.savingThrows.includes(ability)) {
        classSources.push(classEntry.className);
      }
    }
    for (const feat of character.feats) {
      if (feat.savingThrowProficiencies?.[ability] === 'proficient') {
        classSources.push(feat.name);
      }
    }
    
    sources.push({
      type: 'proficiency',
      value: proficiencyBonus,
      description: `Proficiency: ${classSources.join(', ')}`,
    });
  } else if (proficiencyLevel === 'expertise') {
    for (const feat of character.feats) {
      if (feat.savingThrowProficiencies?.[ability] === 'expertise') {
        sources.push({
          type: 'expertise',
          value: proficiencyBonus,
          description: `Expertise: ${feat.name} (2x proficiency bonus)`,
        });
      }
    }
  }

  for (const item of character.equipment) {
    const bonus = item.savingThrowModifiers?.[ability];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({
        type: 'bonus',
        value: bonus,
        description: item.name,
      });
    }
  }

  const racialAdvantage = getRacialAdvantage(ability, character);
  if (racialAdvantage.hasAdvantage) {
    sources.push({
      type: 'advantage',
      value: 0,
      description: `${character.race} - ${racialAdvantage.description}`,
    });
  }

  return {
    ability,
    total,
    sources,
  };
}

export function getAllSavingThrowBreakdowns(character: Character): Record<Ability, SavingThrowBreakdown> {
  const abilities: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  
  const breakdowns: Record<Ability, SavingThrowBreakdown> = {} as Record<Ability, SavingThrowBreakdown>;
  
  for (const ability of abilities) {
    breakdowns[ability] = getSavingThrowBreakdown(ability, character);
  }

  return breakdowns;
}
