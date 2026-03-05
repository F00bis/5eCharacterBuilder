import { TooltipProvider } from '@/components/ui/tooltip';
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
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col items-center gap-2 h-full">
        {breakdowns.map((breakdown) => (
          <AbilityScoreBox key={breakdown.ability} breakdown={breakdown} />
        ))}
      </div>
    </TooltipProvider>
  );
}
