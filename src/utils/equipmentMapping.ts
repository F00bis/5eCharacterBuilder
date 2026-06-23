import type { Equipment } from '../types';
import type { SrdEquipment } from '../types/equipment';

interface CreateEquipmentOptions {
  source: string;
  quantity?: number;
}

export function createEquipmentFromSrd(
  item: SrdEquipment,
  options: CreateEquipmentOptions
): Equipment {
  const equipment: Equipment = {
    name: item.name,
    rarity: 'common',
    weight: parseFloat(item.weight) || 0,
    description: item.description,
    cost: item.cost,
    quantity: options.quantity ?? item.quantity ?? 1,
    source: options.source,
  };

  if (item.weaponCategory || item.weaponClass || item.weaponForm) {
    equipment.weaponCategory = item.weaponCategory;
    equipment.weaponClass = item.weaponClass;
    equipment.weaponForm = item.weaponForm;
    equipment.weaponProperties = item.weaponProperties;
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

  return equipment;
}
