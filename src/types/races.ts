import type { Ability } from './index';

export interface AbilityScoreIncrease {
  ability: Ability;
  amount: number;
}

export interface RaceFeature {
  name: string;
  description: string;
}

export interface RaceSavingThrowFeature {
  type: 'advantage' | 'resistance';
  description: string;
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
}
