import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Character, Ability } from '../types';
import { formatModifier } from '../utils/abilityScores';
import { getAllSavingThrowBreakdowns, ABILITY_DISPLAY_NAMES, type SavingThrowBreakdown } from '../utils/savingThrows';

const abilityOrder: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

function ProficiencyIndicator({ level }: { level: 'none' | 'proficient' | 'expertise' }) {
  const tooltipContent = {
    none: 'Not proficient',
    proficient: 'Proficient',
    expertise: 'Expertise',
  }[level];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          {level === 'none' && (
            <div className="w-3 h-3 rounded-full border border-slate-400" />
          )}
          {level === 'proficient' && (
            <div className="w-3 h-3 rounded-full bg-purple-700 border border-purple-700" />
          )}
          {level === 'expertise' && (
            <div className="w-3 h-3 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-purple-700">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="text-xs">{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function getProficiencyLevel(breakdown: SavingThrowBreakdown): 'none' | 'proficient' | 'expertise' {
  const hasProficiency = breakdown.sources.some(s => s.type === 'proficiency');
  const hasExpertise = breakdown.sources.some(s => s.type === 'expertise');
  
  if (hasExpertise) return 'expertise';
  if (hasProficiency) return 'proficient';
  return 'none';
}

function SavingThrowRow({ breakdown }: { breakdown: SavingThrowBreakdown }) {
  const formattedBonus = formatModifier(breakdown.total);
  const displayName = ABILITY_DISPLAY_NAMES[breakdown.ability];
  const proficiencyLevel = getProficiencyLevel(breakdown);

  let bonusColor = 'text-slate-500';
  if (breakdown.total > 0) bonusColor = 'text-green-600';
  else if (breakdown.total < 0) bonusColor = 'text-red-600';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 px-1 py-0.5 hover:bg-slate-50 rounded cursor-help transition-colors">
          <ProficiencyIndicator level={proficiencyLevel} />
          <span className="text-xs flex-1">{displayName}</span>
          <span className={`text-xs font-medium ${bonusColor} w-6 text-right`}>
            {formattedBonus}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-64">
        <div className="font-bold text-slate-900">
          {formattedBonus}
        </div>
        <hr className="my-1 border-slate-300" />
        {breakdown.sources.map((source, i) => {
          const formattedValue = formatModifier(source.value);
          return (
            <div key={`${source.type}-${i}`} className="text-slate-700 text-sm">
              {source.description}: {formattedValue}
            </div>
          );
        })}
      </TooltipContent>
    </Tooltip>
  );
}

export function SavingThrowsPanel({ character }: { character: Character }) {
  const breakdowns = getAllSavingThrowBreakdowns(character);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-1">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Saving Throws</h3>
        <div className="flex flex-col gap-0.5">
          {abilityOrder.map((ability) => {
            const breakdown = breakdowns[ability];
            return <SavingThrowRow key={ability} breakdown={breakdown} />;
          })}
        </div>
      </Card>
    </TooltipProvider>
  );
}
