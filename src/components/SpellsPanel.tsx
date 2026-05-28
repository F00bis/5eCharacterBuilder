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
import * as Tabs from '@radix-ui/react-tabs';
import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { useSpellPreparation, type DisplaySpell } from '../hooks/useSpellPreparation';
import { useWizardSpellbook } from '../hooks/useWizardSpellbook';
import { groupSpellsByLevel } from '../utils/spellCalculations';
import { SpellDetailDialog } from './SpellDetailDialog';
import { SpellTooltipDetail } from './SpellTooltipDetail';
import { WizardSpellbookManager } from './WizardSpellbookManager';

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

interface FlatRow {
  spell: DisplaySpell;
  groupIndex: number;
  rowIndex: number;
}

function SpellList({
  groupedSpells,
  hasNoSpells,
  canPrepare,
  togglePrepare,
}: {
  groupedSpells: Map<number, DisplaySpell[]>;
  hasNoSpells: boolean;
  canPrepare: boolean;
  togglePrepare: (spellName: string) => void;
}) {
  const [selectedSpell, setSelectedSpell] = useState<DisplaySpell | null>(null);

  const groups = Array.from(groupedSpells.entries());

  const allRows: FlatRow[] = groups.flatMap(([, spells], groupIndex) =>
    spells.map((spell, rowIndex) => ({ spell, groupIndex, rowIndex }))
  );

  const [focusedIndex, setFocusedIndex] = useState(0);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  function focusRow(index: number) {
    const clamped = Math.max(0, Math.min(index, allRows.length - 1));
    setFocusedIndex(clamped);
    rowRefs.current[clamped]?.focus();
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    row: FlatRow
  ) {
    const currentIndex = allRows.findIndex(
      (r) => r.spell.name === row.spell.name
    );

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(currentIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(currentIndex - 1);
        break;
      case 'ArrowRight': {
        event.preventDefault();
        const nextGroup = row.groupIndex + 1;
        const nextRow = allRows.find((r) => r.groupIndex === nextGroup);
        if (nextRow) {
          const nextIndex = allRows.indexOf(nextRow);
          focusRow(nextIndex);
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const prevGroup = row.groupIndex - 1;
        const prevRow = allRows.find((r) => r.groupIndex === prevGroup);
        if (prevRow) {
          const prevIndex = allRows.indexOf(prevRow);
          focusRow(prevIndex);
        }
        break;
      }
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        togglePrepare(row.spell.name);
        break;
      case 'Enter':
        event.preventDefault();
        setSelectedSpell(row.spell);
        break;
    }
  }

  if (hasNoSpells) {
    return (
      <div className="text-xs text-slate-400 text-center py-4">
        No spells recorded for this character.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {groups.map(([level, spells]) => (
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
              {spells.map((spell) => {
                const rowIndex = allRows.findIndex(
                  (r) => r.spell.name === spell.name
                );
                return (
                  <li
                    key={spell.name}
                    ref={(el) => {
                      rowRefs.current[rowIndex] = el;
                    }}
                    role="listitem"
                    tabIndex={rowIndex === focusedIndex ? 0 : -1}
                    onFocus={() => setFocusedIndex(rowIndex)}
                    onKeyDown={(e) => {
                      const row = allRows[rowIndex];
                      if (row) handleKeyDown(e, row);
                    }}
                    className="flex items-center justify-between px-2 h-8 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                      onClick={() => setSelectedSpell(spell)}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs font-medium text-slate-700 truncate min-w-0 flex-1">
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
                        spell={spell}
                        canPrepare={canPrepare}
                        onToggle={togglePrepare}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <SpellDetailDialog
        spell={selectedSpell}
        open={selectedSpell !== null}
        onOpenChange={(open) => !open && setSelectedSpell(null)}
      />
    </>
  );
}

export function SpellsPanel() {
  const { character } = useCharacter();
  const preparation = useSpellPreparation();
  const spellbook = useWizardSpellbook();

  if (!character) return null;

  const isWizard = character.classes.some((c) => c.className === 'Wizard');

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

  const prepareContent = (
    <>
      {preparation.canPrepare && (
        <QuotaBar
          preparedCount={preparation.preparedCount}
          preparedMax={preparation.preparedMax}
          quotaColor={preparation.quotaColor}
          warningMessage={preparation.warningMessage}
        />
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        <SpellList
          groupedSpells={groupedSpells as Map<number, DisplaySpell[]>}
          hasNoSpells={hasNoSpells}
          canPrepare={preparation.canPrepare}
          togglePrepare={preparation.togglePrepare}
        />
      </div>
    </>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2 flex flex-col">
        <div className="text-xs font-bold text-slate-700 mb-2 px-1 shrink-0">
          Spellbook
        </div>

        {isWizard ? (
          <Tabs.Root defaultValue="prepare" className="flex flex-col flex-1 min-h-0">
            <Tabs.List className="shrink-0 flex border-b border-slate-200 mb-2">
              <Tabs.Trigger
                value="prepare"
                className="flex-1 text-xs font-medium py-1 border-b-2 border-transparent data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 text-slate-600"
              >
                Prepare
              </Tabs.Trigger>
              <Tabs.Trigger
                value="manage"
                className="flex-1 text-xs font-medium py-1 border-b-2 border-transparent data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 text-slate-600"
              >
                Manage Book
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="prepare" className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {prepareContent}
            </Tabs.Content>
            <Tabs.Content value="manage" className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {spellbook.isLoading ? (
                <div className="text-xs text-slate-400 text-center py-4">
                  Loading spells...
                </div>
              ) : (
                <WizardSpellbookManager
                  spellbookSpells={spellbook.spellbookSpells}
                  availableToAdd={spellbook.availableToAdd}
                  onAdd={spellbook.addSpell}
                  onRemove={spellbook.removeSpell}
                />
              )}
            </Tabs.Content>
          </Tabs.Root>
        ) : (
          prepareContent
        )}
      </Card>
    </TooltipProvider>
  );
}
