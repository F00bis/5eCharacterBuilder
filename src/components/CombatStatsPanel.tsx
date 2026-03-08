import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Character } from '../types';
import { getArmorClass } from '../utils/armorClass';

interface CombatStatsPanelProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export function CombatStatsPanel({ character, onUpdate }: CombatStatsPanelProps) {
  const [isEditingCurrentHp, setIsEditingCurrentHp] = useState(false);
  const [isEditingMaxHp, setIsEditingMaxHp] = useState(false);
  const [isEditingTempHp, setIsEditingTempHp] = useState(false);

  const [editedCurrentHp, setEditedCurrentHp] = useState(String(character.currentHp));
  const [editedMaxHp, setEditedMaxHp] = useState(String(character.maxHp));
  const [editedTempHp, setEditedTempHp] = useState(String(character.tempHp));

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

  const acBreakdown = getArmorClass(character);
  const hpPercentage = character.maxHp > 0 
    ? (character.currentHp / character.maxHp) * 100 
    : 0;

  const handleCurrentHpSave = () => {
    const value = parseInt(editedCurrentHp, 10);
    if (!isNaN(value) && value >= 0) {
      const cappedValue = Math.min(value, character.maxHp);
      onUpdate({ currentHp: cappedValue });
    } else {
      setEditedCurrentHp(String(character.currentHp));
    }
    setIsEditingCurrentHp(false);
  };

  const handleMaxHpSave = () => {
    const value = parseInt(editedMaxHp, 10);
    if (!isNaN(value) && value > 0) {
      const newMaxHp = value;
      const newCurrentHp = Math.min(character.currentHp, newMaxHp);
      onUpdate({ maxHp: newMaxHp, currentHp: newCurrentHp });
    } else {
      setEditedMaxHp(String(character.maxHp));
    }
    setIsEditingMaxHp(false);
  };

  const handleTempHpSave = () => {
    const value = parseInt(editedTempHp, 10);
    if (!isNaN(value) && value >= 0) {
      onUpdate({ tempHp: value });
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

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Combat</h3>
        
        <div className="mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center justify-center cursor-help relative"
                role="button"
                tabIndex={0}
                title="Click for AC breakdown"
              >
                <Shield className="w-16 h-16 text-slate-700" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">
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

        <div className="mb-3">
          <div className="text-xs text-slate-500 mb-1">Hit Points</div>
          <div className="flex items-center gap-1 mb-1">
            {isEditingCurrentHp ? (
              <Input
                ref={currentHpInputRef}
                type="number"
                value={editedCurrentHp}
                onChange={(e) => setEditedCurrentHp(e.target.value)}
                onBlur={handleCurrentHpSave}
                onKeyDown={handleCurrentHpKeyDown}
                className="h-6 w-14 text-sm"
                min="0"
              />
            ) : (
              <div
                className="text-lg font-bold text-red-600 cursor-pointer hover:text-purple-700 transition-colors"
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
                className="h-6 w-14 text-sm"
                min="1"
              />
            ) : (
              <div
                className="text-lg font-bold text-slate-700 cursor-pointer hover:text-purple-700 transition-colors"
                onClick={() => setIsEditingMaxHp(true)}
              >
                {character.maxHp}
              </div>
            )}
          </div>
          <Progress value={hpPercentage} className="h-2" />
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">Temp HP</div>
          <div className="flex items-center gap-1">
            {isEditingTempHp ? (
              <Input
                ref={tempHpInputRef}
                type="number"
                value={editedTempHp}
                onChange={(e) => setEditedTempHp(e.target.value)}
                onBlur={handleTempHpSave}
                onKeyDown={handleTempHpKeyDown}
                className="h-6 w-16 text-sm"
                min="0"
              />
            ) : (
              <div
                className="text-lg font-bold text-blue-600 cursor-pointer hover:text-purple-700 transition-colors"
                onClick={() => setIsEditingTempHp(true)}
              >
                {character.tempHp}
              </div>
            )}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
