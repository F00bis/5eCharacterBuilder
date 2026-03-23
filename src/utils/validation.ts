import type { Ability } from '../types';
import { srdRaces } from '../data/srdRaces';

export interface RaceStepValidation {
  isValid: boolean;
  requiresSubrace: boolean;
  subraceSelected: boolean;
  hasPlus2: boolean;
  hasPlus1: boolean;
  plus2AndPlus1Different: boolean;
}

export function validateRaceStep(
  raceName: string | undefined,
  subraceId: string | undefined,
  plus2: Ability | '',
  plus1: Ability | ''
): RaceStepValidation {
  const selectedRace = raceName ? srdRaces.find(r => r.name === raceName) : undefined;
  const requiresSubrace = !!(selectedRace?.subraces && selectedRace.subraces.length > 0);
  const subraceSelected = !!subraceId;

  const hasPlus2 = !!plus2;
  const hasPlus1 = !!plus1;
  const plus2AndPlus1Different = plus2 !== plus1 && !!plus2 && !!plus1;

  const isValid = !requiresSubrace || subraceSelected;

  return {
    isValid,
    requiresSubrace,
    subraceSelected,
    hasPlus2,
    hasPlus1,
    plus2AndPlus1Different,
  };
}

export function isValidRaceStep(
  race: string | undefined,
  background: string | undefined,
  subrace: string | undefined,
  useTashasRules: boolean,
  plus2: Ability | null,
  plus1: Ability | null,
  requiresSubrace: boolean
): boolean {
  if (!race || !background) return false;

  if (requiresSubrace && !subrace) return false;

  if (useTashasRules) {
    return !!(plus2 && plus1 && plus2 !== plus1);
  }

  return true;
}
