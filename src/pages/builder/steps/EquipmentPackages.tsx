import type { ComboboxOption } from '@/components/ui/combobox';
import { MultiSelectAutocomplete } from '@/components/ui/multi-select-autocomplete';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getClassByName } from '../../../db/classes';
import { getAllEquipment } from '../../../db/equipment';
import type { Equipment } from '../../../types';
import type { StartingEquipmentOption } from '../../../types/classes';
import type { SrdEquipment } from '../../../types/equipment';

interface EquipmentPackagesProps {
  currentClassName: string;
  isLevel1: boolean;
}

export default function EquipmentPackages({ currentClassName, isLevel1 }: EquipmentPackagesProps) {
  const { state, dispatch } = useCharacterBuilder();
  const [shopItems, setShopItems] = useState<SrdEquipment[]>([]);
  const [equipmentChoices, setEquipmentChoices] = useState<Record<number, number>>({});
  const [itemSelections, setItemSelections] = useState<Record<string, SrdEquipment[]>>({});
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

  const getOptionItems = useCallback((
    option: StartingEquipmentOption['options'][0],
    equipmentData: SrdEquipment[]
  ): SrdEquipment[] => {
    if (option.weaponClasses || option.weaponForms || option.weaponProperties) {
      return equipmentData.filter(eq => {
        if (eq.equipmentCategory !== 'Weapon') return false;
        
        if (option.weaponClasses?.length && eq.weaponClass) {
          if (!option.weaponClasses.includes(eq.weaponClass)) return false;
        }
        
        if (option.weaponForms?.length && eq.weaponForm) {
          if (!option.weaponForms.includes(eq.weaponForm)) return false;
        }
        
        if (option.weaponProperties?.length && eq.weaponProperties) {
          if (!option.weaponProperties.every(p => eq.weaponProperties!.includes(p))) return false;
        }
        
        return true;
      });
    }
    
    if (option.weaponCategories && option.weaponCategories.length > 0) {
      const categorySet = new Set(option.weaponCategories);
      return equipmentData.filter(e => e.equipmentCategory === 'Weapon' && e.weaponCategory && categorySet.has(e.weaponCategory));
    }
    
    if (option.armorCategories && option.armorCategories.length > 0) {
      const categorySet = new Set(option.armorCategories);
      return equipmentData.filter(e => e.equipmentCategory === 'Armor' && e.armorCategory && categorySet.has(e.armorCategory));
    }
    
    if (option.equipmentCategories && option.equipmentCategories.length > 0) {
      const categorySet = new Set(option.equipmentCategories);
      return equipmentData.filter(e => e.equipmentCategory && categorySet.has(e.equipmentCategory));
    }
    
    const itemNames = option.items || [];
    return equipmentData.filter(e => itemNames.includes(e.name));
  }, []);

  const handleEquipmentChoice = useCallback((choiceIdx: number, optionIdx: number) => {
    setEquipmentChoices(prev => ({
      ...prev,
      [choiceIdx]: optionIdx
    }));
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

  const addEquipmentItem = useCallback((item: SrdEquipment) => {
    if (item.equipmentCategory === 'Pack' && item.contents) {
      item.contents.forEach(content => {
        const contentItem = shopItems.find(i => i.name === content.name);
        if (contentItem) {
          const equipment: Equipment = {
            name: contentItem.name,
            rarity: 'common',
            weight: parseFloat(contentItem.weight) || 0,
            description: contentItem.description,
            cost: contentItem.cost,
            quantity: content.quantity || 1,
            source: 'Starting Equipment'
          };
          
          if (contentItem.weaponCategory) {
            equipment.weaponCategory = contentItem.weaponCategory;
            equipment.damage = contentItem.damage;
            equipment.properties = contentItem.properties;
            equipment.mastery = contentItem.mastery;
            equipment.equippable = true;
            equipment.equipped = false;
          }
          
          if (contentItem.armorCategory) {
            equipment.armorCategory = contentItem.armorCategory;
            equipment.armorClass = contentItem.armorClass ? parseInt(contentItem.armorClass, 10) : undefined;
            equipment.equippable = true;
            equipment.equipped = false;
          }
          
          dispatch({ type: 'ADD_ITEM_WITH_SOURCE', listName: 'equipment', item: equipment });
        }
      });
      return;
    }
    
    const equipment: Equipment = {
      name: item.name,
      rarity: 'common',
      weight: parseFloat(item.weight) || 0,
      description: item.description,
      cost: item.cost,
      source: 'Starting Equipment'
    };
    
    if (item.weaponCategory) {
      equipment.weaponCategory = item.weaponCategory;
      equipment.damage = item.damage;
      equipment.properties = item.properties;
      equipment.mastery = item.mastery;
      equipment.equippable = true;
      equipment.equipped = false;
    }
    
    if (item.armorCategory) {
      equipment.armorCategory = item.armorCategory;
      equipment.armorClass = item.armorClass ? parseInt(item.armorClass, 10) : undefined;
      equipment.equippable = true;
      equipment.equipped = false;
    }
    
    if (item.equipmentCategory === 'Pack') {
      equipment.description = item.description;
    }
    
    dispatch({ type: 'ADD_ITEM_WITH_SOURCE', listName: 'equipment', item: equipment });
  }, [shopItems, dispatch]);

  const handleEquipFixedItems = useCallback(() => {
    if (!classEquipment || shopItems.length === 0) return;
    
    dispatch({
      type: 'REMOVE_ITEMS_BY_SOURCE',
      listName: 'equipment',
      source: 'Starting Equipment'
    });
    
    classEquipment.fixedEquipment.forEach(itemName => {
      const matchingItem = shopItems.find(i => i.name === itemName);
      if (matchingItem) {
        addEquipmentItem(matchingItem);
      }
    });
    
    classEquipment.choices.forEach((choice, choiceIdx) => {
      const selectedOptionIdx = equipmentChoices[choiceIdx];
      if (selectedOptionIdx !== undefined && choice.options[selectedOptionIdx]) {
        const option = choice.options[selectedOptionIdx];
        const optionItems = getOptionItems(option, shopItems);
        
        if (option.type === 'bundle') {
          optionItems.forEach(item => addEquipmentItem(item));
        } else {
          const selectionKey = `${choiceIdx}-${selectedOptionIdx}`;
          const selectedItems = itemSelections[selectionKey] || [];
          selectedItems.forEach(item => addEquipmentItem(item));
        }
      }
    });
  }, [classEquipment, shopItems, dispatch, equipmentChoices, itemSelections, getOptionItems, addEquipmentItem]);

  useEffect(() => {
    if (!classEquipment || shopItems.length === 0 || !isLevel1) return;
    
    const draftEquipment = (state.draft.equipment || []).filter(
      e => e.source === 'Starting Equipment'
    );
    
    if (draftEquipment.length === 0) return;
    
    const newEquipmentChoices: Record<number, number> = {};
    const newItemSelections: Record<string, SrdEquipment[]> = {};
    
    classEquipment.choices.forEach((choice, choiceIdx) => {
      choice.options.forEach((option, optionIdx) => {
        const optionItems = getOptionItems(option, shopItems);
        const selectionKey = `${choiceIdx}-${optionIdx}`;
        
        const draftItemNames = draftEquipment.map(e => e.name);
        
        if (option.type === 'bundle') {
          const allBundleItemsPresent = optionItems.every(item => 
            draftItemNames.includes(item.name)
          );
          if (allBundleItemsPresent) {
            newEquipmentChoices[choiceIdx] = optionIdx;
          }
        } else {
          const matches = optionItems.filter(item => draftItemNames.includes(item.name));
          if (matches.length > 0) {
            newEquipmentChoices[choiceIdx] = optionIdx;
            newItemSelections[selectionKey] = matches;
          }
        }
      });
    });
    
    if (Object.keys(newEquipmentChoices).length > 0 && Object.keys(equipmentChoices).length === 0) {
      const timeoutId = window.setTimeout(() => {
        setEquipmentChoices(newEquipmentChoices);
        setItemSelections(newItemSelections);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [classEquipment, shopItems.length, isLevel1, state.draft.equipment, getOptionItems, equipmentChoices]);

  const isValid = useMemo(() => {
    if (!isLevel1) return true;
    if (!classEquipment || shopItems.length === 0) return false;
    
    return classEquipment.choices.every((choice, choiceIdx) => {
      const selectedOptionIdx = equipmentChoices[choiceIdx];
      if (selectedOptionIdx === undefined) return false;
      
      const option = choice.options[selectedOptionIdx];
      const requiredCount = option.count || 1;
      
      if (option.type === 'choice') {
        const selectionKey = `${choiceIdx}-${selectedOptionIdx}`;
        const selectedItems = itemSelections[selectionKey] || [];
        if (selectedItems.length < requiredCount) {
          return false;
        }
      }
      
      return true;
    });
  }, [isLevel1, classEquipment, shopItems, equipmentChoices, itemSelections]);

  useEffect(() => {
    if (isValid && isLevel1 && classEquipment && shopItems.length > 0) {
      handleEquipFixedItems();
    }
  }, [isValid, isLevel1, classEquipment, shopItems.length]);

  const getAvailableOptions = useCallback((optionItems: SrdEquipment[]): ComboboxOption[] => {
    return optionItems.map(item => {
      let label = item.name;
      if (item.weaponCategory && item.damage) {
        label = `${item.name} (${item.damage})`;
      } else if (item.cost) {
        label = `${item.name} (${item.cost})`;
      }
      return { value: item.name, label };
    });
  }, []);

  const handleAddItem = useCallback((choiceIdx: number, optionIdx: number) => {
    return (itemName: string) => {
      const selectionKey = `${choiceIdx}-${optionIdx}`;
      const option = classEquipment?.choices[choiceIdx].options[optionIdx];
      const optionItems = option ? getOptionItems(option, shopItems) : [];
      const item = optionItems.find(i => i.name === itemName);
      
      if (item) {
        setItemSelections(prev => {
          const current = prev[selectionKey] || [];
          if (current.some(i => i.name === itemName)) return prev;
          return { ...prev, [selectionKey]: [...current, item] };
        });
      }
    };
  }, [classEquipment, shopItems, getOptionItems]);

  const renderEquipmentBadge = useCallback((item: SrdEquipment) => {
    const onRemove = () => {
      const currentKey = Object.entries(itemSelections).find(([, items]) => 
        items.some(i => i.name === item.name)
      )?.[0];
      if (currentKey) {
        setItemSelections(prev => {
          const current = prev[currentKey] || [];
          return { ...prev, [currentKey]: current.filter(i => i.name !== item.name) };
        });
      }
    };
    
    return (
      <div className="cursor-pointer">
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-slate-100 text-slate-900 border-slate-300">
          {item.name}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10"
          >
            ×
          </button>
        </div>
      </div>
    );
  }, [itemSelections]);

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
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      {classEquipment.choices.map((choice, choiceIdx) => (
        <div key={choiceIdx}>
          <h3 className="font-semibold mb-3">{choice.label}</h3>
          <div className="space-y-2">
            {choice.options.map((option, optionIdx) => {
              const selectionKey = `${choiceIdx}-${optionIdx}`;
              const isSelected = equipmentChoices[choiceIdx] === optionIdx;
              const optionItems = getOptionItems(option, shopItems);
              const hasSelectableItems = optionItems.length > 0;
              const isBundle = option.type === 'bundle';
              const requiredCount = option.count || 1;
              const selectedItems = itemSelections[selectionKey] || [];
              const availableOptions = getAvailableOptions(optionItems);

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
                  
                  {isSelected && hasSelectableItems && !isBundle && (
                    <div className="ml-6 mt-2">
                      <label className="text-sm text-slate-600 mb-1 block">
                        Select {requiredCount} item{requiredCount > 1 ? 's' : ''}:
                      </label>
                      <MultiSelectAutocomplete
                        selectedItems={selectedItems}
                        availableOptions={availableOptions}
                        maxSelections={requiredCount}
                        onAdd={handleAddItem(choiceIdx, optionIdx)}
                        renderBadge={renderEquipmentBadge}
                        placeholder="Select an item..."
                        disabled={selectedItems.length >= requiredCount}
                      />
                    </div>
                  )}
                  
                  {isSelected && isBundle && (
                    <div className="ml-6 mt-2 text-sm text-slate-600">
                      <span className="font-medium">You will receive:</span>
                      <ul className="list-disc list-inside mt-1">
                        {optionItems.map((item, idx) => (
                          <li key={idx}>{item.name}</li>
                        ))}
                      </ul>
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
            {classEquipment.fixedEquipment.map((itemName, idx) => {
              const packItem = shopItems.find(i => i.name === itemName && i.equipmentCategory === 'Pack');
              if (packItem?.contents) {
                return (
                  <li key={idx}>
                    <span className="text-purple-700 underline decoration-dotted cursor-help">
                      {itemName}
                    </span>
                  </li>
                );
              }
              return <li key={idx}>{itemName}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}