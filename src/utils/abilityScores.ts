import type { Ability, Character } from '../types';

export interface AbilityModifierSource {
  name: string;
  type: 'feat' | 'equipment';
  value: number;
}

export interface AbilityOverrideSource {
  name: string;
  value: number;
}

export interface AbilityBreakdown {
  ability: Ability;
  baseScore: number;
  featSources: AbilityModifierSource[];
  equipmentSources: AbilityModifierSource[];
  override: AbilityOverrideSource | null;
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
  const featSources: AbilityModifierSource[] = [];
  const equipmentSources: AbilityModifierSource[] = [];

  for (const feat of character.feats) {
    const bonus = feat.statModifiers[ability];
    if (bonus !== undefined && bonus !== 0) {
      featSources.push({ name: feat.name, type: 'feat', value: bonus });
    }
  }

  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const bonus = item.statModifiers?.[ability];
    if (bonus !== undefined && bonus !== 0) {
      equipmentSources.push({ name: item.name, type: 'equipment', value: bonus });
    }
  }

  // Find the highest ability override from equipment
  let override: AbilityOverrideSource | null = null;
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const overrideValue = item.abilityOverride?.[ability];
    if (overrideValue !== undefined) {
      if (override === null || overrideValue > override.value) {
        override = { name: item.name, value: overrideValue };
      }
    }
  }

  const featBonus = featSources.reduce((sum, s) => sum + s.value, 0);
  const equipmentBonus = equipmentSources.reduce((sum, s) => sum + s.value, 0);
  const computedWithoutOverride = baseScore + featBonus + equipmentBonus;

  // When an override applies, it replaces base + equipment bonuses,
  // but feat bonuses still stack on top.
  const overrideTotal = override !== null
    ? override.value + featBonus
    : -Infinity;

  const appliedOverride = override !== null && overrideTotal > computedWithoutOverride
    ? override
    : null;

  const totalScore = appliedOverride !== null
    ? overrideTotal
    : computedWithoutOverride;

  const modifier = getModifier(totalScore);

  return { ability, baseScore, featSources, equipmentSources, override: appliedOverride, totalScore, modifier };
}
