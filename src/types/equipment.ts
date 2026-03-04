export type EquipmentCategory =
  | 'Weapon'
  | 'Armor'
  | 'Tool'
  | 'Adventuring Gear'
  | 'Ammunition'
  | 'Arcane Focus'
  | 'Druidic Focus'
  | 'Holy Symbol'
  | 'Pack'
  | 'Mount'
  | 'Tack and Harness'
  | 'Vehicle'
  | 'Gaming Set'
  | 'Musical Instrument';

export type WeaponCategory = 'Simple Melee' | 'Simple Ranged' | 'Martial Melee' | 'Martial Ranged';

export type ArmorCategory = 'Light' | 'Medium' | 'Heavy' | 'Shield';

export type WeaponMastery = 'Cleave' | 'Graze' | 'Nick' | 'Push' | 'Sap' | 'Slow' | 'Topple' | 'Vex';

export interface SrdEquipment {
  name: string;
  equipmentCategory: EquipmentCategory;
  cost: string;
  weight: string;
  description: string;

  // Weapon-specific fields
  weaponCategory?: WeaponCategory;
  damage?: string;
  properties?: string[];
  mastery?: WeaponMastery;

  // Armor-specific fields
  armorCategory?: ArmorCategory;
  armorClass?: string;
  strengthRequirement?: string;
  stealthDisadvantage?: boolean;

  // Tool-specific fields
  toolAbility?: string;
  toolUtilize?: string;
  toolCraft?: string;

  // Mount-specific fields
  carryingCapacity?: string;

  // Vehicle-specific fields
  speed?: string;
  crew?: number;
  passengers?: number;
  cargoTons?: number;
  ac?: number;
  hp?: number;
  damageThreshold?: number;

  // Pack contents
  contents?: string;

  // Marks this as SRD base data
  isSRD: boolean;
}
