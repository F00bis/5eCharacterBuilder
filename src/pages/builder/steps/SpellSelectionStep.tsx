import { useCallback, useEffect, useState, useMemo } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdSpells } from '../../../data/srdSpells';
import { calculateSpellEntitlements, getMaxAccessibleSpellLevel, getSpellListForClass, loadSpellProgressions } from '../../../utils/spellCalculations';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SpellSchool } from '@/types/spells';

interface SpellSelectionStepProps {
  isVisible: boolean;
}

const SCHOOL_COLORS: Record<SpellSchool, string> = {
  Abjuration: 'bg-blue-100 text-blue-800 border-blue-300',
  Conjuration: 'bg-green-100 text-green-800 border-green-300',
  Divination: 'bg-purple-100 text-purple-800 border-purple-300',
  Enchantment: 'bg-pink-100 text-pink-800 border-pink-300',
  Evocation: 'bg-red-100 text-red-800 border-red-300',
  Illusion: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  Necromancy: 'bg-gray-100 text-gray-800 border-gray-300',
  Transmutation: 'bg-amber-100 text-amber-800 border-amber-300',
};

function getSchoolColor(school: SpellSchool): string {
  return SCHOOL_COLORS[school] || 'bg-slate-100 text-slate-800 border-slate-300';
}

