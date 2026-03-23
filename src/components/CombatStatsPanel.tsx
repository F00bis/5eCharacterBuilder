import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { StatusEffectsSection } from './StatusEffectsSection';
import { getArmorClass } from '../utils/armorClass';
import { calculateMaxHp, getInitiativeBreakdown, getSpeedBreakdown, getVisionBreakdown, type StatBreakdown, type VisionBreakdown } from '../utils/combatStats';
import { getModifier } from '../utils/abilityScores';

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function renderBreakdownTooltip(
  title: string,
  breakdown: StatBreakdown | null,
  formatValue: (v: number) => string,
  unit?: string
) {
  return (
    <>
      <div className="font-bold text-slate-900 mb-1">{title}</div>
      <hr className="my-1 border-slate-300" />
      {breakdown && breakdown.sources.map((source, i) => (
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
        <span>{breakdown ? formatValue(breakdown.total) : '0'}{unit || ''}</span>
      </div>
    </>
  );
}

interface CombatStatsPanelProps {
  character?: import('../types').Character;
  onUpdate?: (updates: Partial<import('../types').Character>) => void;
}

function getHpBreakdown(character: import('../types').Character) {
  const hpRollsTotal = character.hpRolls
    ? character.hpRolls.reduce((a, b) => a + b, 0)
    : character.maxHp ?? 0;
  const totalLevel = character.classes
    ? character.classes.reduce((sum, c) => sum + c.level, 0)
    : 1;
  const conMod = getModifier(character.abilityScores.constitution);
  const conModBonus = conMod * totalLevel;

  return {
    hpRollsTotal,
    conModBonus,
    hpBonus: character.hpBonus ?? 0,
    total: calculateMaxHp(character),
  };
}

export function CombatStatsPanel(_props: CombatStatsPanelProps) {
  const context = useCharacter();
  const character = _props.character ?? context.character!;
  const update = _props.onUpdate ?? context.update;

  const calculatedMaxHp = calculateMaxHp(character);
  
  const [isEditingCurrentHp, setIsEditingCurrentHp] = useState(false);
  const [isEditingMaxHp, setIsEditingMaxHp] = useState(false);
  const [isEditingTempHp, setIsEditingTempHp] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const [editedCurrentHp, setEditedCurrentHp] = useState(String(character.currentHp));
  const [editedMaxHp, setEditedMaxHp] = useState(String(character.maxHp));
  const [editedTempHp, setEditedTempHp] = useState(String(character.tempHp));
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [initiativeBreakdown, setInitiativeBreakdown] = useState<StatBreakdown | null>(null);
  const [speedBreakdown, setSpeedBreakdown] = useState<StatBreakdown | null>(null);
  const [visionBreakdown, setVisionBreakdown] = useState<VisionBreakdown | null>(null);

  const currentHpInputRef = useRef<HTMLInputElement>(null);
  const maxHpInputRef = useRef<HTMLInputElement>(null);
  const tempHpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingCurrentHp && currentHpInputRef.current) {
      currentHpInputRef.current.focus();
      currentHpInputRef.current.select();
    }
  }, [isEditingCurrentHp]);

  useEffect(() => {
    if (isEditingMaxHp && maxHpInputRef.current) {
      maxHpInputRef.current.focus();
      maxHpInputRef.current.select();
    }
  }, [isEditingMaxHp]);

  useEffect(() => {
    if (isEditingTempHp && tempHpInputRef.current) {
      tempHpInputRef.current.focus();
      tempHpInputRef.current.select();
    }
  }, [isEditingTempHp]);

  useEffect(() => {
    getInitiativeBreakdown(character).then(setInitiativeBreakdown);
    getSpeedBreakdown(character).then(setSpeedBreakdown);
    getVisionBreakdown(character).then(setVisionBreakdown);
  }, [character]);

  const acBreakdown = getArmorClass(character);

  const handleCurrentHpSave = () => {
    const value = parseInt(editedCurrentHp, 10);
    if (!isNaN(value) && value >= 0) {
      const cappedValue = Math.min(value, calculatedMaxHp);
      update({ currentHp: cappedValue });
    } else {
      setEditedCurrentHp(String(character.currentHp));
    }
    setIsEditingCurrentHp(false);
  };

  const handleMaxHpSave = () => {
    const value = parseInt(editedMaxHp, 10);
    if (!isNaN(value) && value > 0) {
      const currentCalculated = calculateMaxHp(character);
      const newHpBonus = value - (currentCalculated - (character.hpBonus ?? 0));
      update({ hpBonus: newHpBonus });
    } else {
      setEditedMaxHp(String(calculatedMaxHp));
    }
    setIsEditingMaxHp(false);
  };

  const handleTempHpSave = () => {
    const value = parseInt(editedTempHp, 10);
    if (!isNaN(value) && value >= 0) {
      update({ tempHp: value });
    } else {
      setEditedTempHp(String(character.tempHp));
    }
    setIsEditingTempHp(false);
  };

  const handleCurrentHpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCurrentHpSave();
    else if (e.key === 'Escape') {
      setEditedCurrentHp(String(character.currentHp));
      setIsEditingCurrentHp(false);
    }
  };

  const handleMaxHpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMaxHpSave();
    else if (e.key === 'Escape') {
      setEditedMaxHp(String(character.maxHp));
      setIsEditingMaxHp(false);
    }
  };

  const handleTempHpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTempHpSave();
    else if (e.key === 'Escape') {
      setEditedTempHp(String(character.tempHp));
      setIsEditingTempHp(false);
    }
  };

  const startEditing = (field: string) => {
    setEditingField(field);
    switch (field) {
      case 'initiative':
        setEditValues({ [field]: String(character.initiative) });
        break;
      case 'darkvision':
        setEditValues({ [field]: String(character.vision.darkvision ?? '') });
        break;
      case 'blindsight':
        setEditValues({ [field]: String(character.vision.blindsight ?? '') });
        break;
      case 'truesight':
        setEditValues({ [field]: String(character.vision.truesight ?? '') });
        break;
    }
  };

  const getDisplayValue = (field: string): string => {
    if (editingField === field) {
      return editValues[field] ?? '';
    }
    switch (field) {
      case 'initiative':
        return String(character.initiative);
      case 'darkvision':
        return character.vision.darkvision ? String(character.vision.darkvision) : '';
      case 'blindsight':
        return character.vision.blindsight ? String(character.vision.blindsight) : '';
      case 'truesight':
        return character.vision.truesight ? String(character.vision.truesight) : '';
      default:
        return '';
    }
  };

  const handleSave = (field: string) => {
    const value = editValues[field];
    const numValue = parseInt(value ?? '', 10);

    if (field === 'initiative') {
      if (!isNaN(numValue)) {
        update({ initiative: numValue });
      }
    } else {
      const visionField = field as 'darkvision' | 'truesight' | 'blindsight';
      const newVision = { ...character.vision };
      if (!isNaN(numValue) && numValue > 0) {
        newVision[visionField] = numValue;
      } else {
        delete newVision[visionField];
      }
      update({ vision: newVision });
    }
    setEditingField(null);
    setEditValues({});
  };

  const handleChange = (field: string, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') handleSave(field);
    else if (e.key === 'Escape') {
      setEditingField(null);
      setEditValues({});
    }
  };

  const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    const current = character.deathSaves[type];
    const newValue = current === index + 1 ? index : index + 1;
    update({
      deathSaves: {
        ...character.deathSaves,
        [type]: newValue,
      },
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Combat</h3>
        
        <div className="flex flex-1 mb-2">
          <div className="flex-1 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="cursor-help relative"
                  role="button"
                  tabIndex={0}
                  title="Click for AC breakdown"
                >
                  <Shield className="w-10 h-10 text-slate-700" strokeWidth={1.5} />
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">
                    {acBreakdown.total}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="w-48">
                <div className="font-bold text-slate-900 mb-1">Armor Class</div>
                <hr className="my-1 border-slate-300" />
                {acBreakdown.sources.map((source, i) => (
                  <div key={i} className="text-sm text-slate-700 flex justify-between">
                    <span>{source.description}</span>
                    <span className="font-medium">{source.value}</span>
                  </div>
                ))}
                <hr className="my-1 border-slate-300" />
                <div className="text-sm font-bold text-slate-900 flex justify-between">
                  <span>Total</span>
                  <span>{acBreakdown.total}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-16 flex justify-center">
              <div className="flex items-center gap-1">
                {isEditingCurrentHp ? (
                  <Input
                    ref={currentHpInputRef}
                    type="number"
                    value={editedCurrentHp}
                    onChange={(e) => setEditedCurrentHp(e.target.value)}
                    onBlur={handleCurrentHpSave}
                    onKeyDown={handleCurrentHpKeyDown}
                    className="h-5 w-10 text-xs"
                    min="0"
                  />
                ) : (
                  <div
                    className="text-base font-bold text-red-600 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => setIsEditingCurrentHp(true)}
                  >
                    {character.currentHp}
                  </div>
                )}
                <span className="text-slate-400">/</span>
                {isEditingMaxHp ? (
                  <Input
                    ref={maxHpInputRef}
                    type="number"
                    value={editedMaxHp}
                    onChange={(e) => setEditedMaxHp(e.target.value)}
                    onBlur={handleMaxHpSave}
                    onKeyDown={handleMaxHpKeyDown}
                    className="h-5 w-10 text-xs"
                    min="1"
                  />
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="text-base font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                        onClick={() => setIsEditingMaxHp(true)}
                      >
                        {calculatedMaxHp}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="w-48">
                      {(() => {
                        const breakdown = getHpBreakdown(character);
                        return (
                          <>
                            <div className="font-bold text-slate-900 mb-1">Max HP</div>
                            <hr className="my-1 border-slate-300" />
                            <div className="text-sm text-slate-700 flex justify-between">
                              <span>HP Rolls</span>
                              <span className="font-medium">{breakdown.hpRollsTotal}</span>
                            </div>
                            <div className="text-sm text-slate-700 flex justify-between">
                              <span>Con Bonus</span>
                              <span className="font-medium">{breakdown.conModBonus >= 0 ? '+' : ''}{breakdown.conModBonus}</span>
                            </div>
                            {breakdown.hpBonus !== 0 && (
                              <div className="text-sm text-slate-700 flex justify-between">
                                <span>HP Bonus</span>
                                <span className="font-medium">{breakdown.hpBonus >= 0 ? '+' : ''}{breakdown.hpBonus}</span>
                              </div>
                            )}
                            <hr className="my-1 border-slate-300" />
                            <div className="text-sm font-bold text-slate-900 flex justify-between">
                              <span>Total</span>
                              <span>{breakdown.total}</span>
                            </div>
                          </>
                        );
                      })()}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-16 flex justify-center">
              <div className="flex items-center gap-1">
                {isEditingTempHp ? (
                  <Input
                    ref={tempHpInputRef}
                    type="number"
                    value={editedTempHp}
                    onChange={(e) => setEditedTempHp(e.target.value)}
                    onBlur={handleTempHpSave}
                    onKeyDown={handleTempHpKeyDown}
                    className="h-5 w-10 text-xs"
                    min="0"
                  />
                ) : (
                  <div
                    className="text-base font-bold text-blue-600 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => setIsEditingTempHp(true)}
                  >
                    {character.tempHp}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-0.5 cursor-help">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={`success-${i}`}
                        onClick={() => toggleDeathSave('successes', i)}
                        className={`w-3.5 h-3.5 border rounded transition-colors ${
                          character.deathSaves.successes > i
                            ? 'bg-green-500 border-green-600'
                            : 'bg-green-50 border-green-300 hover:bg-green-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={`fail-${i}`}
                        onClick={() => toggleDeathSave('failures', i)}
                        className={`w-3.5 h-3.5 border rounded transition-colors ${
                          character.deathSaves.failures > i
                            ? 'bg-red-500 border-red-600'
                            : 'bg-red-50 border-red-300 hover:bg-red-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="w-72">
                <p className="text-sm">
                  When at 0 HP: roll d20. 10+ = success, 9- = failure. 
                  3 successes = stable, 3 failures = death. 
                  1 = 2 failures, 20 = regain 1 HP.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-1 mb-1.5">
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Armor Class</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Hit Points</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Temp HP</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Death Saves</span>
          </div>
        </div>

        <div className="border-t border-slate-200 mb-2" />

        <div className="flex flex-1 mb-2">
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Initiative</span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-slate-500">Speed</span>
          </div>
        </div>

        <div className="flex flex-1 mb-2">
          <div className="flex-1 flex justify-center">
            {editingField === 'initiative' ? (
              <Input
                type="number"
                value={getDisplayValue('initiative')}
                onChange={(e) => handleChange('initiative', e.target.value)}
                onBlur={() => handleSave('initiative')}
                onKeyDown={(e) => handleKeyDown(e, 'initiative')}
                className="h-5 w-10 text-xs text-center"
                autoFocus
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="text-sm font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => startEditing('initiative')}
                  >
                    {formatModifier(character.initiative)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-56">
                  {renderBreakdownTooltip('Initiative', initiativeBreakdown, formatModifier)}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm font-bold text-slate-700">{character.speed} ft</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="w-56">
                {renderBreakdownTooltip('Speed', speedBreakdown, String, ' ft')}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="border-t border-slate-200 mb-2" />

        <div className="flex flex-col gap-1 mb-1">
          <div className="flex flex-row items-center justify-between px-1">
            <span className="text-xs text-slate-500">Darkvision</span>
            {editingField === 'darkvision' ? (
              <Input
                type="number"
                value={getDisplayValue('darkvision')}
                onChange={(e) => handleChange('darkvision', e.target.value)}
                onBlur={() => handleSave('darkvision')}
                onKeyDown={(e) => handleKeyDown(e, 'darkvision')}
                className="h-5 w-12 text-xs"
                placeholder="0"
                autoFocus
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="text-xs font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => startEditing('darkvision')}
                  >
                    {character.vision.darkvision ? `${character.vision.darkvision} ft` : '-'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-56">
                  {visionBreakdown && renderBreakdownTooltip('Darkvision', visionBreakdown.darkvision, String, ' ft')}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="flex flex-row items-center justify-between px-1">
            <span className="text-xs text-slate-500">Blindsight</span>
            {editingField === 'blindsight' ? (
              <Input
                type="number"
                value={getDisplayValue('blindsight')}
                onChange={(e) => handleChange('blindsight', e.target.value)}
                onBlur={() => handleSave('blindsight')}
                onKeyDown={(e) => handleKeyDown(e, 'blindsight')}
                className="h-5 w-12 text-xs"
                placeholder="0"
                autoFocus
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="text-xs font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => startEditing('blindsight')}
                  >
                    {character.vision.blindsight ? `${character.vision.blindsight} ft` : '-'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-56">
                  {visionBreakdown && renderBreakdownTooltip('Blindsight', visionBreakdown.blindsight, String, ' ft')}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <div className="flex flex-row items-center justify-between px-1">
            <span className="text-xs text-slate-500">Truesight</span>
            {editingField === 'truesight' ? (
              <Input
                type="number"
                value={getDisplayValue('truesight')}
                onChange={(e) => handleChange('truesight', e.target.value)}
                onBlur={() => handleSave('truesight')}
                onKeyDown={(e) => handleKeyDown(e, 'truesight')}
                className="h-5 w-12 text-xs"
                placeholder="0"
                autoFocus
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="text-xs font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                    onClick={() => startEditing('truesight')}
                  >
                    {character.vision.truesight ? `${character.vision.truesight} ft` : '-'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-56">
                  {visionBreakdown && renderBreakdownTooltip('Truesight', visionBreakdown.truesight, String, ' ft')}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 mb-2" />

        <StatusEffectsSection />
      </Card>
    </TooltipProvider>
  );
}
