import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getAllEquipment } from '../../../db/equipment';
import { getAllFeats } from '../../../db/feats';
import { getClassByName } from '../../../db/classes';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { Ability, Equipment } from '../../../types';
import type { Feat } from '../../../types/feats';
import type { SrdEquipment } from '../../../types/equipment';
import { getModifier, formatModifier } from '../../../utils/abilityScores';
import { DollarSign, Sword, Shield, Package, Search } from 'lucide-react';

const ABILITIES: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_LABELS: Record<Ability, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma'
};

function rollStartingGold(formula: string): number {
  const match = formula.match(/(\d+)d(\d+)\s*\*\s*(\d+)/);
  if (!match) return 0;
  
  const numDice = parseInt(match[1], 10);
  const diceSides = parseInt(match[2], 10);
  const multiplier = parseInt(match[3], 10);
  
  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSides) + 1;
  }
  return total * multiplier;
}

export default function EquipmentFeatsStep() {
  const { state, dispatch } = useCharacterBuilder();
  const currentTotalLevel = (state.draft.classes || []).reduce((acc, c) => acc + c.level, 0);
  const isLevel1 = currentTotalLevel === 0 || state.mode === 'create';
  const pendingClass = (state.draft.classes || []).find(c => !c.subclass);
  const currentClassName = pendingClass?.className || state.draft.classes?.[0]?.className || '';
  const isLevelUp = state.mode === 'levelup' && pendingClass;
  
  const [equipmentMode, setEquipmentMode] = useState<'packages' | 'gold'>('packages');
  const [startingGold, setStartingGold] = useState<number | null>(null);
  const [equipmentChoices, setEquipmentChoices] = useState<Record<number, number>>({});
  const [shopItems, setShopItems] = useState<SrdEquipment[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Equipment[]>([]);
  const [shopSearch, setShopSearch] = useState('');
  const [shopFilter, setShopFilter] = useState<'all' | 'weapon' | 'armor' | 'gear'>('all');
  
  const [asiMode, setAsiMode] = useState<'asi' | 'feat'>('asi');
  const [asiChoice1, setAsiChoice1] = useState<{ type: '+1' | '+2'; ability?: Ability } | null>(null);
  const [asiChoice2, setAsiChoice2] = useState<Ability | null>(null);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [halfFeatAbility, setHalfFeatAbility] = useState<Ability | null>(null);
  
  const [allFeats, setAllFeats] = useState<Feat[]>([]);
  const [classData, setClassData] = useState<Awaited<ReturnType<typeof getClassByName>>>(undefined);
  
  const classEquipment = useMemo(() => {
    return classData?.startingEquipment || null;
  }, [classData]);
  
  useEffect(() => {
    if (currentClassName) {
      getClassByName(currentClassName).then(setClassData);
    }
  }, [currentClassName]);
  
  useEffect(() => {
    getAllFeats().then(setAllFeats);
  }, []);
  
  const asiLevels = useMemo(() => {
    if (!classData) return [4, 8, 12, 16, 19];
    const asiFeatures = classData.features.filter(f => f.name === 'Ability Score Improvement');
    return asiFeatures.map(f => f.levelAcquired);
  }, [classData]);
  
  const isAsiLevel = useMemo(() => {
    if (!isLevelUp || !pendingClass) return false;
    return asiLevels.includes(pendingClass.level);
  }, [isLevelUp, pendingClass, asiLevels]);
  
  const filteredShopItems = useMemo(() => {
    let items = shopItems;
    
    if (shopFilter === 'weapon') {
      items = items.filter(i => i.equipmentCategory === 'Weapon');
    } else if (shopFilter === 'armor') {
      items = items.filter(i => i.equipmentCategory === 'Armor');
    } else if (shopFilter === 'gear') {
      items = items.filter(i => 
        i.equipmentCategory === 'Adventuring Gear' || 
        i.equipmentCategory === 'Tool' ||
        i.equipmentCategory === 'Pack'
      );
    }
    
    if (shopSearch) {
      const search = shopSearch.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search)
      );
    }
    
    return items;
  }, [shopItems, shopFilter, shopSearch]);
  
  const remainingGold = useMemo(() => {
    if (startingGold === null) return 0;
    const spent = purchasedItems.reduce((acc, item) => {
      return acc + (item.cost ? parseCost(item.cost) : 0);
    }, 0);
    return startingGold - spent;
  }, [startingGold, purchasedItems]);
  
  useEffect(() => {
    if (equipmentMode === 'gold' && shopItems.length === 0) {
      getAllEquipment().then(items => {
        setShopItems(items);
      });
    }
  }, [equipmentMode, shopItems.length]);
  
  useEffect(() => {
    dispatch({
      type: 'REMOVE_ITEMS_BY_SOURCE',
      listName: 'equipment',
      source: 'Starting Equipment'
    });
    purchasedItems.forEach(item => {
      dispatch({
        type: 'ADD_ITEM_WITH_SOURCE',
        listName: 'equipment',
        item: { ...item, source: 'Starting Equipment' }
      });
    });
  }, [purchasedItems, dispatch]);
  
  const handleRollGold = useCallback(() => {
    if (classEquipment) {
      const rolled = rollStartingGold(classEquipment.startingGoldFormula);
      setStartingGold(rolled);
    }
  }, [classEquipment]);
  
  const parseCost = useCallback((costStr: string): number => {
    const match = costStr.match(/(\d+(?:\.\d+)?)\s*(GP|SP|CP|EP|PP)/i);
    if (!match) return 0;
    
    const amount = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    switch (unit) {
      case 'GP': return amount;
      case 'SP': return amount / 10;
      case 'EP': return amount / 2;
      case 'CP': return amount / 100;
      case 'PP': return amount * 10;
      default: return 0;
    }
  }, []);
  
  const handlePurchaseItem = useCallback((item: SrdEquipment) => {
    const cost = parseCost(item.cost);
    if (remainingGold >= cost) {
      const newItem: Equipment = {
        name: item.name,
        rarity: 'common',
        weight: parseFloat(item.weight) || 0,
        description: item.description,
        cost: item.cost,
        equippable: item.weaponCategory !== undefined || item.armorCategory !== undefined,
        equipped: false,
        source: 'Starting Gold'
      };
      
      if (item.weaponCategory) {
        newItem.weaponCategory = item.weaponCategory;
        newItem.damage = item.damage;
        newItem.properties = item.properties;
        newItem.mastery = item.mastery;
      }
      
      if (item.armorCategory) {
        newItem.armorCategory = item.armorCategory;
        newItem.armorClass = item.armorClass ? parseInt(item.armorClass, 10) : undefined;
      }
      
      setPurchasedItems(prev => [...prev, newItem]);
    }
  }, [remainingGold, parseCost]);
  
  const handleRemovePurchasedItem = useCallback((index: number) => {
    setPurchasedItems(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleEquipmentChoice = useCallback((choiceIndex: number, optionIndex: number) => {
    setEquipmentChoices(prev => ({
      ...prev,
      [choiceIndex]: optionIndex
    }));
  }, []);
  
  const handleEquipFixedItems = useCallback(() => {
    if (!classEquipment || shopItems.length === 0) return;
    
    const addEquipmentItem = (itemName: string) => {
      const matchingItem = shopItems.find(i => i.name === itemName);
      if (matchingItem) {
        const item: Equipment = {
          name: matchingItem.name,
          rarity: 'common',
          weight: parseFloat(matchingItem.weight) || 0,
          description: matchingItem.description,
          cost: matchingItem.cost,
          source: 'Starting Equipment'
        };
        
        if (matchingItem.weaponCategory) {
          item.weaponCategory = matchingItem.weaponCategory;
          item.damage = matchingItem.damage;
          item.properties = matchingItem.properties;
          item.mastery = matchingItem.mastery;
          item.equippable = true;
          item.equipped = false;
        }
        
        if (matchingItem.armorCategory) {
          item.armorCategory = matchingItem.armorCategory;
          item.armorClass = matchingItem.armorClass ? parseInt(matchingItem.armorClass, 10) : undefined;
          item.equippable = true;
          item.equipped = false;
        }
        
        if (matchingItem.equipmentCategory === 'Pack') {
          item.description = matchingItem.description;
        }
        
        dispatch({
          type: 'ADD_ITEM_WITH_SOURCE',
          listName: 'equipment',
          item
        });
      }
    };
    
    classEquipment.fixedEquipment.forEach(itemName => {
      addEquipmentItem(itemName);
    });
    
    classEquipment.choices.forEach((choice, choiceIdx) => {
      const selectedOptionIdx = equipmentChoices[choiceIdx];
      if (selectedOptionIdx !== undefined && choice.options[selectedOptionIdx]) {
        choice.options[selectedOptionIdx].items.forEach(itemName => {
          addEquipmentItem(itemName);
        });
      }
    });
  }, [classEquipment, shopItems, dispatch, equipmentChoices]);
  
  const handleAsiConfirm = useCallback(() => {
    if (!pendingClass) return;
    
    const level = pendingClass.level;
    
    if (asiMode === 'asi') {
      const bonuses: { ability: Ability; amount: number }[] = [];
      
      if (asiChoice1?.ability) {
        if (asiChoice1.type === '+2') {
          bonuses.push({ ability: asiChoice1.ability, amount: 2 });
        } else if (asiChoice1.type === '+1') {
          bonuses.push({ ability: asiChoice1.ability, amount: 1 });
          if (asiChoice2) {
            bonuses.push({ ability: asiChoice2, amount: 1 });
          }
        }
      }
      
      if (bonuses.length > 0) {
        dispatch({
          type: 'ADD_ASI_CHOICE',
          choice: { level, bonuses }
        });
        
        const newScores = { ...(state.draft.baseAbilityScores || state.draft.abilityScores || {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 10, charisma: 10
        }) };
        
        bonuses.forEach(b => {
          newScores[b.ability] = (newScores[b.ability] || 10) + b.amount;
        });
        
        dispatch({
          type: 'UPDATE_DRAFT',
          updates: { baseAbilityScores: newScores }
        });
      }
    } else if (asiMode === 'feat' && selectedFeat) {
      const feat: Feat = {
        name: selectedFeat.name,
        description: selectedFeat.description,
        statModifiers: { ...selectedFeat.statModifiers },
        prerequisites: selectedFeat.prerequisites,
        isHalfFeat: selectedFeat.isHalfFeat,
        isSRD: selectedFeat.isSRD
      };
      
      if (selectedFeat.isHalfFeat && halfFeatAbility) {
        feat.statModifiers[halfFeatAbility] = (feat.statModifiers[halfFeatAbility] || 0) + 1;
        
        dispatch({
          type: 'ADD_ASI_CHOICE',
          choice: { level, bonuses: [{ ability: halfFeatAbility, amount: 1 }] }
        });
        
        const newScores = { ...(state.draft.baseAbilityScores || state.draft.abilityScores || {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 10, charisma: 10
        }) };
        newScores[halfFeatAbility] = (newScores[halfFeatAbility] || 10) + 1;
        
        dispatch({
          type: 'UPDATE_DRAFT',
          updates: { baseAbilityScores: newScores }
        });
      }
      
      dispatch({
        type: 'ADD_ITEM_WITH_SOURCE',
        listName: 'feats',
        item: feat
      });
    }
  }, [pendingClass, asiMode, asiChoice1, asiChoice2, selectedFeat, halfFeatAbility, state.draft, dispatch]);
  
  const equipmentValid = useMemo(() => {
    if (!isLevel1) return true;
    
    if (equipmentMode === 'packages') {
      if (!classEquipment) return false;
      return classEquipment.choices.every((_, idx) => equipmentChoices[idx] !== undefined);
    } else {
      return purchasedItems.length > 0 || (startingGold !== null && startingGold > 0);
    }
  }, [isLevel1, equipmentMode, classEquipment, equipmentChoices, purchasedItems, startingGold]);
  
  const asiValid = useMemo(() => {
    if (!isAsiLevel) return true;
    
    if (asiMode === 'asi') {
      if (!asiChoice1?.ability) return false;
      
      if (asiChoice1.type === '+2') {
        return true;
      } else if (asiChoice1.type === '+1') {
        return asiChoice2 !== null && asiChoice2 !== asiChoice1.ability;
      }
      return false;
    } else {
      if (!selectedFeat) return false;
      if (selectedFeat.isHalfFeat && !halfFeatAbility) return false;
      return true;
    }
  }, [isAsiLevel, asiMode, asiChoice1, asiChoice2, selectedFeat, halfFeatAbility]);
  
  useEffect(() => {
    if (equipmentMode === 'packages' && equipmentValid && isLevel1) {
      handleEquipFixedItems();
    }
  }, [equipmentMode, equipmentValid, isLevel1, handleEquipFixedItems]);

  useEffect(() => {
    if (asiValid && isAsiLevel) {
      handleAsiConfirm();
    }
  }, [asiValid, isAsiLevel, handleAsiConfirm]);
  
  const isValid = equipmentValid && asiValid;
  
  const featOptions: ComboboxOption[] = allFeats.map(feat => ({
    value: feat.id?.toString() || feat.name,
    label: feat.name
  }));
  
  const currentConMod = useMemo(() => {
    const con = state.draft.baseAbilityScores?.constitution || state.draft.abilityScores?.constitution || 10;
    return getModifier(con);
  }, [state.draft]);
  
  if (!currentClassName && !pendingClass) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-500 py-8">
          Please select a class first to configure equipment and feats.
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {isLevel1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Starting Equipment</h2>
          
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg self-start">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                equipmentMode === 'packages' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setEquipmentMode('packages')}
            >
              Class Packages
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                equipmentMode === 'gold' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setEquipmentMode('gold')}
            >
              Starting Gold
            </button>
          </div>
          
          {equipmentMode === 'packages' && classEquipment && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              {classEquipment.choices.map((choice, choiceIdx) => (
                <div key={choiceIdx}>
                  <h3 className="font-semibold mb-3">{choice.label}</h3>
                  <div className="space-y-2">
                    {choice.options.map((option, optionIdx) => (
                      <label 
                        key={optionIdx}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          equipmentChoices[choiceIdx] === optionIdx
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`choice-${choiceIdx}`}
                          checked={equipmentChoices[choiceIdx] === optionIdx}
                          onChange={() => handleEquipmentChoice(choiceIdx, optionIdx)}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {classEquipment.fixedEquipment.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Fixed Equipment (from class and background)</h3>
                  <ul className="list-disc list-inside text-slate-600">
                    {classEquipment.fixedEquipment.map((itemName, idx) => (
                      <li key={idx}>{itemName}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {equipmentMode === 'gold' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Starting Gold Formula: {classEquipment?.startingGoldFormula || 'Unknown'}
                    </p>
                    {startingGold !== null && (
                      <p className="text-2xl font-bold text-green-600">
                        <DollarSign className="inline h-6 w-6 mr-1" />
                        {startingGold} GP
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleRollGold}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Roll Starting Gold
                  </button>
                </div>
                
                {startingGold !== null && (
                  <>
                    <div className="border-t pt-4">
                      <p className="font-semibold mb-2">Remaining Gold: {remainingGold.toFixed(2)} GP</p>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setShopFilter('all')}
                        className={`px-3 py-1 rounded text-sm ${
                          shopFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setShopFilter('weapon')}
                        className={`px-3 py-1 rounded text-sm ${
                          shopFilter === 'weapon' ? 'bg-slate-800 text-white' : 'bg-slate-100'
                        }`}
                      >
                        Weapons
                      </button>
                      <button
                        onClick={() => setShopFilter('armor')}
                        className={`px-3 py-1 rounded text-sm ${
                          shopFilter === 'armor' ? 'bg-slate-800 text-white' : 'bg-slate-100'
                        }`}
                      >
                        Armor
                      </button>
                      <button
                        onClick={() => setShopFilter('gear')}
                        className={`px-3 py-1 rounded text-sm ${
                          shopFilter === 'gear' ? 'bg-slate-800 text-white' : 'bg-slate-100'
                        }`}
                      >
                        Gear
                      </button>
                    </div>
                    
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search equipment..."
                        value={shopSearch}
                        onChange={(e) => setShopSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md"
                      />
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredShopItems.map((item) => {
                        const cost = parseCost(item.cost);
                        const canAfford = remainingGold >= cost;
                        return (
                          <div
                            key={item.name}
                            className={`flex items-center justify-between p-2 rounded ${
                              canAfford ? 'hover:bg-slate-50' : 'opacity-50'
                            }`}
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-500 ml-2">{item.cost}</span>
                              {item.damage && (
                                <span className="text-slate-400 ml-2">{item.damage}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handlePurchaseItem(item)}
                              disabled={!canAfford}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Buy
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              
              {purchasedItems.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Purchased Items</h3>
                  <ul className="space-y-1">
                    {purchasedItems.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <button
                          onClick={() => handleRemovePurchasedItem(idx)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {isAsiLevel && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Ability Score Improvement</h2>
          <p className="text-slate-500">
            Level {pendingClass?.level} - Choose to increase your ability scores or select a feat.
          </p>
          
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg self-start">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                asiMode === 'asi' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setAsiMode('asi')}
            >
              Ability Score Improvement
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                asiMode === 'feat' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setAsiMode('feat')}
            >
              Choose a Feat
            </button>
          </div>
          
          {asiMode === 'asi' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">First Increase</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Increase Type
                    </label>
                    <select
                      value={asiChoice1?.type || ''}
                      onChange={(e) => setAsiChoice1({ 
                        type: e.target.value as '+1' | '+2',
                        ability: asiChoice1?.ability
                      })}
                      className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    >
                      <option value="">Select...</option>
                      <option value="+2">+2 to one stat</option>
                      <option value="+1">+1 to two different stats</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ability
                    </label>
                    <select
                      value={asiChoice1?.ability || ''}
                      onChange={(e) => setAsiChoice1({ 
                        type: asiChoice1?.type || '+1',
                        ability: e.target.value as Ability
                      })}
                      className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    >
                      <option value="">Select...</option>
                      {ABILITIES.map(ability => {
                        const current = state.draft.baseAbilityScores?.[ability] || 10;
                        const newVal = asiChoice1?.type === '+2' ? current + 2 : asiChoice1?.type === '+1' ? current + 1 : current;
                        return (
                          <option key={ability} value={ability}>
                            {ABILITY_LABELS[ability]} ({current} → {newVal})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              
              {asiChoice1?.type === '+1' && (
                <div>
                  <h3 className="font-semibold mb-3">Second Increase (+1 to different stat)</h3>
                  <select
                    value={asiChoice2 || ''}
                    onChange={(e) => setAsiChoice2(e.target.value as Ability || null)}
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  >
                    <option value="">Select a different stat...</option>
                    {ABILITIES.filter(a => a !== asiChoice1?.ability).map(ability => {
                      const current = state.draft.baseAbilityScores?.[ability] || 10;
                      return (
                        <option key={ability} value={ability}>
                          {ABILITY_LABELS[ability]} ({current} → {current + 1})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Preview</h4>
                <p className="text-sm text-purple-700">
                  {asiChoice1?.type === '+2' && asiChoice1.ability && (
                    <>+2 to {ABILITY_LABELS[asiChoice1.ability]} (10 → {12})</>
                  )}
                  {asiChoice1?.type === '+1' && asiChoice1.ability && asiChoice2 && (
                    <>+1 to {ABILITY_LABELS[asiChoice1.ability]} and +1 to {ABILITY_LABELS[asiChoice2]}</>
                  )}
                  {!asiChoice1?.ability && <span className="text-slate-500">Make your selections above</span>}
                </p>
              </div>
            </div>
          )}
          
          {asiMode === 'feat' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select a Feat
                </label>
                <Combobox
                  options={featOptions}
                  value={selectedFeat?.id?.toString() || ''}
                  onChange={(value) => {
                    const feat = allFeats.find(f => f.id?.toString() === value);
                    setSelectedFeat(feat || null);
                    setHalfFeatAbility(null);
                  }}
                  placeholder="Search feats..."
                />
              </div>
              
              {selectedFeat && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedFeat.name}</h3>
                    {selectedFeat.prerequisites && (
                      <p className="text-sm text-slate-500">Prerequisites: {selectedFeat.prerequisites}</p>
                    )}
                  </div>
                  
                  <p className="text-slate-700">{selectedFeat.description}</p>
                  
                  {selectedFeat.isHalfFeat && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 mb-2">
                        This is a Half-Feat. Select which ability to increase by 1:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ABILITIES.map(ability => {
                          const current = state.draft.baseAbilityScores?.[ability] || 10;
                          return (
                            <button
                              key={ability}
                              onClick={() => setHalfFeatAbility(ability)}
                              className={`px-3 py-1 rounded text-sm ${
                                halfFeatAbility === ability
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {ABILITY_LABELS[ability]} ({current} → {current + 1})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 mb-2">Summary</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Equipment: {equipmentValid ? 'Complete' : 'Incomplete'}</span>
          </li>
          {isAsiLevel && (
            <li className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              <span>ASI/Feat: {asiValid ? 'Complete' : 'Incomplete'}</span>
            </li>
          )}
          {currentTotalLevel > 0 && (
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Max HP: {state.draft.maxHp || 0} (+{formatModifier(currentConMod)} from CON)</span>
            </li>
          )}
        </ul>
        {isValid ? (
          <p className="text-green-800 font-medium mt-2">Ready to proceed!</p>
        ) : (
          <p className="text-amber-700 font-medium mt-2">Please complete all selections.</p>
        )}
      </div>
    </div>
  );
}
