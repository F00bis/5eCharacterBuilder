import type { Character } from '../types';
import { getModifier } from './abilityScores';

export interface ArmorClassSource {
  description: string;
  value: number;
}

export interface ArmorClassBreakdown {
  total: number;
  sources: ArmorClassSource[];
}

export function getArmorClass(character: Character): ArmorClassBreakdown {
  const sources: ArmorClassSource[] = [];
  let baseAc = 10;
  let hasArmor = false;

  const dexModifier = getModifier(character.abilityScores.dexterity);
  const dexBonusFromMedium = Math.min(dexModifier, 2);

  for (const item of character.equipment) {
    if (item.armorCategory === 'Shield') {
      sources.push({
        description: `${item.name} (Shield)`,
        value: 2,
      });
      baseAc += 2;
    } else if (item.armorCategory === 'Light') {
      hasArmor = true;
      const armorBase = item.armorClass ?? 11;
      sources.push({
        description: `${item.name} (Light)`,
        value: armorBase,
      });
      sources.push({
        description: 'Dexterity modifier',
        value: dexModifier,
      });
      baseAc = armorBase + dexModifier;
    } else if (item.armorCategory === 'Medium') {
      hasArmor = true;
      const armorBase = item.armorClass ?? 12;
      sources.push({
        description: `${item.name} (Medium)`,
        value: armorBase,
      });
      sources.push({
        description: 'Dexterity modifier (max 2)',
        value: dexBonusFromMedium,
      });
      baseAc = armorBase + dexBonusFromMedium;
    } else if (item.armorCategory === 'Heavy') {
      hasArmor = true;
      const armorBase = item.armorClass ?? 16;
      sources.push({
        description: `${item.name} (Heavy)`,
        value: armorBase,
      });
      baseAc = armorBase;
    }
  }

  if (!hasArmor) {
    sources.push({
      description: 'Base (no armor)',
      value: 10,
    });
    sources.push({
      description: 'Dexterity modifier',
      value: dexModifier,
    });
  }

  return {
    total: baseAc,
    sources,
  };
}
