import type { Ability, Skill, ProficiencyLevel, InitiativeBonus } from './index';
import type { FeatChoiceDefinition } from './featChoices';

export interface Feat {
  id?: number;
  name: string;
  description: string;
  prerequisites: string;
  statModifiers: Partial<Record<Ability, number>>;
  initiativeBonus?: InitiativeBonus;
  skillModifiers?: Partial<Record<Skill, number>>;
  savingThrowProficiencies?: Partial<Record<Ability, ProficiencyLevel>>;
  isHalfFeat: boolean;
  halfFeatChoiceAbility?: Ability;
  asiOptions?: Ability[];
  choices?: FeatChoiceDefinition[];
  isSRD: boolean;
}

export type { Ability, Skill, ProficiencyLevel, InitiativeBonus } from './index';
