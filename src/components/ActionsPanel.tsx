import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Sparkles, Sword, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import type { ActionFilter, CombatAction, ResourcePool } from '../utils/combatActions';
import {
  filterActions,
  getFeatureActions,
  getResourcePools,
  getSpells,
  getUnarmedStrikeAction,
  getWeaponAttacks,
} from '../utils/combatActions';

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function renderBreakdownTooltip(
  title: string,
  breakdown: { name: string; value: number }[] | undefined,
  formatValue: (v: number) => string,
  unit?: string
) {
  return (
    <>
      <div className="font-bold text-slate-900 mb-1">{title}</div>
      <hr className="my-1 border-slate-300" />
      {breakdown && breakdown.map((source, i) => (
        <div key={i} className="text-sm text-slate-700 flex justify-between">
          <span>{source.name}</span>
          <span className="font-medium">
            {formatValue(source.value)}{unit || ''}
          </span>
        </div>
      ))}
      <hr className="my-1 border-slate-300" />
      <div className="text-sm font-bold text-slate-900 flex justify-between">
        <span>Total</span>
        <span>{breakdown ? formatValue(breakdown.reduce((sum, s) => sum + s.value, 0)) : '0'}{unit || ''}</span>
      </div>
    </>
  );
}

const FILTER_TABS: { key: ActionFilter; label: string; icon?: React.ReactNode }[] = [
  { key: 'all', label: 'All' },
  { key: 'action', label: 'Actions', icon: <Sword className="w-3 h-3" /> },
  { key: 'bonus-action', label: 'Bonus', icon: <Zap className="w-3 h-3" /> },
  { key: 'reaction', label: 'React', icon: <Sparkles className="w-3 h-3" /> },
  { key: 'weapon', label: 'Weapons', icon: <Sword className="w-3 h-3" /> },
  { key: 'spell', label: 'Spells', icon: <Sparkles className="w-3 h-3" /> },
];

const SOURCE_COLORS: Record<string, string> = {
  weapon: 'bg-blue-100 text-blue-800',
  unarmed: 'bg-blue-100 text-blue-800',
  feature: 'bg-green-100 text-green-800',
  feat: 'bg-purple-100 text-purple-800',
  race: 'bg-orange-100 text-orange-800',
  spell: 'bg-red-100 text-red-800',
};

const TYPE_COLORS: Record<string, string> = {
  action: 'bg-slate-200 text-slate-800',
  'bonus-action': 'bg-amber-100 text-amber-800',
  reaction: 'bg-cyan-100 text-cyan-800',
};

interface ActionsPanelProps {
  character?: import('../types').Character;
}

