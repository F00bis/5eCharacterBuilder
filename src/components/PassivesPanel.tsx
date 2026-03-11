import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCharacter } from '../contexts/CharacterContext';
import type { Character } from '../types';
import { getAbilityBreakdown } from '../utils/abilityScores';
import { SKILL_ABILITY_MAP } from '../utils/skills';

const PASSIVE_SKILLS = ['perception', 'insight', 'investigation', 'stealth'] as const;
type PassiveSkill = typeof PASSIVE_SKILLS[number];

const PASSIVE_DISPLAY_NAMES: Record<PassiveSkill, string> = {
  perception: 'Perception',
  insight: 'Insight',
  investigation: 'Investigation',
  stealth: 'Stealth',
};

const PASSIVE_DESCRIPTIONS: Record<PassiveSkill, string> = {
  perception: 'Your ability to notice things around you without actively searching',
  insight: 'Your ability to determine the true intentions of a creature',
  investigation: 'Your ability to find clues and deduce information',
  stealth: 'Your ability to remain unseen and unheard',
};

interface PassiveBreakdown {
  skill: PassiveSkill;
  total: number;
  abilityModifier: number;
  proficiencyBonus: number;
  sources: { name: string; value: number }[];
}

function getPassiveBreakdown(skill: PassiveSkill, character: Character): PassiveBreakdown {
  const ability = SKILL_ABILITY_MAP[skill];
  const abilityBreakdown = getAbilityBreakdown(ability, character);
  const abilityModifier = abilityBreakdown.modifier;

  const skillProficiency = character.skills.find((s) => s.skill === skill);
  const proficiencyLevel = skillProficiency?.level ?? 'none';

  let proficiencyBonus = 0;
  if (proficiencyLevel === 'proficient' || proficiencyLevel === 'expertise') {
    proficiencyBonus = character.proficiencyBonus;
  }

  let featBonus = 0;
  for (const feat of character.feats) {
    const bonus = feat.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      featBonus += bonus;
    }
  }

  let equipmentBonus = 0;
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const bonus = item.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      equipmentBonus += bonus;
    }
  }

  const total = 10 + abilityModifier + proficiencyBonus + featBonus + equipmentBonus;

  const sources = [
    { name: 'Base (10)', value: 10 },
    { name: `${ability.toUpperCase()} modifier`, value: abilityModifier },
  ];

  if (proficiencyBonus > 0) {
    sources.push({ name: 'Proficiency', value: proficiencyBonus });
  }

  for (const feat of character.feats) {
    const bonus = feat.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({ name: feat.name, value: bonus });
    }
  }

  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const bonus = item.skillModifiers?.[skill];
    if (bonus !== undefined && bonus !== 0) {
      sources.push({ name: item.name, value: bonus });
    }
  }

  return {
    skill,
    total,
    abilityModifier,
    proficiencyBonus,
    sources,
  };
}

function PassiveRow({ breakdown }: { breakdown: PassiveBreakdown }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 px-0.5 py-0 hover:bg-slate-50 rounded cursor-help transition-colors">
          <span className="text-xs flex-1">{PASSIVE_DISPLAY_NAMES[breakdown.skill]}</span>
          <span className="text-xs font-medium text-slate-700 w-6 text-right">
            {breakdown.total}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-48">
        <div className="font-bold text-slate-900">
          {PASSIVE_DISPLAY_NAMES[breakdown.skill]}: {breakdown.total}
        </div>
        <div className="text-xs text-slate-600 mb-1">{PASSIVE_DESCRIPTIONS[breakdown.skill]}</div>
        <hr className="my-1 border-slate-300" />
        {breakdown.sources.map((source, i) => (
          <div key={i} className="text-slate-700 text-sm">
            {source.name}: {source.value > 0 ? '+' : ''}{source.value}
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}

export function PassivesPanel() {
  const { character } = useCharacter();
  
  const breakdowns = character ? PASSIVE_SKILLS.map((skill) => getPassiveBreakdown(skill, character)) : [];

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-1">
        <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-0.5">Passives</h3>
        <div className="flex flex-col gap-0">
          {breakdowns.map((breakdown) => (
            <PassiveRow key={breakdown.skill} breakdown={breakdown} />
          ))}
        </div>
      </Card>
    </TooltipProvider>
  );
}
