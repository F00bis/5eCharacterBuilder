import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { getAllEquipment } from '../../../db/equipment';
import type { Equipment } from '../../../types';
import type { SrdEquipment } from '../../../types/equipment';
import type { StartingEquipment } from '../../../types/classes';
import { DollarSign, Sword, Shield, Package, Search } from 'lucide-react';

interface EquipmentShopProps {
  classEquipment?: StartingEquipment | null;
  isLevel1: boolean;
}

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

export default function EquipmentShop({ classEquipment, isLevel1 }: EquipmentShopProps) {
  const { dispatch } = useCharacterBuilder();
  const [shopItems, setShopItems] = useState<SrdEquipment[]>([]);
  const [startingGold, setStartingGold] = useState<number | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Equipment[]>([]);
  const [shopSearch, setShopSearch] = useState('');
  const [shopFilter, setShopFilter] = useState<'all' | 'weapon' | 'armor' | 'gear'>('all');

  useEffect(() => {
    getAllEquipment().then(items => {
      setShopItems(items);
    });
  }, []);

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

  const remainingGold = useMemo(() => {
    if (startingGold === null) return 0;
    const spent = purchasedItems.reduce((acc, item) => {
      return acc + (item.cost ? parseCost(item.cost) : 0);
    }, 0);
    return startingGold - spent;
  }, [startingGold, purchasedItems, parseCost]);

  const handleRollGold = useCallback(() => {
    if (classEquipment?.startingGoldFormula) {
      const rolled = rollStartingGold(classEquipment.startingGoldFormula);
      setStartingGold(rolled);
    }
  }, [classEquipment?.startingGoldFormula]);

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
        source: 'Gold Purchase'
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

  // Sync purchased items to draft
  useEffect(() => {
    if (!isLevel1) return;
    
    dispatch({
      type: 'REMOVE_ITEMS_BY_SOURCE',
      listName: 'equipment',
      source: 'Gold Purchase'
    });
    purchasedItems.forEach(item => {
      dispatch({
        type: 'ADD_ITEM_WITH_SOURCE',
        listName: 'equipment',
        item: { ...item }
      });
    });
  }, [purchasedItems, dispatch, isLevel1]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">Starting Gold</p>
            <p className="text-2xl font-bold flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              {startingGold !== null ? startingGold : 0} GP
            </p>
          </div>
          <button
            onClick={handleRollGold}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
          >
            Roll Gold
          </button>
        </div>
        
        {startingGold !== null && (
          <p className="text-sm text-slate-600">
            Remaining: <span className="font-semibold">{remainingGold} GP</span>
          </p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <select
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value as typeof shopFilter)}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="weapon">Weapons</option>
            <option value="armor">Armor</option>
            <option value="gear">Gear</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredShopItems.map((item) => {
            const cost = parseCost(item.cost);
            const canAfford = remainingGold >= cost;
            
            return (
              <div
                key={item.name}
                className={`p-3 rounded-lg border ${
                  canAfford 
                    ? 'border-slate-200 hover:border-purple-500 cursor-pointer bg-white' 
                    : 'border-slate-100 bg-slate-50 opacity-50'
                }`}
                onClick={() => canAfford && handlePurchaseItem(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {item.weaponCategory && <Sword className="w-4 h-4" />}
                    {item.armorCategory && <Shield className="w-4 h-4" />}
                    {!item.weaponCategory && !item.armorCategory && <Package className="w-4 h-4" />}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.cost}</span>
                </div>
                {item.damage && (
                  <p className="text-xs text-slate-500 mt-1">{item.damage}</p>
                )}
                {item.armorClass && (
                  <p className="text-xs text-slate-500 mt-1">AC {item.armorClass}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {purchasedItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Purchased Items</h3>
          <div className="space-y-2">
            {purchasedItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{item.cost}</span>
                  <button
                    onClick={() => handleRemovePurchasedItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
