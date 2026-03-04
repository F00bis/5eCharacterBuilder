import type { Ability, Character } from '../types';

export interface AbilityModifierSource {
  name: string;
  type: 'feat' | 'equipment';
  value: number;
}

export interface AbilityBreakdown {
  ability: Ability;
  baseScore: number;
  sources: AbilityModifierSource[];
  totalScore: number;
  modifier: number;
}

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  if (modifier > 0) return `+${modifier}`;
  if (modifier < 0) return `${modifier}`;
  return '0';
}

export function getAbilityBreakdown(ability: Ability, character: Character): AbilityBreakdown {
  const baseScore = character.abilityScores[ability];
  const sources: AbilityModifierSource[] = [];

  for (const feat of character.feats) {
    const bonus = feat.statModifiers[ability];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({ name: feat.name, type: 'feat', value: bonus });
    }
  }

  for (const item of character.equipment) {
    const bonus = item.statModifiers?.[ability];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({ name: item.name, type: 'equipment', value: bonus });
    }
  }

  const totalScore = baseScore + sources.reduce((sum, s) => sum + s.value, 0);
  const modifier = getModifier(totalScore);

  return { ability, baseScore, sources, totalScore, modifier };
}
