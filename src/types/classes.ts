import type { Ability } from './index';

export interface ClassFeature {
  name: string;
  description: string;
  levelAcquired: number;
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
  spellcastingAbility?: Ability;
  spellsKnownPerLevel?: number[];
  slotsPerLevel?: number[];
}
