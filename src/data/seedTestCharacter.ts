import { db } from '../db/index';
import type { Character } from '../types';

const TEST_CHARACTER: Character = {
  id: 1,
  name: 'Thordak the Unyielding',
  race: 'Human',
  background: 'Soldier',
  alignment: 'Lawful Neutral',
  classes: [
    { className: 'Fighter', level: 4 },
    { className: 'Wizard', level: 2 },
    { className: 'Rogue', level: 1 },
    { className: 'Cleric', level: 1 },
    { className: 'Paladin', level: 1 },
  ],
  abilityScores: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 8,
    wisdom: 13,
    charisma: 10,
  },
  level: 9,
  xp: 56000,
  portrait: null,
  hp: 68,
  maxHp: 68,
  currentHp: 68,
  tempHp: 0,
  ac: 18,
  speed: 30,
  proficiencyBonus: 3,
  skills: [
    { skill: 'athletics', ability: 'strength', level: 'proficient' },
    { skill: 'acrobatics', ability: 'dexterity', level: 'proficient' },
    { skill: 'perception', ability: 'wisdom', level: 'expertise' },
    { skill: 'stealth', ability: 'dexterity', level: 'expertise' },
    { skill: 'investigation', ability: 'intelligence', level: 'proficient' },
    { skill: 'arcana', ability: 'intelligence', level: 'proficient' },
    { skill: 'intimidation', ability: 'charisma', level: 'proficient' },
    { skill: 'persuasion', ability: 'charisma', level: 'proficient' },
  ],
  equipment: [
    {
      name: 'Gauntlets of Ogre Power',
      rarity: 'uncommon',
      weight: 1,
      description: 'Your Strength score is 19 while you wear these gauntlets.',
      abilityOverride: { strength: 19 },
    },
    {
      name: 'Amulet of Health',
      rarity: 'rare',
      weight: 1,
      description: 'Your Constitution score is 19 while you wear this amulet.',
      abilityOverride: { constitution: 19 },
    },
    {
      name: 'Headband of Intellect',
      rarity: 'uncommon',
      weight: 1,
      description: 'Your Intelligence score is 19 while you wear this headband.',
      abilityOverride: { intelligence: 19 },
    },
    {
      name: 'Cloak of Elvenkind',
      rarity: 'uncommon',
      weight: 1,
      description: 'While you wear this cloak with its hood up, you have advantage on Stealth checks, and Perception checks made to see you have disadvantage.',
      skillModifiers: { stealth: 5 },
    },
    {
      name: 'Eyes of the Eagle',
      rarity: 'uncommon',
      weight: 0,
      description: 'These crystal lenses fit over the eyes. While wearing them, you have advantage on Perception checks that rely on sight.',
      skillModifiers: { perception: 5 },
    },
    {
      name: 'Gloves of Thievery',
      rarity: 'uncommon',
      weight: 0,
      description: 'These gloves are invisible while worn. While wearing them, you gain a +5 bonus to Sleight of Hand checks.',
      skillModifiers: { sleightOfHand: 5 },
    },
    {
      name: 'Stone of Good Luck',
      rarity: 'uncommon',
      weight: 0,
      description: 'While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.',
      skillModifiers: { 
        athletics: 1, acrobatics: 1, sleightOfHand: 1, stealth: 1,
        arcana: 1, history: 1, investigation: 1, nature: 1, religion: 1,
        animalHandling: 1, insight: 1, medicine: 1, perception: 1, survival: 1,
        deception: 1, intimidation: 1, performance: 1, persuasion: 1
      },
    },
    {
      name: 'Longsword',
      rarity: 'common',
      weight: 3,
      description: 'A standard longsword.',
    },
    {
      name: 'Chain Mail',
      rarity: 'common',
      weight: 55,
      description: 'Medium armor made of interlocking metal rings.',
      armorCategory: 'Medium',
      armorClass: 13,
    },
    {
      name: 'Shield',
      rarity: 'common',
      weight: 6,
      description: 'A wooden or metal shield.',
      armorCategory: 'Shield',
      armorClass: 2,
    },
  ],
  spellSlots: [],
  spells: [],
  feats: [
    {
      name: 'Resilient (Wisdom)',
      description: 'You gain proficiency in Wisdom saving throws. Your Wisdom score increases by 1.',
      statModifiers: { wisdom: 1 },
      savingThrowProficiencies: { wisdom: 'proficient' },
    },
    {
      name: 'Heavy Armor Master',
      description: 'Your Strength score increases by 1. Reduce nonmagical damage by 3.',
      statModifiers: { strength: 1 },
    },
    {
      name: 'Skill Expert (Stealth)',
      description: 'You gain proficiency in one skill of your choice, gain expertise in one skill in which you are proficient, and increase one ability score by 1.',
      statModifiers: {},
      skillModifiers: { stealth: 2 },
    },
    {
      name: 'Observant',
      description: 'If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips. You have a +5 bonus to passive Perception and passive Investigation.',
      statModifiers: { intelligence: 1 },
      skillModifiers: { perception: 2, investigation: 2 },
    },
    {
      name: 'Actor',
      description: 'You have an advantage on Deception and Performance checks when trying to pass yourself off as a different person.',
      statModifiers: { charisma: 1 },
      skillModifiers: { deception: 2, performance: 2 },
    },
  ],
  notes: 'Test character showcasing ability score overrides, skill proficiency/expertise, and complex tooltip breakdowns with multiple feat and equipment bonuses.',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function seedTestCharacter() {
  const count = await db.characters.count();
  if (count === 0) {
    await db.characters.add(TEST_CHARACTER);
    console.log('[seed] Test character added with id 1');
  }
}
