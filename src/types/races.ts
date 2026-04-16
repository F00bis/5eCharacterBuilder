import type { Ability, InitiativeBonus } from './index';
import type { FeatureAction } from './classes';

export interface AbilityScoreIncrease {
  ability?: Ability;
  amount: number;
}

export interface RaceFeature {
  name: string;
  description: string;
  actions?: FeatureAction[];
}

export interface RaceSavingThrowFeature {
  type: 'advantage' | 'resistance';
  description: string;
}

export interface RaceChoice {
  type: 'draconicAncestry' | 'skill' | 'feat' | 'cantrip' | 'language';
  count: number;
  options?: string[];
  source?: string;
  required?: boolean;
}

export interface DndSubrace {
  id: string;
  name: string;
  description?: string;
  abilityScoreIncreases?: AbilityScoreIncrease[];
  speed?: number;
  features?: RaceFeature[];
  darkvision?: number;
  initiativeBonus?: InitiativeBonus;
  choices?: RaceChoice[];
}

export interface DndRace {
  id: string;
  name: string;
  abilityScoreIncreases: AbilityScoreIncrease[];
  speed: number;
  size: 'Small' | 'Medium';
  languages: string[];
  additionalLanguages: number;
  features: RaceFeature[];
  initiativeBonus?: InitiativeBonus;
  savingThrowFeatures: RaceSavingThrowFeature[];
  weaponProficiencies?: string[];
  subraces?: DndSubrace[];
  choices?: RaceChoice[];
}
