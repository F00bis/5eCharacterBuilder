import { describe, it, expect } from 'vitest';
import type { Equipment } from '../types';
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
} from './inventory';
import type { Currency } from '../types';

function createEquipment(overrides: Partial<Equipment> = {}): Equipment {
  return {
    name: 'Test Item',
    rarity: 'common',
    weight: 1,
    description: 'A test item',
    ...overrides,
  };
}

describe('isEquippable', () => {
  it('returns true when equippable is explicitly true', () => {
    const item = createEquipment({ equippable: true });
    expect(isEquippable(item)).toBe(true);
  });

  it('returns false when equippable is undefined', () => {
    const item = createEquipment({ equippable: undefined });
    expect(isEquippable(item)).toBe(false);
  });

  it('returns false when equippable is false', () => {
    const item = createEquipment({ equippable: false });
    expect(isEquippable(item)).toBe(false);
  });
});

describe('getTotalWeight', () => {
  it('returns 0 for empty equipment list', () => {
    expect(getTotalWeight([])).toBe(0);
  });

  it('sums weights of all items', () => {
    const equipment = [
      createEquipment({ weight: 5 }),
      createEquipment({ weight: 3 }),
      createEquipment({ weight: 2 }),
    ];
    expect(getTotalWeight(equipment)).toBe(10);
  });

  it('handles items with zero or undefined weight', () => {
    const equipment = [
      createEquipment({ weight: 5 }),
      createEquipment({ weight: 0 }),
      createEquipment({ weight: undefined }),
    ];
    expect(getTotalWeight(equipment)).toBe(5);
  });
});

describe('getCarryingCapacity', () => {
  it('returns STR * 15', () => {
    expect(getCarryingCapacity(10)).toBe(150);
    expect(getCarryingCapacity(15)).toBe(225);
    expect(getCarryingCapacity(20)).toBe(300);
  });
});

describe('getEncumbranceStatus', () => {
  it('returns ratio and isOverloaded false when under capacity', () => {
    const result = getEncumbranceStatus(50, 150);
    expect(result.ratio).toBeCloseTo(0.333, 2);
    expect(result.isOverloaded).toBe(false);
  });

  it('returns isOverloaded true when over capacity', () => {
    const result = getEncumbranceStatus(200, 150);
    expect(result.ratio).toBeCloseTo(1.333, 2);
    expect(result.isOverloaded).toBe(true);
  });

  it('handles edge case of zero capacity', () => {
    const result = getEncumbranceStatus(50, 0);
    expect(result.ratio).toBe(Infinity);
    expect(result.isOverloaded).toBe(true);
  });
});

describe('getAttunedCount', () => {
  it('returns 0 when no items are attuned', () => {
    const equipment = [
      createEquipment({ attuned: false }),
      createEquipment({ attuned: undefined }),
    ];
    expect(getAttunedCount(equipment)).toBe(0);
  });

  it('counts only items with attuned true', () => {
    const equipment = [
      createEquipment({ attuned: true }),
      createEquipment({ attuned: false }),
      createEquipment({ attuned: true }),
      createEquipment({ attuned: undefined }),
    ];
    expect(getAttunedCount(equipment)).toBe(2);
  });
});

describe('getEquippedItems', () => {
  it('returns only equipped items', () => {
    const equipment = [
      createEquipment({ equipped: true }),
      createEquipment({ equipped: false }),
      createEquipment({ equipped: true }),
    ];
    const equipped = getEquippedItems(equipment);
    expect(equipped).toHaveLength(2);
  });

  it('returns empty array when no items equipped', () => {
    const equipment = [
      createEquipment({ equipped: false }),
      createEquipment({ equipped: undefined }),
    ];
    expect(getEquippedItems(equipment)).toHaveLength(0);
  });
});

describe('getNonEquippedItems', () => {
  it('returns unequipped items', () => {
    const equipment = [
      createEquipment({ equipped: true }),
      createEquipment({ equipped: false }),
      createEquipment({ equipped: undefined }),
    ];
    const nonEquipped = getNonEquippedItems(equipment);
    expect(nonEquipped).toHaveLength(2);
  });
});

describe('getRarityColor', () => {
  it('returns correct colors for each rarity', () => {
    expect(getRarityColor('common')).toBe('bg-slate-400');
    expect(getRarityColor('uncommon')).toBe('bg-green-500');
    expect(getRarityColor('rare')).toBe('bg-blue-500');
    expect(getRarityColor('veryRare')).toBe('bg-purple-500');
    expect(getRarityColor('legendary')).toBe('bg-orange-500');
    expect(getRarityColor('artifact')).toBe('bg-red-600');
  });
});

describe('formatCurrencyTotal', () => {
  it('calculates correct GP equivalent', () => {
    const currency: Currency = { cp: 100, sp: 10, ep: 2, gp: 5, pp: 1 };
    // 100/100 + 10/10 + 2/2 + 5 + 10 = 1 + 1 + 1 + 5 + 10 = 18
    expect(formatCurrencyTotal(currency)).toBe('~18 GP');
  });

  it('handles zero currency', () => {
    const currency: Currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
    expect(formatCurrencyTotal(currency)).toBe('~0 GP');
  });

  it('handles large platinum amounts', () => {
    const currency: Currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 10 };
    expect(formatCurrencyTotal(currency)).toBe('~100 GP');
  });
});
