import { db } from './index';
import type { SrdEquipment, EquipmentCategory, WeaponCategory, ArmorCategory } from '../types/equipment';

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
