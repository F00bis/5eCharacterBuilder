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
  _subrace: string | undefined,
  useTashasRules: boolean,
  plus2: Ability | null,
  plus1: Ability | null,
  flexibleSelections: Record<number, Ability | null>,
  baseBonuses: { ability?: Ability; amount: number }[],
  raceChoices: Record<string, string | string[]>,
  requiredChoices: { type: string; count?: number }[]
): boolean {
  if (!race) return false;

  if (useTashasRules) {
    if (!plus2 || !plus1 || plus2 === plus1) return false;
  } else {
    const flexibleSlotsCount = baseBonuses.filter(b => !b.ability).length;
    const selections = Object.values(flexibleSelections).filter((a): a is Ability => a !== null);
    
    if (selections.length < flexibleSlotsCount) return false;

    const fixedAbilities = baseBonuses.filter(b => b.ability).map(b => b.ability as Ability);
    const allSelected = [...fixedAbilities, ...selections];
    if (new Set(allSelected).size !== allSelected.length) return false;
  }

  for (const choice of requiredChoices) {
    const value = raceChoices[choice.type];
    if (!isRaceChoiceSatisfied(choice, value)) {
      return false;
    }
  }

  return true;
}

function isRaceChoiceSatisfied(
  choice: { type: string; count?: number },
  value: string | string[] | undefined
): boolean {
  if (!value) return false;

  if (choice.type === 'skill' || choice.type === 'language') {
    const arr = Array.isArray(value) ? value : [value];
    return arr.length >= (choice.count ?? 1);
  }

  return true;
}
