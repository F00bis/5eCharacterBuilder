import type { Ability } from './index';
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

export interface DndSubrace {
  id: string;
  name: string;
  description?: string;
  abilityScoreIncreases?: AbilityScoreIncrease[];
  speed?: number;
  features?: RaceFeature[];
  darkvision?: number;
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
  savingThrowFeatures: RaceSavingThrowFeature[];
  weaponProficiencies?: string[];
  subraces?: DndSubrace[];
}
