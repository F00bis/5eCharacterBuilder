import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CharacterSpell, DndSpell } from '../types';
import { groupSpellsByLevel } from '../utils/spellCalculations';
import { SpellTooltipDetail } from './SpellTooltipDetail';

export interface WizardSpellbookManagerProps {
  spellbookSpells: CharacterSpell[];
  availableToAdd: DndSpell[];
  onAdd: (spell: DndSpell) => void;
  onRemove: (spellName: string) => void;
}

function getLevelLabel(level: number): string {
  if (level === 0) return 'Cantrips';
  if (level === 1) return '1st Level';
  if (level === 2) return '2nd Level';
  if (level === 3) return '3rd Level';
  return `${level}th Level`;
}

export function WizardSpellbookManager({
  spellbookSpells,
  availableToAdd,
  onAdd,
  onRemove,
}: WizardSpellbookManagerProps) {
  const [selectedSpellName, setSelectedSpellName] = useState('');
  const [spellToRemove, setSpellToRemove] = useState<CharacterSpell | null>(null);

  const addOptions: ComboboxOption[] = availableToAdd.map((spell) => ({
    value: spell.name,
    label: `${spell.name} (Lv ${spell.level})`,
  }));

  const handleAddChange = (value: string) => {
    if (!value) return;
    const spell = availableToAdd.find((s) => s.name === value);
    if (spell) {
      onAdd(spell);
    }
    setSelectedSpellName('');
  };

  const handleConfirmRemove = () => {
    if (spellToRemove) {
      onRemove(spellToRemove.name);
      setSpellToRemove(null);
    }
  };

  const groupedSpells = groupSpellsByLevel(spellbookSpells);

  return (
    <div className="flex flex-col h-full">

      <div className="shrink-0 mb-2 flex items-center gap-2">
        <Button
          size="sm"
          className="text-xs"
          onClick={() => {
            /* Combobox trigger handles opening */
          }}
        >
          Add Spell
        </Button>
        <div className="flex-1">
          <Combobox
            options={addOptions}
            value={selectedSpellName}
            onChange={handleAddChange}
            placeholder="Search spells..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {spellbookSpells.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-4">
            Your spellbook is empty. Use Add Spell to record learned magic.
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(groupedSpells.entries()).map(([level, spells]) => (
              <div key={level}>
                <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-2 py-1 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    {getLevelLabel(level)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {spells.length}
                  </span>
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
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {spell.school}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSpellToRemove(spell)}
                        className="shrink-0 ml-2 p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${spell.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={spellToRemove !== null}
        onOpenChange={(open) => {
          if (!open) setSpellToRemove(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Spell</DialogTitle>
            <DialogDescription>
              Remove {spellToRemove?.name ?? ''} from your spellbook? It will no longer be available to prepare.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSpellToRemove(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRemove}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
