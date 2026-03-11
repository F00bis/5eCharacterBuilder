import type { AbilityBreakdown } from '../utils/abilityScores';
import { formatModifier } from '../utils/abilityScores';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const abilityAbbreviations: Record<string, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

const abilityFullNames: Record<string, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

export function AbilityScoreBox({ breakdown }: { breakdown: AbilityBreakdown }) {
  const abbr = abilityAbbreviations[breakdown.ability];
  const fullName = abilityFullNames[breakdown.ability];
  const formattedMod = formatModifier(breakdown.modifier);

  let modifierColor = 'text-slate-500';
  if (breakdown.modifier > 0) modifierColor = 'text-green-600';
  else if (breakdown.modifier < 0) modifierColor = 'text-red-600';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className="flex-1 cursor-help hover:shadow-md transition-shadow w-full">
          <div className="flex flex-col items-center justify-center p-3 h-full">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {abbr}
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {breakdown.totalScore}
            </span>
            <span className={`text-sm font-medium ${modifierColor}`}>
              {formattedMod}
            </span>
          </div>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-64">
        <div className="font-bold text-slate-900">
          {fullName}: {breakdown.totalScore}
        </div>
        <hr className="my-1 border-slate-300" />
        {breakdown.override ? (
          <>
            <div className="text-purple-700 font-medium">
              Set to {breakdown.override.value} by {breakdown.override.name}
            </div>
            <div className="text-slate-400 line-through">Base: {breakdown.baseScore}</div>
            {breakdown.featSources.map((source, i) => (
              <div key={`feat-${i}`} className="text-slate-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
            {breakdown.equipmentSources.map((source, i) => (
              <div key={`equip-${i}`} className="text-slate-400 line-through">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="text-slate-700">Base: {breakdown.baseScore}</div>
            {breakdown.featSources.map((source, i) => (
              <div key={`feat-${i}`} className="text-slate-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
            {breakdown.equipmentSources.map((source, i) => (
              <div key={`equip-${i}`} className="text-slate-700">
                {source.name} ({source.type}): {formatModifier(source.value)}
              </div>
            ))}
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
