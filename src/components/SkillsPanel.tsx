import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCharacter } from '../contexts/CharacterContext';
import { formatModifier } from '../utils/abilityScores';
import { getAllSkillBreakdowns, SKILL_DISPLAY_NAMES, type SkillBreakdown } from '../utils/skills';

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

function SkillRow({ breakdown }: { breakdown: SkillBreakdown }) {
  const formattedBonus = formatModifier(breakdown.totalBonus);
  const displayName = SKILL_DISPLAY_NAMES[breakdown.skill];

  let bonusColor = 'text-slate-500';
  if (breakdown.totalBonus > 0) bonusColor = 'text-green-600';
  else if (breakdown.totalBonus < 0) bonusColor = 'text-red-600';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 px-1 py-0.5 hover:bg-slate-50 rounded cursor-help transition-colors">
          <ProficiencyIndicator level={breakdown.proficiencyLevel} />
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
          let sourceLabel = source.name;
          
          // Add type suffix for feat and equipment
          if (source.type === 'feat') {
            sourceLabel = `${source.name} (feat)`;
          } else if (source.type === 'equipment') {
            sourceLabel = `${source.name} (equipment)`;
          }

          // Special formatting for expertise to show it's double proficiency
          if (source.type === 'expertise') {
            sourceLabel = `${source.name} (2x proficiency bonus)`;
          }

          return (
            <div key={`${source.type}-${i}`} className="text-slate-700 text-sm">
              {sourceLabel}: {formattedValue}
            </div>
          );
        })}
      </TooltipContent>
    </Tooltip>
  );
}


export function SkillsPanel() {
  const { character } = useCharacter();
  
  const breakdowns = character ? getAllSkillBreakdowns(character) : [];

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-1">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Skills</h3>
        <div className="flex flex-col gap-0.5">
          {breakdowns.map((breakdown) => (
            <SkillRow key={breakdown.skill} breakdown={breakdown} />
          ))}
        </div>
      </Card>
    </TooltipProvider>
  );
}
