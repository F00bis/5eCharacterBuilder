import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Character } from '../types';
import { formatModifier } from '../utils/abilityScores';
import { getAllSkillBreakdowns, SKILL_DISPLAY_NAMES, SKILLS_BY_ABILITY, type SkillBreakdown } from '../utils/skills';

const abilityAbbreviations: Record<string, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

const abilityOrder = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

function ProficiencyIndicator({ level }: { level: 'none' | 'proficient' | 'expertise' }) {
  if (level === 'none') {
    return (
      <div className="w-3 h-3 rounded-full border border-slate-400" title="Not proficient" />
    );
  }
  if (level === 'proficient') {
    return (
      <div className="w-3 h-3 rounded-full bg-purple-700 border border-purple-700" title="Proficient" />
    );
  }
  // expertise
  return (
    <div className="w-3 h-3 flex items-center justify-center" title="Expertise">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-purple-700">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
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
        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-50 rounded cursor-help transition-colors">
          <ProficiencyIndicator level={breakdown.proficiencyLevel} />
          <span className="text-xs flex-1">{displayName}</span>
          <span className={`text-xs font-medium ${bonusColor} w-6 text-right`}>
            {formattedBonus}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-64">
        <div className="font-bold text-slate-900">
          {displayName}: {formattedBonus}
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

export function SkillsPanel({ character }: { character: Character }) {
  const breakdowns = getAllSkillBreakdowns(character);
  const breakdownMap = new Map(breakdowns.map((b) => [b.skill, b]));

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-52 p-2 h-fit">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Skills</h3>
        <div className="flex flex-col gap-1.5">
          {abilityOrder.map((ability) => {
            const skills = SKILLS_BY_ABILITY[ability];
            if (skills.length === 0) return null; // Skip CON (no skills)

            return (
              <div key={ability}>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-0.5 px-2">
                  {abilityAbbreviations[ability]}
                </div>
                <div className="flex flex-col">
                  {skills.map((skill) => {
                    const breakdown = breakdownMap.get(skill);
                    if (!breakdown) return null;
                    return <SkillRow key={skill} breakdown={breakdown} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </TooltipProvider>
  );
}