export function ActionsPanel(_props: ActionsPanelProps) {
  const context = useCharacter();
  // Use prop if provided (for backward compatibility), otherwise use context
  // Non-null assertion because CharacterView handles loading/not-found states before rendering
  const character = _props.character ?? context.character!;
  const update = context.update;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ActionFilter>('all');
  const [actions, setActions] = useState<CombatAction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track manual spell slot overrides with the key they were created against.
  // When spellSlotsKey changes (external update), overrides become stale and are ignored.
  const [manualSlotState, setManualSlotState] = useState<{
    key: string;
    overrides: Record<number, number>;
  }>({ key: '', overrides: {} });

  // Stable memo key for action list - use JSON strings directly as dependency
  const actionDataKey = JSON.stringify({
    equipment: character.equipment,
    spells: character.spells,
    classes: character.classes,
    feats: character.feats,
    race: character.race,
    proficiencyBonus: character.proficiencyBonus,
    abilityScores: character.abilityScores,
  });

  // Stable memo key for spell slots - use JSON string
  const spellSlotsKey = JSON.stringify(character.spellSlots);

  // Overrides are only valid when they match the current spellSlotsKey
  const manualSlotUsed = manualSlotState.key === spellSlotsKey
    ? manualSlotState.overrides
    : {};

  // Only reload actions when relevant data changes
  useEffect(() => {
    let cancelled = false;
    async function loadActions() {
      const weaponActions = getWeaponAttacks(character);
      const unarmedStrike = getUnarmedStrikeAction(character);
      const featureActions = await getFeatureActions(character);
      const spellActions = getSpells(character);
      
      const allActions = [unarmedStrike, ...weaponActions, ...featureActions, ...spellActions];
      if (!cancelled) {
        setActions(allActions);
        setLoading(false);
      }
    }
    
    loadActions();
    return () => { cancelled = true; };
  }, [actionDataKey]);

  // Derive resources from spell slots (pure computation, no effect needed)
  const resources = useMemo(
    () => getResourcePools(character),
    [character]
  );

  const filteredActions = useMemo(
    () => filterActions(actions, filter, searchTerm),
    [actions, filter, searchTerm]
  );

  async function handleSlotToggle(level: number, clickedIndex: number) {
    // If clicking on already-used slot, mark it and all after as available (toggle off)
    // If clicking on available slot, mark it and all before as used (toggle on)
    const levelSlots = character.spellSlots.find(s => s.level === level);
    if (!levelSlots) return;
    
    const currentUsed = (manualSlotUsed[level] !== undefined) 
      ? manualSlotUsed[level] 
      : levelSlots.used;
    
    // If clicking on a slot that's already marked as used, toggle it off
    if (clickedIndex < currentUsed) {
      // Mark as unused (allow going to 0)
      const newUsed = clickedIndex;
      
      if (newUsed === levelSlots.used) {
        // If matching stored value, clear manual override
        setManualSlotState(prev => {
          const next = { ...prev.overrides };
          delete next[level];
          return { key: spellSlotsKey, overrides: next };
        });
      } else {
        setManualSlotState(prev => ({
          key: spellSlotsKey,
          overrides: { ...prev.overrides, [level]: newUsed },
        }));
      }
      
      await update({ spellSlots: character.spellSlots.map(s => 
        s.level === level 
          ? { ...s, used: newUsed }
          : s
      )});
    } else {
      // Mark as used up to this slot
      const newUsed = clickedIndex + 1;
      
      if (newUsed === levelSlots.used) {
        // If matching stored value, clear manual override
        setManualSlotState(prev => {
          const next = { ...prev.overrides };
          delete next[level];
          return { key: spellSlotsKey, overrides: next };
        });
      } else {
        setManualSlotState(prev => ({
          key: spellSlotsKey,
          overrides: { ...prev.overrides, [level]: newUsed },
        }));
      }
      
      await update({ spellSlots: character.spellSlots.map(s => 
        s.level === level 
          ? { ...s, used: newUsed }
          : s
      )});
    }
  }

  function isSlotUsed(pool: ResourcePool, index: number): boolean {
    const level = parseInt(pool.id.replace('spell-slot-', ''), 10);
    const levelSlots = character.spellSlots.find(s => s.level === level);
    const storedUsed = levelSlots?.used ?? 0;
    const used = (manualSlotUsed[level] !== undefined) ? manualSlotUsed[level] : storedUsed;
    return index < used;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2 flex flex-col">
        <div className="flex flex-col gap-2 mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-7 text-xs"
            />
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-2 py-0.5 text-xs rounded transition-colors flex items-center gap-1 ${
                  filter === tab.key
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {resources.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-2 px-1">
            {resources.map((pool) => (
              <div key={pool.id} className="text-xs flex items-center gap-1">
                <span className="text-slate-500">{pool.name}: </span>
                <span className="flex inline-flex gap-0.5">
                  {Array.from({ length: pool.max }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSlotToggle(parseInt(pool.id.replace('spell-slot-', '')), i)}
                      className={`w-3 h-3 border rounded transition-colors ${
                        isSlotUsed(pool, i)
                          ? 'bg-slate-300 border-slate-400'
                          : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      }`}
                      title={isSlotUsed(pool, i) ? 'Click to restore' : 'Click to use'}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-xs text-slate-400 text-center py-4">Loading...</div>
          ) : filteredActions.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-4">No actions found</div>
          ) : (
            <div className="space-y-1">
              {filteredActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded text-xs hover:bg-slate-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-slate-700 cursor-help truncate">
                            {action.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xl">
                          <div className="text-sm flex items-start gap-3">
                            <div className="space-y-1 max-w-sm">
                              {action.description && <p className="font-medium text-slate-700">{action.description}</p>}
                              {action.spellDescription && <p className="text-slate-600">{action.spellDescription}</p>}
                            </div>
                            {action.damageProgression && action.damageProgression.length > 0 && (
                              <div className="border-l border-slate-300 pl-3 min-w-[110px]">
                                <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Damage</div>
                                <div className="space-y-0.5 text-xs text-slate-700">
                                  {action.damageProgression.map((entry) => (
                                    <div key={entry.label} className="flex items-center justify-between gap-2">
                                      <span>{entry.label}</span>
                                      <span className="font-medium">{entry.dice}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      
                      {action.resourceCost && (
                        <span className="text-xs text-amber-600">
                          ({action.resourceCost.amount} {action.resourceCost.resourceName})
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-500">
                      {action.toHit && (
                        <>
                          <span>1d20</span>
                          {action.toHitBreakdown && action.toHitBreakdown.length > 0 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium text-slate-600 cursor-help">{action.toHit}</span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="w-48">
                                {renderBreakdownTooltip('Attack Roll', action.toHitBreakdown, formatModifier)}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="font-medium text-slate-600">{action.toHit}</span>
                          )}
                        </>
                      )}

                      {action.saveDC != null && action.saveAbility && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium text-slate-600 cursor-help">
                              DC {action.saveDC} {action.saveAbility}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="w-48">
                            {renderBreakdownTooltip('Spell Save DC', action.saveDCBreakdown, formatModifier)}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {action.damage && (
                        <>
                          <span>{action.damage.replace(/[+-]\d+$/, '')}</span>
                          {action.damage.match(/[+-]\d+$/) && (
                            action.damageBonusSources && action.damageBonusSources.length > 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">{action.damage.match(/[+-]\d+$/)?.[0]}</span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="w-48">
                                  {renderBreakdownTooltip('Damage Bonus', action.damageBonusSources, formatModifier)}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span>{action.damage.match(/[+-]\d+$/)?.[0]}</span>
                            )
                          )}
                        </>
                      )}
                      
                      {action.damageType && <span className="text-slate-400">({action.damageType})</span>}
                      
                      {action.requirements && (
                        <span className="text-slate-400">• {action.requirements}</span>
                      )}
                      {action.castingTime && (
                        <span className="text-slate-400">• {action.castingTime}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${TYPE_COLORS[action.type]}`}>
                      {action.type}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${SOURCE_COLORS[action.source]}`}>
                      {action.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
}
