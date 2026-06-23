import type { ArmorCategory, EquipmentCategory, WeaponCategory, WeaponClass, WeaponForm, WeaponProperty } from './equipment';
import type { Ability } from './index';

export interface StartingEquipmentItem {
  name: string;
  quantity?: number;
}

export type StartingEquipmentItemRef = string | StartingEquipmentItem;

export interface StartingEquipmentOption {
  label: string;
  options: {
    label: string;
    count?: number;
    items?: StartingEquipmentItemRef[];
    type: 'bundle' | 'choice';
    // Legacy fields (backward compatibility)
    weaponCategories?: WeaponCategory[];
    armorCategories?: ArmorCategory[];
    equipmentCategories?: EquipmentCategory[];
    // New tag-based query fields
    weaponClasses?: WeaponClass[];
    weaponForms?: WeaponForm[];
    weaponProperties?: WeaponProperty[];
  }[];
}

export interface StartingEquipment {
  startingGoldFormula: string;
  startingGoldAverage: number;
  choices: StartingEquipmentOption[];
  fixedEquipment: StartingEquipmentItemRef[];
}

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

export interface ArmorClassCalculation {
  base: number;
  abilityModifiers: Ability[];
  requiresNoArmor: boolean;
  requiresNoShield: boolean;
  allowShield: boolean;
}

export interface FeatureDependency {
  featureKey: string;
  expectedValue: string;
}

export interface ClassFeature {
  name: string;
  description: string;
  levelAcquired: number;
  actions?: FeatureAction[];
  choices?: {
    count: number;
    options: string[];
    optionDetails?: Record<string, string>;
    optionSources?: Record<string, string>;
  };
  requiredFeatureChoice?: FeatureDependency;
  effects?: {
    abilityScores?: Partial<Record<Ability, number>>;
    acCalculation?: ArmorClassCalculation;
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
  asiLevels: number[];
  resources?: ResourceDefinition[];
  spellcastingAbility?: Ability;
  spellPrepType?: 'prepared' | 'known';
  startingEquipment: StartingEquipment;
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
