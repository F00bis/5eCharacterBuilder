import type { SrdEquipment } from '../types/equipment';

export const srdEquipment: SrdEquipment[] = [
  // ===== SIMPLE MELEE WEAPONS =====
  {
    name: 'Club',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '1 SP',
    weight: '2 lb.',
    damage: '1d4 Bludgeoning',
    properties: ['Light'],
    mastery: 'Slow',
    description: 'A simple bludgeoning weapon.',
    isSRD: true
  },
  {
    name: 'Dagger',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '2 GP',
    weight: '1 lb.',
    damage: '1d4 Piercing',
    properties: ['Finesse', 'Light', 'Thrown (Range 20/60)'],
    mastery: 'Nick',
    description: 'A simple piercing weapon with finesse and throwing capability.',
    isSRD: true
  },
  {
    name: 'Greatclub',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '2 SP',
    weight: '10 lb.',
    damage: '1d8 Bludgeoning',
    properties: ['Two-Handed'],
    mastery: 'Push',
    description: 'A large two-handed bludgeoning weapon.',
    isSRD: true
  },
  {
    name: 'Handaxe',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '5 GP',
    weight: '2 lb.',
    damage: '1d6 Slashing',
    properties: ['Light', 'Thrown (Range 20/60)'],
    mastery: 'Vex',
    description: 'A light axe that can be thrown.',
    isSRD: true
  },
  {
    name: 'Javelin',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '5 SP',
    weight: '2 lb.',
    damage: '1d6 Piercing',
    properties: ['Thrown (Range 30/120)'],
    mastery: 'Slow',
    description: 'A throwing spear designed for ranged attacks.',
    isSRD: true
  },
  {
    name: 'Light Hammer',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '2 GP',
    weight: '2 lb.',
    damage: '1d4 Bludgeoning',
    properties: ['Light', 'Thrown (Range 20/60)'],
    mastery: 'Nick',
    description: 'A light hammer that can be thrown.',
    isSRD: true
  },
  {
    name: 'Mace',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '5 GP',
    weight: '4 lb.',
    damage: '1d6 Bludgeoning',
    properties: [],
    mastery: 'Sap',
    description: 'A bludgeoning weapon with no special properties.',
    isSRD: true
  },
  {
    name: 'Quarterstaff',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '2 SP',
    weight: '4 lb.',
    damage: '1d6 Bludgeoning',
    properties: ['Versatile (1d8)'],
    mastery: 'Topple',
    description: 'A versatile staff that can be wielded with one or two hands.',
    isSRD: true
  },
  {
    name: 'Sickle',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '1 GP',
    weight: '2 lb.',
    damage: '1d4 Slashing',
    properties: ['Light'],
    mastery: 'Nick',
    description: 'A light slashing weapon.',
    isSRD: true
  },
  {
    name: 'Spear',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Melee',
    cost: '1 GP',
    weight: '3 lb.',
    damage: '1d6 Piercing',
    properties: ['Thrown (Range 20/60)', 'Versatile (1d8)'],
    mastery: 'Sap',
    description: 'A versatile piercing weapon that can be thrown.',
    isSRD: true
  },

  // ===== SIMPLE RANGED WEAPONS =====
  {
    name: 'Dart',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Ranged',
    cost: '5 CP',
    weight: '1/4 lb.',
    damage: '1d4 Piercing',
    properties: ['Finesse', 'Thrown (Range 20/60)'],
    mastery: 'Vex',
    description: 'A small thrown weapon with finesse.',
    isSRD: true
  },
  {
    name: 'Light Crossbow',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Ranged',
    cost: '25 GP',
    weight: '5 lb.',
    damage: '1d8 Piercing',
    properties: ['Ammunition (Range 80/320; Bolt)', 'Loading', 'Two-Handed'],
    mastery: 'Slow',
    description: 'A two-handed ranged weapon that fires bolts.',
    isSRD: true
  },
  {
    name: 'Shortbow',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Ranged',
    cost: '25 GP',
    weight: '2 lb.',
    damage: '1d6 Piercing',
    properties: ['Ammunition (Range 80/320; Arrow)', 'Two-Handed'],
    mastery: 'Vex',
    description: 'A two-handed ranged weapon that fires arrows.',
    isSRD: true
  },
  {
    name: 'Sling',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Simple Ranged',
    cost: '1 SP',
    weight: '—',
    damage: '1d4 Bludgeoning',
    properties: ['Ammunition (Range 30/120; Bullet)'],
    mastery: 'Slow',
    description: 'A ranged weapon that hurls bullets.',
    isSRD: true
  },

  // ===== MARTIAL MELEE WEAPONS =====
  {
    name: 'Battleaxe',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '10 GP',
    weight: '4 lb.',
    damage: '1d8 Slashing',
    properties: ['Versatile (1d10)'],
    mastery: 'Topple',
    description: 'A versatile slashing weapon that can be wielded with one or two hands.',
    isSRD: true
  },
  {
    name: 'Flail',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '10 GP',
    weight: '2 lb.',
    damage: '1d8 Bludgeoning',
    properties: [],
    mastery: 'Sap',
    description: 'A bludgeoning weapon with no special properties.',
    isSRD: true
  },
  {
    name: 'Glaive',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '20 GP',
    weight: '6 lb.',
    damage: '1d10 Slashing',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Graze',
    description: 'A heavy two-handed polearm with reach.',
    isSRD: true
  },
  {
    name: 'Greataxe',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '30 GP',
    weight: '7 lb.',
    damage: '1d12 Slashing',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Cleave',
    description: 'A heavy two-handed slashing weapon.',
    isSRD: true
  },
  {
    name: 'Greatsword',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '50 GP',
    weight: '6 lb.',
    damage: '2d6 Slashing',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Graze',
    description: 'A heavy two-handed sword dealing high damage.',
    isSRD: true
  },
  {
    name: 'Halberd',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '20 GP',
    weight: '6 lb.',
    damage: '1d10 Slashing',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Cleave',
    description: 'A heavy two-handed polearm with reach.',
    isSRD: true
  },
  {
    name: 'Lance',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '10 GP',
    weight: '6 lb.',
    damage: '1d10 Piercing',
    properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'],
    mastery: 'Topple',
    description: 'A heavy reach weapon that can be used one-handed while mounted.',
    isSRD: true
  },
  {
    name: 'Longsword',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '15 GP',
    weight: '3 lb.',
    damage: '1d8 Slashing',
    properties: ['Versatile (1d10)'],
    mastery: 'Sap',
    description: 'A versatile slashing weapon that can be wielded with one or two hands.',
    isSRD: true
  },
  {
    name: 'Maul',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '10 GP',
    weight: '10 lb.',
    damage: '2d6 Bludgeoning',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Topple',
    description: 'A heavy two-handed bludgeoning weapon dealing high damage.',
    isSRD: true
  },
  {
    name: 'Morningstar',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '15 GP',
    weight: '4 lb.',
    damage: '1d8 Piercing',
    properties: [],
    mastery: 'Sap',
    description: 'A piercing weapon with no special properties.',
    isSRD: true
  },
  {
    name: 'Pike',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '5 GP',
    weight: '18 lb.',
    damage: '1d10 Piercing',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Push',
    description: 'A heavy two-handed polearm with reach.',
    isSRD: true
  },
  {
    name: 'Rapier',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '25 GP',
    weight: '2 lb.',
    damage: '1d8 Piercing',
    properties: ['Finesse'],
    mastery: 'Vex',
    description: 'A finesse piercing weapon favored by duelists.',
    isSRD: true
  },
  {
    name: 'Scimitar',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '25 GP',
    weight: '3 lb.',
    damage: '1d6 Slashing',
    properties: ['Finesse', 'Light'],
    mastery: 'Nick',
    description: 'A light finesse slashing weapon.',
    isSRD: true
  },
  {
    name: 'Shortsword',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '10 GP',
    weight: '2 lb.',
    damage: '1d6 Piercing',
    properties: ['Finesse', 'Light'],
    mastery: 'Vex',
    description: 'A light finesse piercing weapon.',
    isSRD: true
  },
  {
    name: 'Trident',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '5 GP',
    weight: '4 lb.',
    damage: '1d8 Piercing',
    properties: ['Thrown (Range 20/60)', 'Versatile (1d10)'],
    mastery: 'Topple',
    description: 'A versatile piercing weapon that can be thrown.',
    isSRD: true
  },
  {
    name: 'Warhammer',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '15 GP',
    weight: '5 lb.',
    damage: '1d8 Bludgeoning',
    properties: ['Versatile (1d10)'],
    mastery: 'Push',
    description: 'A versatile bludgeoning weapon that can be wielded with one or two hands.',
    isSRD: true
  },
  {
    name: 'War Pick',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '5 GP',
    weight: '2 lb.',
    damage: '1d8 Piercing',
    properties: ['Versatile (1d10)'],
    mastery: 'Sap',
    description: 'A versatile piercing weapon.',
    isSRD: true
  },
  {
    name: 'Whip',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Melee',
    cost: '2 GP',
    weight: '3 lb.',
    damage: '1d4 Slashing',
    properties: ['Finesse', 'Reach'],
    mastery: 'Slow',
    description: 'A finesse weapon with reach.',
    isSRD: true
  },

  // ===== MARTIAL RANGED WEAPONS =====
  {
    name: 'Blowgun',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '10 GP',
    weight: '1 lb.',
    damage: '1 Piercing',
    properties: ['Ammunition (Range 25/100; Needle)', 'Loading'],
    mastery: 'Vex',
    description: 'A ranged weapon that fires needles.',
    isSRD: true
  },
  {
    name: 'Hand Crossbow',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '75 GP',
    weight: '3 lb.',
    damage: '1d6 Piercing',
    properties: ['Ammunition (Range 30/120; Bolt)', 'Light', 'Loading'],
    mastery: 'Vex',
    description: 'A light one-handed crossbow.',
    isSRD: true
  },
  {
    name: 'Heavy Crossbow',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '50 GP',
    weight: '18 lb.',
    damage: '1d10 Piercing',
    properties: ['Ammunition (Range 100/400; Bolt)', 'Heavy', 'Loading', 'Two-Handed'],
    mastery: 'Push',
    description: 'A heavy two-handed crossbow with long range.',
    isSRD: true
  },
  {
    name: 'Longbow',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '50 GP',
    weight: '2 lb.',
    damage: '1d8 Piercing',
    properties: ['Ammunition (Range 150/600; Arrow)', 'Heavy', 'Two-Handed'],
    mastery: 'Slow',
    description: 'A heavy two-handed bow with the longest range.',
    isSRD: true
  },
  {
    name: 'Musket',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '500 GP',
    weight: '10 lb.',
    damage: '1d12 Piercing',
    properties: ['Ammunition (Range 40/120; Bullet)', 'Loading', 'Two-Handed'],
    mastery: 'Slow',
    description: 'A two-handed firearm with high damage.',
    isSRD: true
  },
  {
    name: 'Pistol',
    equipmentCategory: 'Weapon',
    weaponCategory: 'Martial Ranged',
    cost: '250 GP',
    weight: '3 lb.',
    damage: '1d10 Piercing',
    properties: ['Ammunition (Range 30/90; Bullet)', 'Loading'],
    mastery: 'Vex',
    description: 'A one-handed firearm.',
    isSRD: true
  },

  // ===== LIGHT ARMOR =====
  {
    name: 'Padded Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Light',
    cost: '5 GP',
    weight: '8 lb.',
    armorClass: '11 + Dex modifier',
    stealthDisadvantage: true,
    description: 'Light armor. Takes 1 minute to don or doff. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },
  {
    name: 'Leather Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Light',
    cost: '10 GP',
    weight: '10 lb.',
    armorClass: '11 + Dex modifier',
    stealthDisadvantage: false,
    description: 'Light armor. Takes 1 minute to don or doff.',
    isSRD: true
  },
  {
    name: 'Studded Leather Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Light',
    cost: '45 GP',
    weight: '13 lb.',
    armorClass: '12 + Dex modifier',
    stealthDisadvantage: false,
    description: 'Light armor reinforced with studs. Takes 1 minute to don or doff.',
    isSRD: true
  },

  // ===== MEDIUM ARMOR =====
  {
    name: 'Hide Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Medium',
    cost: '10 GP',
    weight: '12 lb.',
    armorClass: '12 + Dex modifier (max 2)',
    stealthDisadvantage: false,
    description: 'Medium armor. Takes 5 minutes to don and 1 minute to doff.',
    isSRD: true
  },
  {
    name: 'Chain Shirt',
    equipmentCategory: 'Armor',
    armorCategory: 'Medium',
    cost: '50 GP',
    weight: '20 lb.',
    armorClass: '13 + Dex modifier (max 2)',
    stealthDisadvantage: false,
    description: 'Medium armor made of interlocking metal rings. Takes 5 minutes to don and 1 minute to doff.',
    isSRD: true
  },
  {
    name: 'Scale Mail',
    equipmentCategory: 'Armor',
    armorCategory: 'Medium',
    cost: '50 GP',
    weight: '45 lb.',
    armorClass: '14 + Dex modifier (max 2)',
    stealthDisadvantage: true,
    description: 'Medium armor. Takes 5 minutes to don and 1 minute to doff. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },
  {
    name: 'Breastplate',
    equipmentCategory: 'Armor',
    armorCategory: 'Medium',
    cost: '400 GP',
    weight: '20 lb.',
    armorClass: '14 + Dex modifier (max 2)',
    stealthDisadvantage: false,
    description: 'Medium armor covering the torso. Takes 5 minutes to don and 1 minute to doff.',
    isSRD: true
  },
  {
    name: 'Half Plate Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Medium',
    cost: '750 GP',
    weight: '40 lb.',
    armorClass: '15 + Dex modifier (max 2)',
    stealthDisadvantage: true,
    description: 'Medium armor. Takes 5 minutes to don and 1 minute to doff. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },

  // ===== HEAVY ARMOR =====
  {
    name: 'Ring Mail',
    equipmentCategory: 'Armor',
    armorCategory: 'Heavy',
    cost: '30 GP',
    weight: '40 lb.',
    armorClass: '14',
    stealthDisadvantage: true,
    description: 'Heavy armor. Takes 10 minutes to don and 5 minutes to doff. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },
  {
    name: 'Chain Mail',
    equipmentCategory: 'Armor',
    armorCategory: 'Heavy',
    cost: '75 GP',
    weight: '55 lb.',
    armorClass: '16',
    strengthRequirement: 'Str 13',
    stealthDisadvantage: true,
    description: 'Heavy armor. Takes 10 minutes to don and 5 minutes to doff. Requires Strength 13. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },
  {
    name: 'Splint Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Heavy',
    cost: '200 GP',
    weight: '60 lb.',
    armorClass: '17',
    strengthRequirement: 'Str 15',
    stealthDisadvantage: true,
    description: 'Heavy armor. Takes 10 minutes to don and 5 minutes to doff. Requires Strength 15. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },
  {
    name: 'Plate Armor',
    equipmentCategory: 'Armor',
    armorCategory: 'Heavy',
    cost: '1,500 GP',
    weight: '65 lb.',
    armorClass: '18',
    strengthRequirement: 'Str 15',
    stealthDisadvantage: true,
    description: 'Heavy armor providing the highest AC. Takes 10 minutes to don and 5 minutes to doff. Requires Strength 15. Imposes disadvantage on Stealth checks.',
    isSRD: true
  },

  // ===== SHIELD =====
  {
    name: 'Shield',
    equipmentCategory: 'Armor',
    armorCategory: 'Shield',
    cost: '10 GP',
    weight: '6 lb.',
    armorClass: '+2',
    stealthDisadvantage: false,
    description: 'A shield strapped to the arm. Use the Utilize action to don or doff. Provides +2 to AC.',
    isSRD: true
  },

  // ===== ARTISAN'S TOOLS =====
  {
    name: "Alchemist's Supplies",
    equipmentCategory: 'Tool',
    cost: '50 GP',
    weight: '8 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Identify a substance (DC 15), or start a fire (DC 15)',
    toolCraft: 'Acid, Alchemist\'s Fire, Component Pouch, Oil, Paper, Perfume',
    description: "Artisan's tools focused on alchemy. Ability: Intelligence.",
    isSRD: true
  },
  {
    name: "Brewer's Supplies",
    equipmentCategory: 'Tool',
    cost: '20 GP',
    weight: '9 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Detect poisoned drink (DC 15), or identify alcohol (DC 10)',
    toolCraft: 'Antitoxin',
    description: "Artisan's tools for brewing. Ability: Intelligence.",
    isSRD: true
  },
  {
    name: "Calligrapher's Supplies",
    equipmentCategory: 'Tool',
    cost: '10 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Write text with impressive flourishes that guard against forgery (DC 15)',
    toolCraft: 'Ink, Spell Scroll',
    description: "Artisan's tools for calligraphy. Ability: Dexterity.",
    isSRD: true
  },
  {
    name: "Carpenter's Tools",
    equipmentCategory: 'Tool',
    cost: '8 GP',
    weight: '6 lb.',
    toolAbility: 'Strength',
    toolUtilize: 'Seal or pry open a door or container (DC 20)',
    toolCraft: 'Club, Greatclub, Quarterstaff, Barrel, Chest, Ladder, Pole, Portable Ram, Torch',
    description: "Artisan's tools for carpentry. Ability: Strength.",
    isSRD: true
  },
  {
    name: "Cartographer's Tools",
    equipmentCategory: 'Tool',
    cost: '15 GP',
    weight: '6 lb.',
    toolAbility: 'Wisdom',
    toolUtilize: 'Draft a map of a small area (DC 15)',
    toolCraft: 'Map',
    description: "Artisan's tools for mapmaking. Ability: Wisdom.",
    isSRD: true
  },
  {
    name: "Cobbler's Tools",
    equipmentCategory: 'Tool',
    cost: '5 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: "Modify footwear to give Advantage on the wearer's next Dexterity (Acrobatics) check (DC 10)",
    toolCraft: "Climber's Kit",
    description: "Artisan's tools for cobbling. Ability: Dexterity.",
    isSRD: true
  },
  {
    name: "Cook's Utensils",
    equipmentCategory: 'Tool',
    cost: '1 GP',
    weight: '8 lb.',
    toolAbility: 'Wisdom',
    toolUtilize: "Improve food's flavor (DC 10), or detect spoiled or poisoned food (DC 15)",
    toolCraft: 'Rations',
    description: "Artisan's tools for cooking. Ability: Wisdom.",
    isSRD: true
  },
  {
    name: "Glassblower's Tools",
    equipmentCategory: 'Tool',
    cost: '30 GP',
    weight: '5 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Discern what a glass object held in the past 24 hours (DC 15)',
    toolCraft: 'Glass Bottle, Magnifying Glass, Spyglass, Vial',
    description: "Artisan's tools for glassblowing. Ability: Intelligence.",
    isSRD: true
  },
  {
    name: "Jeweler's Tools",
    equipmentCategory: 'Tool',
    cost: '25 GP',
    weight: '2 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: "Discern a gem's value (DC 15)",
    toolCraft: 'Arcane Focus, Holy Symbol',
    description: "Artisan's tools for jewelry making. Ability: Intelligence.",
    isSRD: true
  },
  {
    name: "Leatherworker's Tools",
    equipmentCategory: 'Tool',
    cost: '5 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Add a design to a leather item (DC 10)',
    toolCraft: 'Sling, Whip, Hide Armor, Leather Armor, Studded Leather Armor, Backpack, Crossbow Bolt Case, Map or Scroll Case, Parchment, Pouch, Quiver, Waterskin',
    description: "Artisan's tools for leatherworking. Ability: Dexterity.",
    isSRD: true
  },
  {
    name: "Mason's Tools",
    equipmentCategory: 'Tool',
    cost: '10 GP',
    weight: '8 lb.',
    toolAbility: 'Strength',
    toolUtilize: 'Chisel a symbol or hole in stone (DC 10)',
    toolCraft: 'Block and Tackle',
    description: "Artisan's tools for masonry. Ability: Strength.",
    isSRD: true
  },
  {
    name: "Painter's Supplies",
    equipmentCategory: 'Tool',
    cost: '10 GP',
    weight: '5 lb.',
    toolAbility: 'Wisdom',
    toolUtilize: "Paint a recognizable image of something you've seen (DC 10)",
    toolCraft: 'Druidic Focus, Holy Symbol',
    description: "Artisan's tools for painting. Ability: Wisdom.",
    isSRD: true
  },
  {
    name: "Potter's Tools",
    equipmentCategory: 'Tool',
    cost: '10 GP',
    weight: '3 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Discern what a ceramic object held in the past 24 hours (DC 15)',
    toolCraft: 'Jug, Lamp',
    description: "Artisan's tools for pottery. Ability: Intelligence.",
    isSRD: true
  },
  {
    name: "Smith's Tools",
    equipmentCategory: 'Tool',
    cost: '20 GP',
    weight: '8 lb.',
    toolAbility: 'Strength',
    toolUtilize: 'Pry open a door or container (DC 20)',
    toolCraft: 'Any Melee weapon (except Club, Greatclub, Quarterstaff, and Whip), Medium armor (except Hide), Heavy armor, Ball Bearings, Bucket, Caltrops, Chain, Crowbar, Firearm Bullets, Grappling Hook, Iron Pot, Iron Spikes, Sling Bullets',
    description: "Artisan's tools for smithing. Ability: Strength.",
    isSRD: true
  },
  {
    name: "Tinker's Tools",
    equipmentCategory: 'Tool',
    cost: '50 GP',
    weight: '10 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Assemble a Tiny item composed of scrap, which falls apart in 1 minute (DC 20)',
    toolCraft: 'Musket, Pistol, Bell, Bullseye Lantern, Flask, Hooded Lantern, Hunting Trap, Lock, Manacles, Mirror, Shovel, Signal Whistle, Tinderbox',
    description: "Artisan's tools for tinkering. Ability: Dexterity.",
    isSRD: true
  },
  {
    name: "Weaver's Tools",
    equipmentCategory: 'Tool',
    cost: '1 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Mend a tear in clothing (DC 10), or sew a Tiny design (DC 10)',
    toolCraft: 'Padded Armor, Basket, Bedroll, Blanket, Fine Clothes, Net, Robe, Rope, Sack, String, Tent, Traveler\'s Clothes',
    description: "Artisan's tools for weaving. Ability: Dexterity.",
    isSRD: true
  },
  {
    name: "Woodcarver's Tools",
    equipmentCategory: 'Tool',
    cost: '1 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Carve a pattern in wood (DC 10)',
    toolCraft: 'Club, Greatclub, Quarterstaff, Ranged weapons (except Pistol, Musket, and Sling), Arcane Focus, Arrows, Bolts, Druidic Focus, Ink Pen, Needles',
    description: "Artisan's tools for woodcarving. Ability: Dexterity.",
    isSRD: true
  },

  // ===== OTHER TOOLS =====
  {
    name: 'Disguise Kit',
    equipmentCategory: 'Tool',
    cost: '25 GP',
    weight: '3 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Apply makeup (DC 10)',
    toolCraft: 'Costume',
    description: 'A kit for creating disguises. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Forgery Kit',
    equipmentCategory: 'Tool',
    cost: '15 GP',
    weight: '5 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: "Mimic 10 or fewer words of someone else's handwriting (DC 15), or duplicate a wax seal (DC 20)",
    description: 'A kit for creating forgeries. Ability: Dexterity.',
    isSRD: true
  },
  {
    name: 'Herbalism Kit',
    equipmentCategory: 'Tool',
    cost: '5 GP',
    weight: '3 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Identify a plant (DC 10)',
    toolCraft: 'Antitoxin, Candle, Healer\'s Kit, Potion of Healing',
    description: 'A kit for herbalism. Ability: Intelligence.',
    isSRD: true
  },
  {
    name: "Navigator's Tools",
    equipmentCategory: 'Tool',
    cost: '25 GP',
    weight: '2 lb.',
    toolAbility: 'Wisdom',
    toolUtilize: 'Plot a course (DC 10), or determine position by stargazing (DC 15)',
    description: 'Tools for navigation. Ability: Wisdom.',
    isSRD: true
  },
  {
    name: "Poisoner's Kit",
    equipmentCategory: 'Tool',
    cost: '50 GP',
    weight: '2 lb.',
    toolAbility: 'Intelligence',
    toolUtilize: 'Detect a poisoned object (DC 10)',
    toolCraft: 'Basic Poison',
    description: 'A kit for working with poisons. Ability: Intelligence.',
    isSRD: true
  },
  {
    name: "Thieves' Tools",
    equipmentCategory: 'Tool',
    cost: '25 GP',
    weight: '1 lb.',
    toolAbility: 'Dexterity',
    toolUtilize: 'Pick a lock (DC 15), or disarm a trap (DC 15)',
    description: 'Tools for picking locks and disarming traps. Ability: Dexterity.',
    isSRD: true
  },

  // ===== GAMING SETS =====
  {
    name: 'Dice Set',
    equipmentCategory: 'Gaming Set',
    cost: '1 SP',
    weight: '—',
    toolAbility: 'Wisdom',
    toolUtilize: 'Discern whether someone is cheating (DC 10), or win the game (DC 20)',
    description: 'A gaming set. Ability: Wisdom.',
    isSRD: true
  },
  {
    name: 'Dragonchess Set',
    equipmentCategory: 'Gaming Set',
    cost: '1 GP',
    weight: '—',
    toolAbility: 'Wisdom',
    toolUtilize: 'Discern whether someone is cheating (DC 10), or win the game (DC 20)',
    description: 'A gaming set. Ability: Wisdom.',
    isSRD: true
  },
  {
    name: 'Playing Card Set',
    equipmentCategory: 'Gaming Set',
    cost: '5 SP',
    weight: '—',
    toolAbility: 'Wisdom',
    toolUtilize: 'Discern whether someone is cheating (DC 10), or win the game (DC 20)',
    description: 'A gaming set. Ability: Wisdom.',
    isSRD: true
  },
  {
    name: 'Three-Dragon Ante Set',
    equipmentCategory: 'Gaming Set',
    cost: '1 GP',
    weight: '—',
    toolAbility: 'Wisdom',
    toolUtilize: 'Discern whether someone is cheating (DC 10), or win the game (DC 20)',
    description: 'A gaming set. Ability: Wisdom.',
    isSRD: true
  },

  // ===== MUSICAL INSTRUMENTS =====
  {
    name: 'Bagpipes',
    equipmentCategory: 'Musical Instrument',
    cost: '30 GP',
    weight: '6 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Drum',
    equipmentCategory: 'Musical Instrument',
    cost: '6 GP',
    weight: '3 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Dulcimer',
    equipmentCategory: 'Musical Instrument',
    cost: '25 GP',
    weight: '10 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Flute',
    equipmentCategory: 'Musical Instrument',
    cost: '2 GP',
    weight: '1 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Horn',
    equipmentCategory: 'Musical Instrument',
    cost: '3 GP',
    weight: '2 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Lute',
    equipmentCategory: 'Musical Instrument',
    cost: '35 GP',
    weight: '2 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Lyre',
    equipmentCategory: 'Musical Instrument',
    cost: '30 GP',
    weight: '2 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Pan Flute',
    equipmentCategory: 'Musical Instrument',
    cost: '12 GP',
    weight: '2 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Shawm',
    equipmentCategory: 'Musical Instrument',
    cost: '2 GP',
    weight: '1 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },
  {
    name: 'Viol',
    equipmentCategory: 'Musical Instrument',
    cost: '30 GP',
    weight: '1 lb.',
    toolAbility: 'Charisma',
    toolUtilize: 'Play a known tune (DC 10), or improvise a song (DC 15)',
    description: 'A musical instrument. Ability: Charisma.',
    isSRD: true
  },

  // ===== ADVENTURING GEAR =====
  {
    name: 'Acid',
    equipmentCategory: 'Adventuring Gear',
    cost: '25 GP',
    weight: '1 lb.',
    description: 'When you take the Attack action, you can replace one of your attacks with throwing a vial of Acid. Target one creature or object you can see within 20 feet of yourself. The target must succeed on a Dexterity saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus) or take 2d6 Acid damage.',
    isSRD: true
  },
  {
    name: "Alchemist's Fire",
    equipmentCategory: 'Adventuring Gear',
    cost: '50 GP',
    weight: '1 lb.',
    description: 'When you take the Attack action, you can replace one of your attacks with throwing a flask of Alchemist\'s Fire. Target one creature or object you can see within 20 feet of yourself. The target must succeed on a Dexterity saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus) or take 1d4 Fire damage and start burning.',
    isSRD: true
  },
  {
    name: 'Antitoxin',
    equipmentCategory: 'Adventuring Gear',
    cost: '50 GP',
    weight: '—',
    description: 'As a Bonus Action, you can drink a vial of Antitoxin to gain Advantage on saving throws to avoid or end the Poisoned condition for 1 hour.',
    isSRD: true
  },
  {
    name: 'Backpack',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '5 lb.',
    description: 'A Backpack holds up to 30 pounds within 1 cubic foot. It can also serve as a saddlebag.',
    isSRD: true
  },
  {
    name: 'Ball Bearings',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '2 lb.',
    description: 'As a Utilize action, you can spill Ball Bearings from their pouch. They spread to cover a level, 10-foot-square area within 10 feet of yourself. A creature that enters this area for the first time on a turn must succeed on a DC 10 Dexterity saving throw or have the Prone condition. It takes 10 minutes to recover the Ball Bearings.',
    isSRD: true
  },
  {
    name: 'Barrel',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '70 lb.',
    description: 'A Barrel holds up to 40 gallons of liquid or up to 4 cubic feet of dry goods.',
    isSRD: true
  },
  {
    name: 'Basket',
    equipmentCategory: 'Adventuring Gear',
    cost: '4 SP',
    weight: '2 lb.',
    description: 'A Basket holds up to 40 pounds within 2 cubic feet.',
    isSRD: true
  },
  {
    name: 'Bedroll',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '7 lb.',
    description: 'A Bedroll sleeps one Small or Medium creature. While in a Bedroll, you automatically succeed on saving throws against extreme cold.',
    isSRD: true
  },
  {
    name: 'Bell',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '—',
    description: 'When rung as a Utilize action, a Bell produces a sound that can be heard up to 60 feet away.',
    isSRD: true
  },
  {
    name: 'Blanket',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 SP',
    weight: '3 lb.',
    description: 'While wrapped in a blanket, you have Advantage on saving throws against extreme cold.',
    isSRD: true
  },
  {
    name: 'Block and Tackle',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '5 lb.',
    description: 'A Block and Tackle allows you to hoist up to four times the weight you can normally lift.',
    isSRD: true
  },
  {
    name: 'Book',
    equipmentCategory: 'Adventuring Gear',
    cost: '25 GP',
    weight: '5 lb.',
    description: 'A Book contains fiction or nonfiction. If you consult an accurate nonfiction Book about its topic, you gain a +5 bonus to Intelligence (Arcana, History, Nature, or Religion) checks you make about that topic.',
    isSRD: true
  },
  {
    name: 'Bottle, Glass',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '2 lb.',
    description: 'A Glass Bottle holds up to 1 1/2 pints.',
    isSRD: true
  },
  {
    name: 'Bucket',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 CP',
    weight: '2 lb.',
    description: 'A Bucket holds up to half a cubic foot of contents.',
    isSRD: true
  },
  {
    name: 'Caltrops',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '2 lb.',
    description: 'As a Utilize action, you can spread Caltrops from their bag to cover a 5-foot-square area within 5 feet of yourself. A creature that enters this area for the first time on a turn must succeed on a DC 15 Dexterity saving throw or take 1 Piercing damage and have its Speed reduced to 0 until the start of its next turn. It takes 10 minutes to recover the Caltrops.',
    isSRD: true
  },
  {
    name: 'Candle',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 CP',
    weight: '—',
    description: 'For 1 hour, a lit Candle sheds Bright Light in a 5-foot radius and Dim Light for an additional 5 feet.',
    isSRD: true
  },
  {
    name: 'Case, Crossbow Bolt',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '1 lb.',
    description: 'A Crossbow Bolt Case holds up to 20 Bolts.',
    isSRD: true
  },
  {
    name: 'Case, Map or Scroll',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '1 lb.',
    description: 'A Map or Scroll Case holds up to 10 sheets of paper or 5 sheets of parchment.',
    isSRD: true
  },
  {
    name: 'Chain',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '10 lb.',
    description: "As a Utilize action, you can wrap a Chain around an unwilling creature within 5 feet of yourself that has the Grappled, Incapacitated, or Restrained condition if you succeed on a DC 13 Strength (Athletics) check. If the creature's legs are bound, the creature has the Restrained condition until it escapes. Escaping the Chain requires a successful DC 18 Dexterity (Acrobatics) check as an action. Bursting the Chain requires a successful DC 20 Strength (Athletics) check as an action.",
    isSRD: true
  },
  {
    name: 'Chest',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '25 lb.',
    description: 'A Chest holds up to 12 cubic feet of contents.',
    isSRD: true
  },
  {
    name: "Climber's Kit",
    equipmentCategory: 'Adventuring Gear',
    cost: '25 GP',
    weight: '12 lb.',
    description: "A Climber's Kit includes boot tips, gloves, pitons, and a harness. As a Utilize action, you can use the Climber's Kit to anchor yourself; when you do, you can't fall more than 25 feet from the anchor point, and you can't move more than 25 feet from there without undoing the anchor as a Bonus Action.",
    isSRD: true
  },
  {
    name: 'Clothes, Fine',
    equipmentCategory: 'Adventuring Gear',
    cost: '15 GP',
    weight: '6 lb.',
    description: 'Fine Clothes are made of expensive fabrics and adorned with expertly crafted details. Some events and locations admit only people wearing these clothes.',
    isSRD: true
  },
  {
    name: "Clothes, Traveler's",
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '4 lb.',
    description: "Traveler's Clothes are resilient garments designed for travel in various environments.",
    isSRD: true
  },
  {
    name: 'Component Pouch',
    equipmentCategory: 'Adventuring Gear',
    cost: '25 GP',
    weight: '2 lb.',
    description: 'A Component Pouch is watertight and filled with compartments that hold all the free Material components of your spells.',
    isSRD: true
  },
  {
    name: 'Costume',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '4 lb.',
    description: 'While wearing a Costume, you have Advantage on any ability check you make to impersonate the person or type of person it represents.',
    isSRD: true
  },
  {
    name: 'Crowbar',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '5 lb.',
    description: "Using a Crowbar gives you Advantage on Strength checks where the Crowbar's leverage can be applied.",
    isSRD: true
  },
  {
    name: 'Flask',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 CP',
    weight: '1 lb.',
    description: 'A Flask holds up to 1 pint.',
    isSRD: true
  },
  {
    name: 'Grappling Hook',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '4 lb.',
    description: 'As a Utilize action, you can throw the Grappling Hook at a railing, a ledge, or another catch within 50 feet of yourself, and the hook catches on if you succeed on a DC 13 Dexterity (Acrobatics) check. If you tied a Rope to the hook, you can then climb it.',
    isSRD: true
  },
  {
    name: "Healer's Kit",
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '3 lb.',
    description: "A Healer's Kit has ten uses. As a Utilize action, you can expend one of its uses to stabilize an Unconscious creature that has 0 Hit Points without needing to make a Wisdom (Medicine) check.",
    isSRD: true
  },
  {
    name: 'Holy Water',
    equipmentCategory: 'Adventuring Gear',
    cost: '25 GP',
    weight: '1 lb.',
    description: 'When you take the Attack action, you can replace one of your attacks with throwing a flask of Holy Water. Target one creature you can see within 20 feet of yourself. The target must succeed on a Dexterity saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus) or take 2d8 Radiant damage if it is a Fiend or an Undead.',
    isSRD: true
  },
  {
    name: 'Hunting Trap',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '25 lb.',
    description: "As a Utilize action, you can set a Hunting Trap, which is a sawtooth steel ring that snaps shut when a creature steps on a pressure plate in the center. The trap is affixed by a heavy chain to an immobile object. A creature that steps on the plate must succeed on a DC 13 Dexterity saving throw or take 1d4 Piercing damage and have its Speed reduced to 0 until the start of its next turn.",
    isSRD: true
  },
  {
    name: 'Ink',
    equipmentCategory: 'Adventuring Gear',
    cost: '10 GP',
    weight: '—',
    description: 'Ink comes in a 1-ounce bottle, which provides enough ink to write about 500 pages.',
    isSRD: true
  },
  {
    name: 'Ink Pen',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 CP',
    weight: '—',
    description: 'Using Ink, an Ink Pen is used to write or draw.',
    isSRD: true
  },
  {
    name: 'Jug',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 CP',
    weight: '4 lb.',
    description: 'A Jug holds up to 1 gallon.',
    isSRD: true
  },
  {
    name: 'Ladder',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 SP',
    weight: '25 lb.',
    description: 'A Ladder is 10 feet tall. You must climb to move up or down it.',
    isSRD: true
  },
  {
    name: 'Lamp',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 SP',
    weight: '1 lb.',
    description: 'A Lamp burns Oil as fuel to cast Bright Light in a 15-foot radius and Dim Light for an additional 30 feet.',
    isSRD: true
  },
  {
    name: 'Lantern, Bullseye',
    equipmentCategory: 'Adventuring Gear',
    cost: '10 GP',
    weight: '2 lb.',
    description: 'A Bullseye Lantern burns Oil as fuel to cast Bright Light in a 60-foot Cone and Dim Light for an additional 60 feet.',
    isSRD: true
  },
  {
    name: 'Lantern, Hooded',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '2 lb.',
    description: 'A Hooded Lantern burns Oil as fuel to cast Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. As a Bonus Action, you can lower the hood, reducing the light to Dim Light in a 5-foot radius, or raise it again.',
    isSRD: true
  },
  {
    name: 'Lock',
    equipmentCategory: 'Adventuring Gear',
    cost: '10 GP',
    weight: '1 lb.',
    description: "A Lock comes with a key. Without the key, a creature can use Thieves' Tools to pick this Lock with a successful DC 15 Dexterity (Sleight of Hand) check.",
    isSRD: true
  },
  {
    name: 'Magnifying Glass',
    equipmentCategory: 'Adventuring Gear',
    cost: '100 GP',
    weight: '—',
    description: 'A Magnifying Glass grants Advantage on any ability check made to appraise or inspect a highly detailed item. Lighting a fire with a Magnifying Glass requires light as bright as sunlight to focus, tinder to ignite, and about 5 minutes for the fire to ignite.',
    isSRD: true
  },
  {
    name: 'Manacles',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '6 lb.',
    description: 'As a Utilize action, you can use Manacles to bind an unwilling Small or Medium creature within 5 feet of yourself that has the Grappled, Incapacitated, or Restrained condition if you succeed on a DC 13 Dexterity (Sleight of Hand) check. Escaping the Manacles requires a successful DC 20 Dexterity (Sleight of Hand) check as an action. Bursting them requires a successful DC 25 Strength (Athletics) check as an action.',
    isSRD: true
  },
  {
    name: 'Map',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '—',
    description: 'If you consult an accurate Map, you gain a +5 bonus to Wisdom (Survival) checks you make to find your way in the place represented on it.',
    isSRD: true
  },
  {
    name: 'Mirror',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '1/2 lb.',
    description: 'A handheld steel Mirror is useful for personal cosmetics but also for peeking around corners and reflecting light as a signal.',
    isSRD: true
  },
  {
    name: 'Net',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '3 lb.',
    description: 'When you take the Attack action, you can replace one of your attacks with throwing a Net. Target a creature you can see within 15 feet of yourself. The target must succeed on a Dexterity saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus) or have the Restrained condition until it escapes. The target succeeds automatically if it is Huge or larger.',
    isSRD: true
  },
  {
    name: 'Oil',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 SP',
    weight: '1 lb.',
    description: 'You can douse a creature, object, or space with Oil or use it as fuel. When thrown at a creature within 20 feet, the target must succeed on a Dexterity saving throw or be covered in oil. If the target takes Fire damage before the oil dries (after 1 minute), the target takes an extra 5 Fire damage. Oil also serves as fuel for Lamps and Lanterns, burning for 6 hours.',
    isSRD: true
  },
  {
    name: 'Paper',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 SP',
    weight: '—',
    description: 'One sheet of Paper can hold about 250 handwritten words.',
    isSRD: true
  },
  {
    name: 'Parchment',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 SP',
    weight: '—',
    description: 'One sheet of Parchment can hold about 250 handwritten words.',
    isSRD: true
  },
  {
    name: 'Perfume',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 GP',
    weight: '—',
    description: 'Perfume comes in a 4-ounce vial. For 1 hour after applying Perfume to yourself, you have Advantage on Charisma (Persuasion) checks made to influence an Indifferent Humanoid within 5 feet of yourself.',
    isSRD: true
  },
  {
    name: 'Poison, Basic',
    equipmentCategory: 'Adventuring Gear',
    cost: '100 GP',
    weight: '—',
    description: 'As a Bonus Action, you can use a vial of Basic Poison to coat one weapon or up to three pieces of ammunition. A creature that takes Piercing or Slashing damage from the poisoned weapon or ammunition takes an extra 1d4 Poison damage. Once applied, the poison retains potency for 1 minute or until its damage is dealt, whichever comes first.',
    isSRD: true
  },
  {
    name: 'Pole',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 CP',
    weight: '7 lb.',
    description: 'A Pole is 10 feet long. You can use it to touch something up to 10 feet away. If you must make a Strength (Athletics) check as part of a High or Long Jump, you can use the Pole to vault, giving yourself Advantage on the check.',
    isSRD: true
  },
  {
    name: 'Pot, Iron',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '10 lb.',
    description: 'An Iron Pot holds up to 1 gallon.',
    isSRD: true
  },
  {
    name: 'Potion of Healing',
    equipmentCategory: 'Adventuring Gear',
    cost: '50 GP',
    weight: '1/2 lb.',
    description: 'This potion is a magic item. As a Bonus Action, you can drink it or administer it to another creature within 5 feet of yourself. The creature that drinks the magical red fluid in this vial regains 2d4 + 2 Hit Points.',
    isSRD: true
  },
  {
    name: 'Pouch',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 SP',
    weight: '1 lb.',
    description: 'A Pouch holds up to 6 pounds within one-fifth of a cubic foot.',
    isSRD: true
  },
  {
    name: 'Quiver',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '1 lb.',
    description: 'A Quiver holds up to 20 Arrows.',
    isSRD: true
  },
  {
    name: 'Ram, Portable',
    equipmentCategory: 'Adventuring Gear',
    cost: '4 GP',
    weight: '35 lb.',
    description: 'You can use a Portable Ram to break down doors. When doing so, you gain a +4 bonus to the Strength check. One other character can help you use the ram, giving you Advantage on this check.',
    isSRD: true
  },
  {
    name: 'Rations',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 SP',
    weight: '2 lb.',
    description: 'Rations consist of travel-ready food, including jerky, dried fruit, hardtack, and nuts.',
    isSRD: true
  },
  {
    name: 'Robe',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '4 lb.',
    description: 'A Robe has vocational or ceremonial significance. Some events and locations admit only people wearing a Robe bearing certain colors or symbols.',
    isSRD: true
  },
  {
    name: 'Rope',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '5 lb.',
    description: "As a Utilize action, you can tie a knot with Rope if you succeed on a DC 10 Dexterity (Sleight of Hand) check. The Rope can be burst with a successful DC 20 Strength (Athletics) check. You can bind an unwilling creature with the Rope only if the creature has the Grappled, Incapacitated, or Restrained condition.",
    isSRD: true
  },
  {
    name: 'Sack',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 CP',
    weight: '1/2 lb.',
    description: 'A Sack holds up to 30 pounds within 1 cubic foot.',
    isSRD: true
  },
  {
    name: 'Shovel',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '5 lb.',
    description: 'Working for 1 hour, you can use a Shovel to dig a hole that is 5 feet on each side in soil or similar material.',
    isSRD: true
  },
  {
    name: 'Signal Whistle',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 CP',
    weight: '—',
    description: 'When blown as a Utilize action, a Signal Whistle produces a sound that can be heard up to 600 feet away.',
    isSRD: true
  },
  {
    name: 'Spikes, Iron',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '5 lb.',
    description: 'Iron Spikes come in bundles of ten. As a Utilize action, you can use a blunt object to hammer a spike into wood, earth, or a similar material. You can do so to jam a door shut or to then tie a Rope or Chain to the Spike.',
    isSRD: true
  },
  {
    name: 'Spyglass',
    equipmentCategory: 'Adventuring Gear',
    cost: '1,000 GP',
    weight: '1 lb.',
    description: 'Objects viewed through a Spyglass are magnified to twice their size.',
    isSRD: true
  },
  {
    name: 'String',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 SP',
    weight: '—',
    description: 'String is 10 feet long. You can tie a knot in it as a Utilize action.',
    isSRD: true
  },
  {
    name: 'Tent',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 GP',
    weight: '20 lb.',
    description: 'A Tent sleeps up to two Small or Medium creatures.',
    isSRD: true
  },
  {
    name: 'Tinderbox',
    equipmentCategory: 'Adventuring Gear',
    cost: '5 SP',
    weight: '1 lb.',
    description: "A Tinderbox is a small container holding flint, fire steel, and tinder used to kindle a fire. Using it to light a Candle, Lamp, Lantern, or Torch takes a Bonus Action. Lighting any other fire takes 1 minute.",
    isSRD: true
  },
  {
    name: 'Torch',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 CP',
    weight: '1 lb.',
    description: 'A Torch burns for 1 hour, casting Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. When you take the Attack action, you can attack with the Torch, using it as a Simple Melee weapon. On a hit, the target takes 1 Fire damage.',
    isSRD: true
  },
  {
    name: 'Vial',
    equipmentCategory: 'Adventuring Gear',
    cost: '1 GP',
    weight: '—',
    description: 'A Vial holds up to 4 ounces.',
    isSRD: true
  },
  {
    name: 'Waterskin',
    equipmentCategory: 'Adventuring Gear',
    cost: '2 SP',
    weight: '5 lb. (full)',
    description: 'A Waterskin holds up to 4 pints. If you don\'t drink sufficient water, you risk dehydration.',
    isSRD: true
  },
  {
    name: 'Spell Scroll (Cantrip)',
    equipmentCategory: 'Adventuring Gear',
    cost: '30 GP',
    weight: '—',
    description: 'A magic item that bears the words of a cantrip determined by the scroll\'s creator. If the spell is on your class\'s spell list, you can read the scroll and cast the spell using its normal casting time and without providing any Material components. The spell save DC is 13, and the attack bonus is +5. The scroll disintegrates when the casting is completed.',
    isSRD: true
  },
  {
    name: 'Spell Scroll (Level 1)',
    equipmentCategory: 'Adventuring Gear',
    cost: '50 GP',
    weight: '—',
    description: 'A magic item that bears the words of a level 1 spell determined by the scroll\'s creator. If the spell is on your class\'s spell list, you can read the scroll and cast the spell using its normal casting time and without providing any Material components. The spell save DC is 13, and the attack bonus is +5. The scroll disintegrates when the casting is completed.',
    isSRD: true
  },

  // ===== AMMUNITION =====
  {
    name: 'Arrows',
    equipmentCategory: 'Ammunition',
    cost: '1 GP',
    weight: '1 lb.',
    description: 'A bundle of 20 arrows. Stored in a Quiver.',
    isSRD: true
  },
  {
    name: 'Bolts',
    equipmentCategory: 'Ammunition',
    cost: '1 GP',
    weight: '1 1/2 lb.',
    description: 'A bundle of 20 crossbow bolts. Stored in a Case.',
    isSRD: true
  },
  {
    name: 'Bullets, Firearm',
    equipmentCategory: 'Ammunition',
    cost: '3 GP',
    weight: '2 lb.',
    description: 'A bundle of 10 firearm bullets. Stored in a Pouch.',
    isSRD: true
  },
  {
    name: 'Bullets, Sling',
    equipmentCategory: 'Ammunition',
    cost: '4 CP',
    weight: '1 1/2 lb.',
    description: 'A bundle of 20 sling bullets. Stored in a Pouch.',
    isSRD: true
  },
  {
    name: 'Needles',
    equipmentCategory: 'Ammunition',
    cost: '1 GP',
    weight: '1 lb.',
    description: 'A bundle of 50 blowgun needles. Stored in a Pouch.',
    isSRD: true
  },

  // ===== ARCANE FOCUSES =====
  {
    name: 'Arcane Focus: Crystal',
    equipmentCategory: 'Arcane Focus',
    cost: '10 GP',
    weight: '1 lb.',
    description: 'An Arcane Focus bejeweled or carved to channel arcane magic. A Sorcerer, Warlock, or Wizard can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Arcane Focus: Orb',
    equipmentCategory: 'Arcane Focus',
    cost: '20 GP',
    weight: '3 lb.',
    description: 'An Arcane Focus bejeweled or carved to channel arcane magic. A Sorcerer, Warlock, or Wizard can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Arcane Focus: Rod',
    equipmentCategory: 'Arcane Focus',
    cost: '10 GP',
    weight: '2 lb.',
    description: 'An Arcane Focus bejeweled or carved to channel arcane magic. A Sorcerer, Warlock, or Wizard can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Arcane Focus: Staff',
    equipmentCategory: 'Arcane Focus',
    cost: '5 GP',
    weight: '4 lb.',
    description: 'An Arcane Focus staff (also functions as a Quarterstaff) carved to channel arcane magic. A Sorcerer, Warlock, or Wizard can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Arcane Focus: Wand',
    equipmentCategory: 'Arcane Focus',
    cost: '10 GP',
    weight: '1 lb.',
    description: 'An Arcane Focus bejeweled or carved to channel arcane magic. A Sorcerer, Warlock, or Wizard can use it as a Spellcasting Focus.',
    isSRD: true
  },

  // ===== DRUIDIC FOCUSES =====
  {
    name: 'Druidic Focus: Sprig of Mistletoe',
    equipmentCategory: 'Druidic Focus',
    cost: '1 GP',
    weight: '—',
    description: 'A Druidic Focus carved, tied with ribbon, or painted to channel primal magic. A Druid or Ranger can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Druidic Focus: Wooden Staff',
    equipmentCategory: 'Druidic Focus',
    cost: '5 GP',
    weight: '4 lb.',
    description: 'A Druidic Focus wooden staff (also functions as a Quarterstaff) to channel primal magic. A Druid or Ranger can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Druidic Focus: Yew Wand',
    equipmentCategory: 'Druidic Focus',
    cost: '10 GP',
    weight: '1 lb.',
    description: 'A Druidic Focus carved to channel primal magic. A Druid or Ranger can use it as a Spellcasting Focus.',
    isSRD: true
  },

  // ===== HOLY SYMBOLS =====
  {
    name: 'Holy Symbol: Amulet',
    equipmentCategory: 'Holy Symbol',
    cost: '5 GP',
    weight: '1 lb.',
    description: 'A Holy Symbol amulet (worn or held) bejeweled or painted to channel divine magic. A Cleric or Paladin can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Holy Symbol: Emblem',
    equipmentCategory: 'Holy Symbol',
    cost: '5 GP',
    weight: '—',
    description: 'A Holy Symbol emblem (borne on fabric or a Shield) bejeweled or painted to channel divine magic. A Cleric or Paladin can use it as a Spellcasting Focus.',
    isSRD: true
  },
  {
    name: 'Holy Symbol: Reliquary',
    equipmentCategory: 'Holy Symbol',
    cost: '5 GP',
    weight: '2 lb.',
    description: 'A Holy Symbol reliquary (held) bejeweled or painted to channel divine magic. A Cleric or Paladin can use it as a Spellcasting Focus.',
    isSRD: true
  },

  // ===== PACKS =====
  {
    name: "Burglar's Pack",
    equipmentCategory: 'Pack',
    cost: '16 GP',
    weight: '42 lb.',
    contents: 'Backpack, Ball Bearings, Bell, 10 Candles, Crowbar, Hooded Lantern, 7 flasks of Oil, 5 days of Rations, Rope, Tinderbox, and Waterskin',
    description: "A Burglar's Pack contains the following items: Backpack, Ball Bearings, Bell, 10 Candles, Crowbar, Hooded Lantern, 7 flasks of Oil, 5 days of Rations, Rope, Tinderbox, and Waterskin.",
    isSRD: true
  },
  {
    name: "Diplomat's Pack",
    equipmentCategory: 'Pack',
    cost: '39 GP',
    weight: '39 lb.',
    contents: 'Chest, Fine Clothes, Ink, 5 Ink Pens, Lamp, 2 Map or Scroll Cases, 4 flasks of Oil, 5 sheets of Paper, 5 sheets of Parchment, Perfume, and Tinderbox',
    description: "A Diplomat's Pack contains the following items: Chest, Fine Clothes, Ink, 5 Ink Pens, Lamp, 2 Map or Scroll Cases, 4 flasks of Oil, 5 sheets of Paper, 5 sheets of Parchment, Perfume, and Tinderbox.",
    isSRD: true
  },
  {
    name: "Dungeoneer's Pack",
    equipmentCategory: 'Pack',
    cost: '12 GP',
    weight: '55 lb.',
    contents: 'Backpack, Caltrops, Crowbar, 2 flasks of Oil, 10 days of Rations, Rope, Tinderbox, 10 Torches, and Waterskin',
    description: "A Dungeoneer's Pack contains the following items: Backpack, Caltrops, Crowbar, 2 flasks of Oil, 10 days of Rations, Rope, Tinderbox, 10 Torches, and Waterskin.",
    isSRD: true
  },
  {
    name: "Entertainer's Pack",
    equipmentCategory: 'Pack',
    cost: '40 GP',
    weight: '58 1/2 lb.',
    contents: 'Backpack, Bedroll, Bell, Bullseye Lantern, 3 Costumes, Mirror, 8 flasks of Oil, 9 days of Rations, Tinderbox, and Waterskin',
    description: "An Entertainer's Pack contains the following items: Backpack, Bedroll, Bell, Bullseye Lantern, 3 Costumes, Mirror, 8 flasks of Oil, 9 days of Rations, Tinderbox, and Waterskin.",
    isSRD: true
  },
  {
    name: "Explorer's Pack",
    equipmentCategory: 'Pack',
    cost: '10 GP',
    weight: '55 lb.',
    contents: 'Backpack, Bedroll, 2 flasks of Oil, 10 days of Rations, Rope, Tinderbox, 10 Torches, and Waterskin',
    description: "An Explorer's Pack contains the following items: Backpack, Bedroll, 2 flasks of Oil, 10 days of Rations, Rope, Tinderbox, 10 Torches, and Waterskin.",
    isSRD: true
  },
  {
    name: "Priest's Pack",
    equipmentCategory: 'Pack',
    cost: '33 GP',
    weight: '29 lb.',
    contents: 'Backpack, Blanket, Holy Water, Lamp, 7 days of Rations, Robe, and Tinderbox',
    description: "A Priest's Pack contains the following items: Backpack, Blanket, Holy Water, Lamp, 7 days of Rations, Robe, and Tinderbox.",
    isSRD: true
  },
  {
    name: "Scholar's Pack",
    equipmentCategory: 'Pack',
    cost: '40 GP',
    weight: '22 lb.',
    contents: 'Backpack, Book, Ink, Ink Pen, Lamp, 10 flasks of Oil, 10 sheets of Parchment, and Tinderbox',
    description: "A Scholar's Pack contains the following items: Backpack, Book, Ink, Ink Pen, Lamp, 10 flasks of Oil, 10 sheets of Parchment, and Tinderbox.",
    isSRD: true
  },

  // ===== MOUNTS =====
  {
    name: 'Camel',
    equipmentCategory: 'Mount',
    cost: '50 GP',
    weight: '—',
    carryingCapacity: '450 lb.',
    description: 'A mount with a carrying capacity of 450 lb.',
    isSRD: true
  },
  {
    name: 'Elephant',
    equipmentCategory: 'Mount',
    cost: '200 GP',
    weight: '—',
    carryingCapacity: '1,320 lb.',
    description: 'A mount with a carrying capacity of 1,320 lb.',
    isSRD: true
  },
  {
    name: 'Horse, Draft',
    equipmentCategory: 'Mount',
    cost: '50 GP',
    weight: '—',
    carryingCapacity: '540 lb.',
    description: 'A draft horse with a carrying capacity of 540 lb.',
    isSRD: true
  },
  {
    name: 'Horse, Riding',
    equipmentCategory: 'Mount',
    cost: '75 GP',
    weight: '—',
    carryingCapacity: '480 lb.',
    description: 'A riding horse with a carrying capacity of 480 lb.',
    isSRD: true
  },
  {
    name: 'Mastiff',
    equipmentCategory: 'Mount',
    cost: '25 GP',
    weight: '—',
    carryingCapacity: '195 lb.',
    description: 'A mastiff with a carrying capacity of 195 lb.',
    isSRD: true
  },
  {
    name: 'Mule',
    equipmentCategory: 'Mount',
    cost: '8 GP',
    weight: '—',
    carryingCapacity: '420 lb.',
    description: 'A mule with a carrying capacity of 420 lb.',
    isSRD: true
  },
  {
    name: 'Pony',
    equipmentCategory: 'Mount',
    cost: '30 GP',
    weight: '—',
    carryingCapacity: '225 lb.',
    description: 'A pony with a carrying capacity of 225 lb.',
    isSRD: true
  },
  {
    name: 'Warhorse',
    equipmentCategory: 'Mount',
    cost: '400 GP',
    weight: '—',
    carryingCapacity: '540 lb.',
    description: 'A warhorse with a carrying capacity of 540 lb.',
    isSRD: true
  },

  // ===== TACK, HARNESS, AND DRAWN VEHICLES =====
  {
    name: 'Carriage',
    equipmentCategory: 'Vehicle',
    cost: '100 GP',
    weight: '600 lb.',
    description: 'A drawn vehicle.',
    isSRD: true
  },
  {
    name: 'Cart',
    equipmentCategory: 'Vehicle',
    cost: '15 GP',
    weight: '200 lb.',
    description: 'A drawn vehicle.',
    isSRD: true
  },
  {
    name: 'Chariot',
    equipmentCategory: 'Vehicle',
    cost: '250 GP',
    weight: '100 lb.',
    description: 'A drawn vehicle.',
    isSRD: true
  },
  {
    name: 'Feed (per day)',
    equipmentCategory: 'Tack and Harness',
    cost: '5 CP',
    weight: '10 lb.',
    description: 'Feed for a mount for one day.',
    isSRD: true
  },
  {
    name: 'Saddle, Exotic',
    equipmentCategory: 'Tack and Harness',
    cost: '60 GP',
    weight: '40 lb.',
    description: 'An Exotic Saddle is required for riding an aquatic or a flying mount. Comes with a bit, a bridle, reins, and any other equipment needed.',
    isSRD: true
  },
  {
    name: 'Saddle, Military',
    equipmentCategory: 'Tack and Harness',
    cost: '20 GP',
    weight: '30 lb.',
    description: 'A Military Saddle gives Advantage on any ability check you make to remain mounted. Comes with a bit, a bridle, reins, and any other equipment needed.',
    isSRD: true
  },
  {
    name: 'Saddle, Riding',
    equipmentCategory: 'Tack and Harness',
    cost: '10 GP',
    weight: '25 lb.',
    description: 'A standard riding saddle. Comes with a bit, a bridle, reins, and any other equipment needed.',
    isSRD: true
  },
  {
    name: 'Sled',
    equipmentCategory: 'Vehicle',
    cost: '20 GP',
    weight: '300 lb.',
    description: 'A drawn vehicle for snow and ice.',
    isSRD: true
  },
  {
    name: 'Wagon',
    equipmentCategory: 'Vehicle',
    cost: '35 GP',
    weight: '400 lb.',
    description: 'A drawn vehicle.',
    isSRD: true
  },

  // ===== WATERBORNE AND AIRBORNE VEHICLES =====
  {
    name: 'Airship',
    equipmentCategory: 'Vehicle',
    cost: '40,000 GP',
    weight: '—',
    speed: '8 mph',
    crew: 10,
    passengers: 20,
    cargoTons: 1,
    ac: 13,
    hp: 300,
    description: 'An airborne vehicle. Speed: 8 mph. Crew: 10. Passengers: 20. Cargo: 1 ton. AC: 13. HP: 300.',
    isSRD: true
  },
  {
    name: 'Galley',
    equipmentCategory: 'Vehicle',
    cost: '30,000 GP',
    weight: '—',
    speed: '4 mph',
    crew: 80,
    passengers: 0,
    cargoTons: 150,
    ac: 15,
    hp: 500,
    damageThreshold: 20,
    description: 'A waterborne vessel. Speed: 4 mph. Crew: 80. Cargo: 150 tons. AC: 15. HP: 500. Damage Threshold: 20.',
    isSRD: true
  },
  {
    name: 'Keelboat',
    equipmentCategory: 'Vehicle',
    cost: '3,000 GP',
    weight: '—',
    speed: '1 mph',
    crew: 1,
    passengers: 6,
    cargoTons: 0.5,
    ac: 15,
    hp: 100,
    damageThreshold: 10,
    description: 'A waterborne vessel used on lakes and rivers. Speed: 1 mph. Crew: 1. Passengers: 6. Cargo: 1/2 ton. AC: 15. HP: 100. Damage Threshold: 10.',
    isSRD: true
  },
  {
    name: 'Longship',
    equipmentCategory: 'Vehicle',
    cost: '10,000 GP',
    weight: '—',
    speed: '3 mph',
    crew: 40,
    passengers: 150,
    cargoTons: 10,
    ac: 15,
    hp: 300,
    damageThreshold: 15,
    description: 'A waterborne vessel. Speed: 3 mph. Crew: 40. Passengers: 150. Cargo: 10 tons. AC: 15. HP: 300. Damage Threshold: 15.',
    isSRD: true
  },
  {
    name: 'Rowboat',
    equipmentCategory: 'Vehicle',
    cost: '50 GP',
    weight: '100 lb.',
    speed: '1 1/2 mph',
    crew: 1,
    passengers: 3,
    cargoTons: 0,
    ac: 11,
    hp: 50,
    description: 'A small waterborne vessel used on lakes and rivers. Speed: 1 1/2 mph. Crew: 1. Passengers: 3. AC: 11. HP: 50. Can be carried (weighs 100 lb.).',
    isSRD: true
  },
  {
    name: 'Sailing Ship',
    equipmentCategory: 'Vehicle',
    cost: '10,000 GP',
    weight: '—',
    speed: '2 mph',
    crew: 20,
    passengers: 20,
    cargoTons: 100,
    ac: 15,
    hp: 300,
    damageThreshold: 15,
    description: 'A waterborne vessel. Speed: 2 mph. Crew: 20. Passengers: 20. Cargo: 100 tons. AC: 15. HP: 300. Damage Threshold: 15.',
    isSRD: true
  },
  {
    name: 'Warship',
    equipmentCategory: 'Vehicle',
    cost: '25,000 GP',
    weight: '—',
    speed: '2 1/2 mph',
    crew: 60,
    passengers: 60,
    cargoTons: 200,
    ac: 15,
    hp: 500,
    damageThreshold: 20,
    description: 'A waterborne vessel built for combat. Speed: 2 1/2 mph. Crew: 60. Passengers: 60. Cargo: 200 tons. AC: 15. HP: 500. Damage Threshold: 20.',
    isSRD: true
  },
];
