import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getAllEquipment } from '../../../db/equipment';
import { getClassByName } from '../../../db/classes';
import { Combobox } from '@/components/ui/combobox';
import type { Equipment } from '../../../types';
import type { SrdEquipment } from '../../../types/equipment';
import { TooltipProvider } from '@/components/ui/tooltip';

interface EquipmentPackagesProps {
  currentClassName: string;
  isLevel1: boolean;
}

interface SelectableItem {
  name: string;
  isPack: boolean;
}

export default function EquipmentPackages({ currentClassName, isLevel1 }: EquipmentPackagesProps) {
  const { state, dispatch } = useCharacterBuilder();
  const [shopItems, setShopItems] = useState<SrdEquipment[]>([]);
  const [equipmentChoices, setEquipmentChoices] = useState<Record<number, number>>({});
  const [itemSelections, setItemSelections] = useState<Record<string, string>>({});
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
    getAllEquipment().then(items => {
      setShopItems(items);
    });
  }, []);

  const getSelectableItems = useCallback((items: string[], equipmentData: SrdEquipment[]): SelectableItem[] => {
    const result: SelectableItem[] = [];
    items.forEach(itemName => {
      const exactMatch = equipmentData.find(e => e.name === itemName);
      if (exactMatch && exactMatch.equipmentCategory === 'Pack') {
        return; 
      }
      result.push({ name: itemName, isPack: false });
    });
    return result;
  }, []);

  const handleEquipmentChoice = useCallback((choiceIdx: number, optionIdx: number) => {
    setEquipmentChoices(prev => ({
      ...prev,
      [choiceIdx]: optionIdx
    }));
    // Clear item selection when changing choice
    setItemSelections(prev => {
      const newSelections = { ...prev };
      Object.keys(newSelections).forEach(key => {
        if (key.startsWith(`${choiceIdx}-`)) {
          delete newSelections[key];
        }
      });
      return newSelections;
    });
  }, []);

  const handleEquipFixedItems = useCallback(() => {
    if (!classEquipment || shopItems.length === 0) return;
    
    // Clear existing starting equipment before adding new items
    dispatch({
      type: 'REMOVE_ITEMS_BY_SOURCE',
      listName: 'equipment',
      source: 'Starting Equipment'
    });
    
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
        const selectionKey = `${choiceIdx}-${selectedOptionIdx}`;
        const option = choice.options[selectedOptionIdx];
        
        const selectableItems = getSelectableItems(option.items, shopItems);
        const selectedItem = itemSelections[selectionKey];
        
        if (selectedItem) {
          addEquipmentItem(selectedItem);
        } else if (selectableItems.length > 0) {
          selectableItems.forEach(item => {
            addEquipmentItem(item.name);
          });
        }
      }
    });
  }, [classEquipment, shopItems, dispatch, equipmentChoices, itemSelections, getSelectableItems]);

  // Initialize state from draft when navigating back to this step
  useEffect(() => {
    if (!classEquipment || shopItems.length === 0 || !isLevel1) return;
    
    const draftEquipment = (state.draft.equipment || []).filter(
      e => e.source === 'Starting Equipment'
    );
    
    if (draftEquipment.length === 0) return;
    
    const newEquipmentChoices: Record<number, number> = {};
    const newItemSelections: Record<string, string> = {};
    
    classEquipment.choices.forEach((choice, choiceIdx) => {
      choice.options.forEach((option, optionIdx) => {
        const selectableItems = getSelectableItems(option.items, shopItems);
        const selectionKey = `${choiceIdx}-${optionIdx}`;
        
        const draftItemNames = draftEquipment.map(e => e.name);
        const optionItemNames = selectableItems.map(i => i.name);
        
        const matches = optionItemNames.filter(name => draftItemNames.includes(name));
        if (matches.length > 0) {
          newEquipmentChoices[choiceIdx] = optionIdx;
          if (selectableItems.length > 1) {
            newItemSelections[selectionKey] = matches[0];
          }
        }
      });
    });
    
    if (Object.keys(newEquipmentChoices).length > 0) {
      setEquipmentChoices(prev => {
        if (Object.keys(prev).length > 0) return prev;
        return newEquipmentChoices;
      });
      setItemSelections(prev => {
        if (Object.keys(prev).length > 0) return prev;
        return newItemSelections;
      });
    }
  }, [classEquipment, shopItems.length, isLevel1, state.draft.equipment, getSelectableItems]);

  // Add equipment to draft when all selections are complete
  const isValid = useMemo(() => {
    if (!isLevel1) return true;
    if (!classEquipment || shopItems.length === 0) return false;
    
    return classEquipment.choices.every((choice, choiceIdx) => {
      const selectedOptionIdx = equipmentChoices[choiceIdx];
      if (selectedOptionIdx === undefined) return false;
      
      const option = choice.options[selectedOptionIdx];
      const selectableItems = getSelectableItems(option.items, shopItems);
      
      if (selectableItems.length > 0 && !itemSelections[`${choiceIdx}-${selectedOptionIdx}`]) {
        return false;
      }
      
      return true;
    });
  }, [isLevel1, classEquipment, shopItems.length, equipmentChoices, itemSelections, getSelectableItems]);

  useEffect(() => {
    if (isValid && isLevel1 && classEquipment && shopItems.length > 0) {
      handleEquipFixedItems();
    }
  }, [isValid, isLevel1, classEquipment, shopItems.length]);

  if (!currentClassName || !classEquipment) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-500 py-8">
          Please select a class first to configure equipment.
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        {classEquipment.choices.map((choice, choiceIdx) => (
          <div key={choiceIdx}>
            <h3 className="font-semibold mb-3">{choice.label}</h3>
            <div className="space-y-2">
              {choice.options.map((option, optionIdx) => {
                const selectionKey = `${choiceIdx}-${optionIdx}`;
                const isSelected = equipmentChoices[choiceIdx] === optionIdx;
                const selectableItems = getSelectableItems(option.items, shopItems);
                const hasSelectableItems = selectableItems.length > 0;

                return (
                  <div key={optionIdx}>
                    <label 
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`choice-${choiceIdx}`}
                        checked={isSelected}
                        onChange={() => handleEquipmentChoice(choiceIdx, optionIdx)}
                        className="mr-3"
                      />
                      <span>{option.label}</span>
                    </label>
                    
                    {isSelected && hasSelectableItems && (
                      <div className="ml-6 mt-2">
                        <label className="text-sm text-slate-600 mb-1 block">
                          Select Item:
                        </label>
                        <Combobox
                          options={selectableItems.map(item => {
                            const dbItem = shopItems.find(i => i.name === item.name);
                            let label = item.name;
                            if (dbItem?.weaponCategory && dbItem?.damage) {
                              label = `${item.name} (${dbItem.damage})`;
                            } else if (dbItem?.cost) {
                              label = `${item.name} (${dbItem.cost})`;
                            }
                            return { value: item.name, label };
                          })}
                          value={itemSelections[selectionKey] || ''}
                          onChange={(value) => setItemSelections(prev => ({
                            ...prev,
                            [selectionKey]: value
                          }))}
                          placeholder="Select an item..."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
    </TooltipProvider>
  );
}