export default function SpellSelectionStep({ isVisible }: SpellSelectionStepProps) {
  const { state, dispatch } = useCharacterBuilder();
  const { classes, subclass } = state.draft;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      loadSpellProgressions().then(() => setIsLoading(false));
    }
  }, [isVisible]);

  const entitlements = useMemo(() => {
    return calculateSpellEntitlements(classes || [], subclass);
  }, [classes, subclass]);

  const maxSpellLevel = useMemo(() => {
    return getMaxAccessibleSpellLevel(classes || [], subclass);
  }, [classes, subclass]);

  const [selectedCantrips, setSelectedCantrips] = useState<typeof srdSpells[0][]>([]);
  const [selectedSpells, setSelectedSpells] = useState<typeof srdSpells[0][]>([]);
  const [preparedSpells, setPreparedSpells] = useState<Set<string>>(new Set());

  const classNames = useMemo(() => {
    return (classes || []).map(c => c.className);
  }, [classes]);

  const spellLists = useMemo(() => {
    const lists: string[] = [];
    for (const className of classNames) {
      const classList = getSpellListForClass(className, subclass);
      lists.push(...classList);
    }
    return [...new Set(lists)];
  }, [classNames, subclass]);

  const availableCantrips = useMemo<ComboboxOption[]>(() => {
    const selectedNames = new Set([...selectedCantrips.map(s => s.name)]);
    return srdSpells
      .filter(spell => spell.classes.some(c => spellLists.includes(c)) && spell.level === 0)
      .filter(spell => !selectedNames.has(spell.name))
      .map(spell => ({
        value: spell.name,
        label: spell.name,
      }));
  }, [spellLists, selectedCantrips]);

  const availableSpells = useMemo<ComboboxOption[]>(() => {
    const selectedNames = new Set([...selectedSpells.map(s => s.name)]);
    
    let filteredSpells = srdSpells
      .filter(spell => spell.classes.some(c => spellLists.includes(c)) && spell.level > 0)
      .filter(spell => !selectedNames.has(spell.name));

    if (maxSpellLevel !== null) {
      filteredSpells = filteredSpells.filter(spell => spell.level <= maxSpellLevel);
    }

    return filteredSpells
      .map(spell => ({
        value: spell.name,
        label: `${spell.name} (Lv ${spell.level})`,
      }));
  }, [spellLists, selectedSpells, maxSpellLevel]);

  const handleAddCantrip = useCallback((spellName: string) => {
    const spell = srdSpells.find(s => s.name === spellName);
    if (spell && selectedCantrips.length < (entitlements?.cantripsKnown || 0)) {
      setSelectedCantrips(prev => [...prev, spell]);
    }
  }, [selectedCantrips.length, entitlements]);

  const handleRemoveCantrip = useCallback((spellName: string) => {
    setSelectedCantrips(prev => prev.filter(s => s.name !== spellName));
  }, []);

  const handleAddSpell = useCallback((spellName: string) => {
    const spell = srdSpells.find(s => s.name === spellName);
    if (spell && selectedSpells.length < (entitlements?.spellsKnown || 0)) {
      setSelectedSpells(prev => [...prev, spell]);
    }
  }, [selectedSpells.length, entitlements]);

  const handleRemoveSpell = useCallback((spellName: string) => {
    setSelectedSpells(prev => prev.filter(s => s.name !== spellName));
  }, []);

  const handleTogglePrepared = useCallback((spellName: string) => {
    setPreparedSpells(prev => {
      const newSet = new Set(prev);
      if (newSet.has(spellName)) {
        newSet.delete(spellName);
      } else {
        newSet.add(spellName);
      }
      return newSet;
    });
  }, []);

  const saveToDraft = useCallback(() => {
    const characterSpells = [
      ...selectedCantrips.map(s => ({ ...s, prepared: false, source: 'Class' })),
      ...selectedSpells.map(s => ({ ...s, prepared: preparedSpells.has(s.name), source: 'Class' })),
    ];
    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        spells: characterSpells,
      },
    });
  }, [selectedCantrips, selectedSpells, preparedSpells, dispatch]);

  useEffect(() => {
    if (isVisible && entitlements) {
      saveToDraft();
    }
  }, [isVisible, entitlements, saveToDraft]);

  if (!isVisible || !entitlements) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-slate-500">Loading spell data...</span>
      </div>
    );
  }

  const canAddCantrips = selectedCantrips.length < entitlements.cantripsKnown;
  const canAddSpells = selectedSpells.length < entitlements.spellsKnown;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 h-full overflow-y-auto pr-4">
        {entitlements.warlockPactSlots && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900">Pact Magic</h3>
            <p className="text-sm text-purple-700">
              Pact Magic Slots: {entitlements.warlockPactSlots.slots} (Level {entitlements.warlockPactSlots.slotLevel})
            </p>
            {entitlements.mysticArcanum && entitlements.mysticArcanum.length > 0 && (
              <p className="text-sm text-purple-700 mt-1">
                Mystic Arcanum: {entitlements.mysticArcanum.map(l => `Level ${l}`).join(', ')}
              </p>
            )}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Cantrips {canAddCantrips && <span className="text-sm font-normal text-slate-500">(Select {entitlements.cantripsKnown - selectedCantrips.length} more)</span>}
          </h3>
          
          {selectedCantrips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCantrips.map(spell => (
                <Tooltip key={spell.name}>
                  <TooltipTrigger asChild>
                    <Badge 
                      className={`cursor-pointer ${getSchoolColor(spell.school)}`}
                      onRemove={() => handleRemoveCantrip(spell.name)}
                    >
                      {spell.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-80">
                    <div className="font-semibold">{spell.name}</div>
                    <div className="text-xs text-slate-600">Cantrip - {spell.school}</div>
                    <div className="text-xs text-slate-600 mt-1">{spell.description}</div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {canAddCantrips && (
            <Combobox
              options={availableCantrips}
              value=""
              onChange={handleAddCantrip}
              placeholder="Select cantrip..."
            />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Spells {canAddSpells && <span className="text-sm font-normal text-slate-500">(Select {entitlements.spellsKnown - selectedSpells.length} more)</span>}
          </h3>
          
          {selectedSpells.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSpells.map(spell => (
                <Tooltip key={spell.name}>
                  <TooltipTrigger asChild>
                    <Badge 
                      className={`cursor-pointer ${entitlements.canPrepare && preparedSpells.has(spell.name) ? 'ring-2 ring-purple-500 ' : ''}${getSchoolColor(spell.school)}`}
                      onRemove={() => handleRemoveSpell(spell.name)}
                      onClick={entitlements.canPrepare ? () => handleTogglePrepared(spell.name) : undefined}
                    >
                      {spell.name}
                      {entitlements.canPrepare && preparedSpells.has(spell.name) && " ★"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-80">
                    <div className="font-semibold">{spell.name}</div>
                    <div className="text-xs text-slate-600">Level {spell.level} - {spell.school}</div>
                    <div className="text-xs text-slate-600 mt-1">{spell.description}</div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {canAddSpells && (
            <Combobox
              options={availableSpells}
              value=""
              onChange={handleAddSpell}
              placeholder="Select spell..."
            />
          )}
        </div>

        {entitlements.canPrepare && entitlements.preparedSpellsMax && (
          <div className="text-sm text-slate-600">
            Prepared Spells: {preparedSpells.size} / {entitlements.preparedSpellsMax} (reference only)
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}