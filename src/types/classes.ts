import type { Ability } from './index';

export type ActionType = 'action' | 'bonus-action' | 'reaction';

export interface ResourceDefinition {
  id: string;
  name: string;
  maxFormula: string;
  resetOn: 'long-rest' | 'short-rest';
}

export interface FeatureAction {
  type: ActionType;
  resourceCost?: { resourceId: string; amount: number };
  description: string;
  requirements?: string;
}

export interface ClassFeature {
  name: string;
  description: string;
  levelAcquired: number;
  actions?: FeatureAction[];
  choices?: {
    count: number;
    options: string[];
  };
  effects?: {
    abilityScores?: Partial<Record<Ability, number>>;
    ac?: number;
    hpPerLevel?: number;
    proficiencyBonus?: number;
    savingThrows?: Ability[];
    skillProficiencies?: string[];
    weaponProficiencies?: string[];
    armorProficiencies?: string[];
  };
}

export interface DndClass {
  name: string;
  hitDie: number;
  primaryAbility: Ability;
  savingThrows: Ability[];
  skillProficienciesChoices: number;
  skillOptions: string[];
  features: ClassFeature[];
  resources?: ResourceDefinition[];
  spellcastingAbility?: Ability;
  spellsKnownPerLevel?: number[];
  slotsPerLevel?: number[];
  multiclassing?: {
    prerequisites: { ability: Ability; min: number }[];
    proficienciesGained: {
      armor?: string[];
      weapons?: string[];
      tools?: string[];
      skills?: number;
    };
  };
}
