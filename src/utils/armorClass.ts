import type { Character } from '../types';
import type { DndClass } from '../types/classes';
import { getModifier } from './abilityScores';

export interface ArmorClassSource {
  description: string;
  value: number;
}

export interface ArmorClassBreakdown {
  total: number;
  sources: ArmorClassSource[];
}

function hasEquippedShield(equipment: Character['equipment']): boolean {
  return equipment.some(item => item.equipped && item.armorCategory === 'Shield');
}

function hasEquippedArmor(equipment: Character['equipment']): boolean {
  return equipment.some(
    item =>
      item.equipped &&
      (item.armorCategory === 'Light' ||
        item.armorCategory === 'Medium' ||
        item.armorCategory === 'Heavy')
  );
}

function calculateArmorBasedAc(character: Character): ArmorClassBreakdown {
  const sources: ArmorClassSource[] = [];
  let baseAc = 10;
  const dexModifier = getModifier(character.abilityScores.dexterity);
  const dexBonusFromMedium = Math.min(dexModifier, 2);

  for (const item of character.equipment) {
    if (!item.equipped) continue;
    if (item.armorCategory === 'Shield') {
      sources.push({
        description: `${item.name} (Shield)`,
        value: 2,
      });
      baseAc += 2;
    } else if (item.armorCategory === 'Light') {
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
      const armorBase = item.armorClass ?? 16;
      sources.push({
        description: `${item.name} (Heavy)`,
        value: armorBase,
      });
      baseAc = armorBase;
    }
  }

  return { total: baseAc, sources };
}

export function getArmorClass(
  character: Character,
  classDefinitions: Map<string, DndClass> = new Map()
): ArmorClassBreakdown {
  if (hasEquippedArmor(character.equipment)) {
    return calculateArmorBasedAc(character);
  }

  const dexModifier = getModifier(character.abilityScores.dexterity);
  const hasShield = hasEquippedShield(character.equipment);

  // Base candidate: 10 + Dexterity modifier (+ shield if equipped)
  const candidates: ArmorClassBreakdown[] = [];
  const baseSources: ArmorClassSource[] = [
    { description: 'Base (no armor)', value: 10 },
    { description: 'Dexterity modifier', value: dexModifier },
  ];
  let baseTotal = 10 + dexModifier;
  if (hasShield) {
    baseSources.push({ description: 'Shield', value: 2 });
    baseTotal += 2;
  }
  candidates.push({ total: baseTotal, sources: baseSources });

  // Evaluate class features for unarmored defense alternatives
  for (const classEntry of character.classes) {
    const dndClass = classDefinitions.get(classEntry.className);
    if (!dndClass) continue;

    for (const feature of dndClass.features) {
      if (feature.levelAcquired > classEntry.level) continue;
      if (!feature.effects?.acCalculation) continue;

      // Check required feature choice dependency
      if (feature.requiredFeatureChoice) {
        const selectedValue =
          character.featureChoices[feature.requiredFeatureChoice.featureKey];
        const selectedValues = Array.isArray(selectedValue)
          ? selectedValue
          : [selectedValue];
        if (!selectedValues.includes(feature.requiredFeatureChoice.expectedValue)) {
          continue;
        }
      }

      const calc = feature.effects.acCalculation;

      // Check equipment restrictions
      if (calc.requiresNoShield && hasShield) continue;

      let ac = calc.base;
      const featureSources: ArmorClassSource[] = [
        {
          description: `${feature.name} (${dndClass.name})`,
          value: calc.base,
        },
      ];

      for (const ability of calc.abilityModifiers) {
        const mod = getModifier(character.abilityScores[ability]);
        ac += mod;
        const abilityName =
          ability.charAt(0).toUpperCase() + ability.slice(1);
        featureSources.push({
          description: `${abilityName} modifier`,
          value: mod,
        });
      }

      if (hasShield && calc.allowShield) {
        ac += 2;
        featureSources.push({ description: 'Shield', value: 2 });
      }

      candidates.push({ total: ac, sources: featureSources });
    }
  }

  // Choose the highest candidate
  const best = candidates.reduce(
    (max, curr) => (curr.total > max.total ? curr : max),
    candidates[0]
  );

  return best;
}
