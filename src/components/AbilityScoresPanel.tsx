import { TooltipProvider } from '@/components/ui/tooltip';
import { useCharacter } from '@/contexts/CharacterContext';
import type { Ability } from '@/types';
import { getAbilityBreakdown } from '@/utils/abilityScores';
import { AbilityScoreBox } from './AbilityScoreBox';

const abilityOrder: Ability[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];


export function AbilityScoresPanel() {
  const { character } = useCharacter();
  
  const breakdowns = character 
    ? abilityOrder.map((ability) => getAbilityBreakdown(ability, character))
    : [];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col items-center gap-2 w-full h-full">
        {breakdowns.map((breakdown) => (
          <AbilityScoreBox key={breakdown.ability} breakdown={breakdown} />
        ))}
      </div>
    </TooltipProvider>
  );
}
