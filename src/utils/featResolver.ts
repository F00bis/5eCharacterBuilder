import type { Ability, Feat, ProficiencyLevel, Skill } from '../types';
import type { SrdFeat } from '../data/srdFeats';

export interface FeatSelections {
  asiChoice?: Ability;
  choices?: Record<string, string | string[]>;
}

export function resolveFeat(srdFeat: SrdFeat, selections: FeatSelections): Feat {
  const statModifiers: Partial<Record<Ability, number>> = {};

  let effectiveAsiChoice: Ability | undefined;
  if (srdFeat.isHalfFeat) {
    if (selections.asiChoice && srdFeat.asiOptions?.includes(selections.asiChoice)) {
      effectiveAsiChoice = selections.asiChoice;
    } else if (!selections.asiChoice && srdFeat.asiOptions && srdFeat.asiOptions.length === 1) {
      effectiveAsiChoice = srdFeat.asiOptions[0];
    }
  }

  if (effectiveAsiChoice) {
    statModifiers[effectiveAsiChoice] = 1;
  }

  const savingThrowProficiencies: Partial<Record<Ability, ProficiencyLevel>> = {};
  if (srdFeat.choices) {
    for (const choiceDef of srdFeat.choices) {
      if (choiceDef.kind === 'saving-throw') {
        let value: string | undefined;
        if (choiceDef.linkedTo === 'asi' && effectiveAsiChoice) {
          value = effectiveAsiChoice;
        } else {
          value = selections.choices?.[choiceDef.id] as string | undefined;
        }
        if (value) {
          savingThrowProficiencies[value as Ability] = 'proficient';
        }
      }
    }
  }

  const skillModifiers: Partial<Record<Skill, number>> = {};
  if (srdFeat.choices) {
    for (const choiceDef of srdFeat.choices) {
      if (choiceDef.kind === 'skill-proficiency') {
        const value = selections.choices?.[choiceDef.id];
        if (typeof value === 'string') {
          skillModifiers[value as Skill] = (skillModifiers[value as Skill] ?? 0) + 2;
        } else if (Array.isArray(value)) {
          for (const skill of value) {
            skillModifiers[skill as Skill] = (skillModifiers[skill as Skill] ?? 0) + 2;
          }
        }
      }
      if (choiceDef.kind === 'skill-expertise') {
        const value = selections.choices?.[choiceDef.id];
        if (typeof value === 'string') {
          skillModifiers[value as Skill] = (skillModifiers[value as Skill] ?? 0) + 2;
        } else if (Array.isArray(value)) {
          for (const skill of value) {
            skillModifiers[skill as Skill] = (skillModifiers[skill as Skill] ?? 0) + 2;
          }
        }
      }
    }
  }

  const resolvedChoices: Record<string, string | string[]> = {};
  if (effectiveAsiChoice) {
    resolvedChoices.asi = effectiveAsiChoice;
  }
  if (selections.choices) {
    for (const [key, value] of Object.entries(selections.choices)) {
      resolvedChoices[key] = value;
    }
  }

  return {
    name: srdFeat.name,
    description: srdFeat.description,
    statModifiers,
    ...(Object.keys(skillModifiers).length > 0 ? { skillModifiers } : {}),
    ...(Object.keys(savingThrowProficiencies).length > 0 ? { savingThrowProficiencies } : {}),
    ...(Object.keys(resolvedChoices).length > 0 ? { resolvedChoices } : {}),
  };
}