import type { Ability, Character } from '../types';
import { getAbilityBreakdown } from '../utils/abilityScores';
import { AbilityScoreBox } from './AbilityScoreBox';

const abilityOrder: Ability[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];

export function AbilityScoresPanel({ character }: { character: Character }) {
  const breakdowns = abilityOrder.map((ability) =>
    getAbilityBreakdown(ability, character)
  );

  return (
    <div className="flex flex-col gap-2">
      {breakdowns.map((breakdown) => (
        <AbilityScoreBox key={breakdown.ability} breakdown={breakdown} />
      ))}
    </div>
  );
}
