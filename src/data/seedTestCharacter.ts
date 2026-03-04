import { db } from '../db/index';
import type { Character } from '../types';

const TEST_CHARACTER: Character = {
  id: 1,
  name: 'Thordak the Unyielding',
  race: 'Human',
  background: 'Soldier',
  alignment: 'Lawful Neutral',
  classes: [{ className: 'Fighter', level: 8 }],
  abilityScores: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 8,
    wisdom: 13,
    charisma: 10,
  },
  level: 8,
  hp: 68,
  maxHp: 68,
  currentHp: 68,
  tempHp: 0,
  ac: 18,
  speed: 30,
  proficiencyBonus: 3,
  skills: [],
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
      name: 'Cloak of Protection',
      rarity: 'uncommon',
      weight: 1,
      description: '+1 bonus to AC and saving throws.',
    },
    {
      name: 'Longsword',
      rarity: 'common',
      weight: 3,
      description: 'A standard longsword.',
    },
  ],
  spellSlots: [],
  spells: [],
  feats: [
    {
      name: 'Resilient (Wisdom)',
      description: 'You gain proficiency in Wisdom saving throws. Your Wisdom score increases by 1.',
      statModifiers: { wisdom: 1 },
    },
    {
      name: 'Heavy Armor Master',
      description: 'Your Strength score increases by 1. Reduce nonmagical damage by 3.',
      statModifiers: { strength: 1 },
    },
  ],
  notes: 'Test character for verifying ability score breakdown tooltips.',
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
