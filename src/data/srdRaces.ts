import type { DndRace } from '../types/races';

export const srdRaces: DndRace[] = [
  {
    id: 'dwarf',
    name: 'Dwarf',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Medium',
    languages: ['Dwarvish'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Dwarven Resilience', description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs poison' },
    ],
    weaponProficiencies: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'],
  },
  {
    id: 'elf',
    name: 'Elf',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Elvish'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life in the twilight of the forest, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs charmed' },
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Small',
    languages: ['Halfling'],
    additionalLanguages: 0,
    features: [
      { name: 'Lucky', description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
      { name: 'Brave', description: 'You have advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is of a size larger than yours.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs frightened' },
    ],
  },
  {
    id: 'human',
    name: 'Human',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Common'],
    additionalLanguages: 1,
    features: [],
    savingThrowFeatures: [],
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Draconic', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Draconic Ancestry', description: 'You have a particular lineage with one type of dragon. Choose a dragon type from the table. Your breath weapon and damage resistance are determined by the dragon type you choose.' },
      { name: 'Breath Weapon', description: 'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of your exhalation.' },
      { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your draconic ancestry.' },
    ],
    savingThrowFeatures: [],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 25,
    size: 'Small',
    languages: ['Gnomish', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Gnome Cunning', description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs magic (INT/WIS/CHA)' },
    ],
  },
  {
    id: 'half-elf',
    name: 'Half-Elf',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Elvish', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Fey Ancestry', description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.' },
    ],
    savingThrowFeatures: [
      { type: 'advantage', description: 'vs charmed' },
    ],
  },
  {
    id: 'half-orc',
    name: 'Half-Orc',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Orc', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Savage Attacks', description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.' },
    ],
    savingThrowFeatures: [],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    abilityScoreIncreases: [
      { amount: 2 },
      { amount: 1 },
    ],
    speed: 30,
    size: 'Medium',
    languages: ['Infernal', 'Common'],
    additionalLanguages: 0,
    features: [
      { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' },
      { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
    ],
    savingThrowFeatures: [],
  },
];
