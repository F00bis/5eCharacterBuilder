import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check } from 'lucide-react';
import { useCharacter } from '../contexts/CharacterContext';
import { useSpellPreparation, type DisplaySpell } from '../hooks/useSpellPreparation';
import { groupSpellsByLevel } from '../utils/spellCalculations';
import { SpellTooltipDetail } from './SpellTooltipDetail';

function getLevelLabel(level: number): string {
  if (level === 0) return 'Cantrips';
  if (level === 1) return '1st Level';
  if (level === 2) return '2nd Level';
  if (level === 3) return '3rd Level';
  return `${level}th Level`;
}

function getQuotaBarColorClasses(color: 'green' | 'amber' | 'red'): {
  text: string;
  indicator: string;
  border: string;
} {
  switch (color) {
    case 'green':
      return {
        text: 'text-green-700',
        indicator: '[&>div]:bg-green-600',
        border: '',
      };
    case 'amber':
      return {
        text: 'text-amber-700',
        indicator: '[&>div]:bg-amber-500',
        border: '',
      };
    case 'red':
      return {
        text: 'text-red-700',
        indicator: '[&>div]:bg-red-600',
        border: 'border border-red-300',
      };
  }
}

interface QuotaBarProps {
  preparedCount: number;
  preparedMax: number;
  quotaColor: 'green' | 'amber' | 'red';
  warningMessage: string | null;
}

function QuotaBar({ preparedCount, preparedMax, quotaColor, warningMessage }: QuotaBarProps) {
  const colors = getQuotaBarColorClasses(quotaColor);
  const fillPercent = preparedMax > 0 ? Math.min((preparedCount / preparedMax) * 100, 100) : 0;

  return (
    <div className={`px-2 py-1.5 shrink-0 ${colors.border}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold ${colors.text}`}>
          Prepared {preparedCount} / {preparedMax}
        </span>
        {warningMessage && (
          <span className="text-xs font-semibold text-red-600 animate-pulse">
            {warningMessage}
          </span>
        )}
      </div>
      <Progress
        value={fillPercent}
        className={`h-1.5 ${colors.indicator}`}
      />
    </div>
  );
}

interface SpellRowControlsProps {
  spell: DisplaySpell;
  canPrepare: boolean;
  onToggle: (spellName: string) => void;
}

function SpellRowControls({ spell, canPrepare, onToggle }: SpellRowControlsProps) {
  if (!canPrepare) {
    // Non-prepared caster: show green checkmark for prepared spells
    if (spell.prepared) {
      return <Check className="w-3.5 h-3.5 text-green-600" aria-label="Prepared" />;
    }
    return null;
  }

  // Cantrips: no toggle
  if (spell.level === 0) {
    return null;
  }

  // Disabled toggle with reason text
  if (!spell.canToggle && spell.toggleDisabledReason) {
    return (
      <span className="text-[10px] text-slate-400 italic">
        {spell.toggleDisabledReason}
      </span>
    );
  }

  // Toggle switch for prepared casters
  if (spell.canToggle) {
    return (
      <Switch
        checked={spell.prepared}
        onCheckedChange={() => {
          onToggle(spell.name);
        }}
        aria-label={`Prepare ${spell.name}`}
      />
    );
  }

  return null;
}

export function SpellsPanel() {
  const { character } = useCharacter();
  const preparation = useSpellPreparation();

  if (!character) return null;

  if (preparation.isLoading) {
    return (
      <Card className="w-full h-full p-2 flex flex-col">
        <div className="text-xs font-bold text-slate-700 mb-2 px-1 shrink-0">
          Spellbook
        </div>
        <div className="text-xs text-slate-400 text-center py-4">
          Loading spells...
        </div>
      </Card>
    );
  }

  // Use displaySpells from hook when canPrepare, otherwise fall back to character.spells
  const groupedSpells = preparation.canPrepare
    ? preparation.displaySpells
    : groupSpellsByLevel(character.spells);

  const hasNoSpells = preparation.canPrepare
    ? preparation.displaySpells.size === 0
    : character.spells.length === 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2 flex flex-col">
        <div className="text-xs font-bold text-slate-700 mb-2 px-1 shrink-0">
          Spellbook
        </div>

        {preparation.canPrepare && (
          <QuotaBar
            preparedCount={preparation.preparedCount}
            preparedMax={preparation.preparedMax}
            quotaColor={preparation.quotaColor}
            warningMessage={preparation.warningMessage}
          />
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {hasNoSpells ? (
            <div className="text-xs text-slate-400 text-center py-4">
              No spells recorded for this character.
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from(groupedSpells.entries()).map(([level, spells]) => (
                <div key={level}>
                  <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-2 py-1 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700">
                      {getLevelLabel(level)}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {spells.length}
                    </Badge>
                  </div>
                  <ul className="space-y-0">
                    {spells.map((spell) => (
                      <li
                        key={spell.name}
                        role="listitem"
                        className="flex items-center justify-between px-2 h-8 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs font-medium text-slate-700 truncate min-w-0 flex-1 cursor-default">
                                {spell.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="w-80 max-w-80 p-0">
                              <SpellTooltipDetail spell={spell} />
                            </TooltipContent>
                          </Tooltip>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                            {spell.school}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {spell.concentration && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  aria-label="Concentration"
                                  className="w-2 h-2 rounded-full bg-purple-500"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <span className="text-xs">Concentration</span>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {spell.ritual && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  aria-label="Ritual"
                                  className="w-2 h-2 rounded-full bg-blue-500"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <span className="text-xs">Ritual</span>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <SpellRowControls
                            spell={spell as DisplaySpell}
                            canPrepare={preparation.canPrepare}
                            onToggle={preparation.togglePrepare}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}
