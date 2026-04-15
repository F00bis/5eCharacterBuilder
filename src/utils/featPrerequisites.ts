import type { Ability, AbilityScores } from '../types';

interface ParsedAbilityPrerequisite {
  ability: Ability;
  minimum: number;
}

export function parseAbilityPrerequisite(
  prerequisiteText: string
): ParsedAbilityPrerequisite | null {
  if (!prerequisiteText) {
    return null;
  }

  const hasComplexOr = /^\w+\s+or\s+\w+\s+\d+/.test(prerequisiteText);
  if (hasComplexOr) {
    return null;
  }

  const abilityPattern = /(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+(\d+)\s+(?:or higher|or more)/i;
  const match = prerequisiteText.match(abilityPattern);

  if (!match) {
    return null;
  }

  const ability = match[1].toLowerCase() as Ability;
  const minimum = parseInt(match[2], 10);

  return { ability, minimum };
}

export interface FeatPrerequisiteCheck {
  met: boolean;
  reason?: string;
}

export function characterMeetsFeatPrerequisites(
  prerequisiteText: string,
  abilityScores: AbilityScores
): FeatPrerequisiteCheck {
  if (!prerequisiteText) {
    return { met: true };
  }

  const parsed = parseAbilityPrerequisite(prerequisiteText);

  if (!parsed) {
    return { met: true };
  }

  const currentScore = abilityScores[parsed.ability];

  if (currentScore >= parsed.minimum) {
    return { met: true };
  }

  return {
    met: false,
    reason: `Requires ${parsed.ability.charAt(0).toUpperCase() + parsed.ability.slice(1)} ${parsed.minimum} or higher (current: ${currentScore})`,
  };
}

export function getFilteredFeats(
  feats: Array<{ name: string; prerequisites: string; isHalfFeat?: boolean }>,
  abilityScores: AbilityScores
): Array<{ name: string; prerequisites: string; isHalfFeat?: boolean; meetsPrerequisites: boolean; reason?: string }> {
  return feats.map(feat => {
    const check = characterMeetsFeatPrerequisites(feat.prerequisites, abilityScores);
    return {
      ...feat,
      meetsPrerequisites: check.met,
      reason: check.reason,
    };
  });
}