import { db } from './index';
import type { SrdEquipment, EquipmentCategory, WeaponCategory, ArmorCategory, WeaponClass, WeaponForm, WeaponProperty } from '../types/equipment';

export async function getAllEquipment(): Promise<SrdEquipment[]> {
  return db.equipment.toArray();
}

export async function getEquipmentByName(name: string): Promise<SrdEquipment | undefined> {
  return db.equipment.get(name);
}

export async function getEquipmentByCategory(category: EquipmentCategory): Promise<SrdEquipment[]> {
  return db.equipment.where('equipmentCategory').equals(category).toArray();
}

export async function getWeapons(): Promise<SrdEquipment[]> {
  return db.equipment.where('equipmentCategory').equals('Weapon').toArray();
}

export async function getWeaponsByCategory(category: WeaponCategory): Promise<SrdEquipment[]> {
  return db.equipment.where('weaponCategory').equals(category).toArray();
}

export async function getWeaponsByClass(weaponClass: WeaponClass): Promise<SrdEquipment[]> {
  return db.equipment.where('weaponClass').equals(weaponClass).toArray();
}

export async function getWeaponsByForm(weaponForm: WeaponForm): Promise<SrdEquipment[]> {
  return db.equipment.where('weaponForm').equals(weaponForm).toArray();
}

export async function getWeaponsByProperties(properties: WeaponProperty[], matchAll: boolean = true): Promise<SrdEquipment[]> {
  const weapons = await db.equipment.where('equipmentCategory').equals('Weapon').toArray();
  
  if (matchAll) {
    return weapons.filter(w => 
      properties.every(p => w.weaponProperties?.includes(p))
    );
  } else {
    return weapons.filter(w => 
      properties.some(p => w.weaponProperties?.includes(p))
    );
  }
}

export async function getWeaponsByTags(tags: {
  weaponClasses?: WeaponClass[];
  weaponForms?: WeaponForm[];
  weaponProperties?: WeaponProperty[];
}): Promise<SrdEquipment[]> {
  let results = await db.equipment.where('equipmentCategory').equals('Weapon').toArray();
  
  if (tags.weaponClasses?.length) {
    const classSet = new Set(tags.weaponClasses);
    results = results.filter(w => w.weaponClass && classSet.has(w.weaponClass));
  }
  
  if (tags.weaponForms?.length) {
    const formSet = new Set(tags.weaponForms);
    results = results.filter(w => w.weaponForm && formSet.has(w.weaponForm));
  }
  
  if (tags.weaponProperties?.length) {
    results = results.filter(w => 
      tags.weaponProperties!.every(p => w.weaponProperties?.includes(p))
    );
  }
  
  return results;
}

export async function getArmor(): Promise<SrdEquipment[]> {
  return db.equipment.where('equipmentCategory').equals('Armor').toArray();
}

export async function getArmorByCategory(category: ArmorCategory): Promise<SrdEquipment[]> {
  return db.equipment.where('armorCategory').equals(category).toArray();
}

export async function getTools(): Promise<SrdEquipment[]> {
  return db.equipment.where('equipmentCategory').equals('Tool').toArray();
}

export async function getAdventuringGear(): Promise<SrdEquipment[]> {
  return db.equipment.where('equipmentCategory').equals('Adventuring Gear').toArray();
}

export async function getEquipmentNames(): Promise<string[]> {
  return db.equipment.toCollection().primaryKeys();
}
