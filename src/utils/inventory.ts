import type { Currency, Equipment, Rarity } from '../types';

export function isEquippable(item: Equipment): boolean {
  return item.equippable === true;
}

export function getTotalWeight(equipment: Equipment[]): number {
  return equipment.reduce((sum, item) => sum + (item.weight || 0), 0);
}

export function getCarryingCapacity(strengthScore: number): number {
  return strengthScore * 15;
}

export function getEncumbranceStatus(totalWeight: number, capacity: number): {
  ratio: number;
  isOverloaded: boolean;
} {
  const ratio = capacity > 0 ? totalWeight / capacity : Infinity;
  const isOverloaded = ratio > 1;
  return { ratio, isOverloaded };
}

export function getAttunedCount(equipment: Equipment[]): number {
  return equipment.filter(item => item.attuned === true).length;
}

export function getEquippedItems(equipment: Equipment[]): Equipment[] {
  return equipment.filter(item => item.equipped === true);
}

export function getNonEquippedItems(equipment: Equipment[]): Equipment[] {
  return equipment.filter(item => item.equipped !== true);
}

export function getRarityColor(rarity: Rarity): string {
  const colorMap: Record<Rarity, string> = {
    common: 'bg-slate-400',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    veryRare: 'bg-purple-500',
    legendary: 'bg-orange-500',
    artifact: 'bg-red-600',
  };
  return colorMap[rarity] || 'bg-slate-400';
}

export function formatCurrencyTotal(currency: Currency): string {
  const gpEquivalent = 
    currency.cp / 100 + 
    currency.sp / 10 + 
    currency.ep / 2 + 
    currency.gp + 
    currency.pp * 10;
  return `~${gpEquivalent.toFixed(0)} GP`;
}
