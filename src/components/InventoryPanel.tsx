import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCharacter } from '../contexts/CharacterContext';
import type { Currency, Equipment as EquipmentType } from '../types';
import {
  isEquippable,
  getTotalWeight,
  getCarryingCapacity,
  getEncumbranceStatus,
  getAttunedCount,
  getEquippedItems,
  getNonEquippedItems,
  getRarityColor,
  formatCurrencyTotal,
} from '../utils/inventory';
import { useEffect, useRef, useState } from 'react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  displayClass?: string;
  inputClass?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
}

function EditableField({ value, onSave, displayClass = '', inputClass = '', type = 'text', min, max }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={inputClass}
        min={min}
        max={max}
      />
    );
  }

  return (
    <span
      className={`cursor-pointer hover:text-purple-700 ${displayClass}`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value}
    </span>
  );
}

interface EncumbranceBarProps {
  weight: number;
  capacity: number;
  onWeightEdit: (weight: number) => void;
}

function EncumbranceBar({ weight, capacity, onWeightEdit }: EncumbranceBarProps) {
  const { ratio, isOverloaded } = getEncumbranceStatus(weight, capacity);
  
  let colorClass = 'bg-green-500';
  if (ratio >= 1) colorClass = 'bg-red-600';
  else if (ratio >= 0.75) colorClass = 'bg-orange-500';
  else if (ratio >= 0.5) colorClass = 'bg-yellow-500';
  
  const percentage = Math.min(ratio * 100, 100);
  
  const handleWeightSave = (value: string) => {
    const numValue = parseInt(value) || 0;
    onWeightEdit(numValue);
  };
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <EditableField
        value={String(weight)}
        onSave={handleWeightSave}
        displayClass={isOverloaded ? 'text-red-600 font-bold' : 'text-slate-600'}
        inputClass="w-14 h-5 text-xs"
        type="number"
        min={0}
      />
      <span className="text-slate-500">/ {capacity} lbs</span>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface AttunementDisplayProps {
  attuned: number;
  max: number;
  onAttunedEdit: (attuned: number) => void;
}

function AttunementDisplay({ attuned, max, onAttunedEdit }: AttunementDisplayProps) {
  const handleAttunedSave = (value: string) => {
    const numValue = parseInt(value) || 0;
    onAttunedEdit(numValue);
  };
  
  return (
    <div className="text-xs text-slate-600 flex items-center gap-1">
      <EditableField
        value={String(attuned)}
        onSave={handleAttunedSave}
        displayClass=""
        inputClass="w-8 h-5 text-xs"
        type="number"
        min={0}
        max={max}
      />
      <span>/ {max} attuned</span>
    </div>
  );
}

function EquipmentItem({ 
  item, 
  onToggle 
}: { 
  item: EquipmentType; 
  onToggle?: (item: EquipmentType) => void;
}) {
  const canEquip = isEquippable(item);
  
  const handleToggle = () => {
    if (canEquip && onToggle) {
      onToggle(item);
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 ${canEquip ? 'cursor-pointer' : ''}`}
          onClick={handleToggle}
        >
          {canEquip && (
            <input 
              type="checkbox" 
              checked={item.equipped ?? false}
              onChange={handleToggle}
              className="w-3 h-3"
            />
          )}
          <span className="flex-1 text-sm truncate">{item.name}</span>
          {item.attuned && (
            <span className="text-[10px] bg-purple-600 text-white px-1 rounded">A</span>
          )}
          <span className="text-xs text-slate-500 w-10 text-right">{item.weight}lb</span>
          <span className="text-xs text-slate-500 w-12 text-right">{item.cost || '—'}</span>
          <div className={`w-2 h-2 rounded-full ${getRarityColor(item.rarity)}`} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-64">
        <div className="font-bold text-slate-900">
          {item.name}
          <span className="ml-2 text-xs font-normal text-slate-500 capitalize">{item.rarity}</span>
        </div>
        <div className="text-xs text-slate-600 mb-1">
          {item.cost && <span>{item.cost} · </span>}
          {item.weight} lbs
        </div>
        {item.armorCategory && (
          <div className="text-xs text-slate-700 mb-1">
            {item.armorCategory} Armor{item.armorClass ? ` (+${item.armorClass} AC)` : ''}
          </div>
        )}
        {item.damage && (
          <div className="text-xs text-slate-700 mb-1">
            {item.damage} damage{item.properties?.length ? ` · ${item.properties.join(', ')}` : ''}
          </div>
        )}
        {item.attunement && (
          <div className="text-xs text-amber-600 mb-1">Requires Attunement</div>
        )}
        <hr className="my-1 border-slate-300" />
        <div className="text-xs text-slate-700">{item.description}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function EquipmentSection({ 
  title, 
  items,
  onToggle 
}: { 
  title: string; 
  items: EquipmentType[];
  onToggle?: (item: EquipmentType) => void;
}) {
  if (items.length === 0) return null;
  
  return (
    <div className="mb-2">
      <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">{title}</h4>
      {items.map((item, idx) => (
        <EquipmentItem key={idx} item={item} onToggle={onToggle} />
      ))}
    </div>
  );
}

interface CurrencyFieldProps {
  label: string;
  value: number;
  onSave: (value: string) => void;
}

function CurrencyField({ label, value, onSave }: CurrencyFieldProps) {
  return (
    <label className="flex items-center gap-1">
      <span>{label}:</span>
      <EditableField
        value={String(value)}
        onSave={onSave}
        displayClass=""
        inputClass="w-12 h-5 text-xs"
        type="number"
        min={0}
      />
    </label>
  );
}

interface CurrencyDisplayProps {
  currency: Currency;
  onCurrencyEdit: (currency: Currency) => void;
}

function CurrencyDisplay({ currency, onCurrencyEdit }: CurrencyDisplayProps) {
  const handleCurrencySave = (field: keyof Currency) => (value: string) => {
    const numValue = parseInt(value) || 0;
    onCurrencyEdit({ ...currency, [field]: numValue });
  };
  
  return (
    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-2 mt-2">
      <div className="flex gap-2 items-center">
        <CurrencyField label="CP" value={currency.cp} onSave={handleCurrencySave('cp')} />
        <CurrencyField label="SP" value={currency.sp} onSave={handleCurrencySave('sp')} />
        <CurrencyField label="EP" value={currency.ep} onSave={handleCurrencySave('ep')} />
        <CurrencyField label="GP" value={currency.gp} onSave={handleCurrencySave('gp')} />
        <CurrencyField label="PP" value={currency.pp} onSave={handleCurrencySave('pp')} />
      </div>
      <span className="text-slate-500">{formatCurrencyTotal(currency)}</span>
    </div>
  );
}

export function InventoryPanel() {
  const { character, update } = useCharacter();
  
  const [manualWeight, setManualWeight] = useState<number | undefined>(undefined);
  const [manualAttuned, setManualAttuned] = useState<number | undefined>(undefined);
  
  if (!character) return null;
  
  const totalWeight = getTotalWeight(character.equipment);
  const capacity = getCarryingCapacity(character.abilityScores.strength);
  const attunedCount = getAttunedCount(character.equipment);
  
  const displayWeight = manualWeight ?? totalWeight;
  const displayAttuned = manualAttuned ?? attunedCount;
  
  const equipped = getEquippedItems(character.equipment);
  const nonEquipped = getNonEquippedItems(character.equipment);
  
  const equippable = nonEquipped.filter(isEquippable);
  const nonEquippable = nonEquipped.filter(item => !isEquippable(item));
  
  const sortedEquipped = [...equipped].sort((a, b) => a.name.localeCompare(b.name));
  const sortedEquippable = [...equippable].sort((a, b) => a.name.localeCompare(b.name));
  const sortedNonEquippable = [...nonEquippable].sort((a, b) => a.name.localeCompare(b.name));
  
  const handleToggleEquip = async (item: EquipmentType) => {
    const newEquipped = !item.equipped;
    const updatedEquipment = character.equipment.map(e => 
      e.name === item.name ? { ...e, equipped: newEquipped } : e
    );
    await update({ equipment: updatedEquipment });
  };
  
  const handleWeightEdit = (weight: number) => {
    setManualWeight(weight);
  };
  
  const handleAttunedEdit = (attuned: number) => {
    setManualAttuned(attuned);
  };
  
  const handleCurrencyEdit = async (currency: Currency) => {
    await update({ currency });
  };
  
  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full h-full p-2 flex flex-col">
        <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Inventory</h3>
        
        <div className="flex items-center justify-between mb-2">
          <EncumbranceBar weight={displayWeight} capacity={capacity} onWeightEdit={handleWeightEdit} />
          <AttunementDisplay attuned={displayAttuned} max={3} onAttunedEdit={handleAttunedEdit} />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <EquipmentSection 
            title="Equipped" 
            items={sortedEquipped} 
            onToggle={handleToggleEquip}
          />
          <EquipmentSection 
            title="Carried" 
            items={[...sortedEquippable, ...sortedNonEquippable]} 
            onToggle={handleToggleEquip}
          />
        </div>
        
        <CurrencyDisplay currency={character.currency} onCurrencyEdit={handleCurrencyEdit} />
      </Card>
    </TooltipProvider>
  );
}
