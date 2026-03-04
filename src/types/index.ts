export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type Skill =
  | 'athletics'
  | 'acrobatics'
  | 'sleightOfHand'
  | 'stealth'
  | 'arcana'
  | 'history'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'religion'
  | 'animalHandling'
  | 'insight'
  | 'perception'
  | 'survival'
  | 'deception'
  | 'intimidation'
  | 'performance'
  | 'persuasion';

export type ProficiencyLevel = 'none' | 'proficient' | 'expertise';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'veryRare' | 'legendary' | 'artifact';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SkillProficiency {
  skill: Skill;
  ability: Ability;
  level: ProficiencyLevel;
}

export interface Equipment {
  id?: number;
  name: string;
  rarity: Rarity;
  weight: number;
  description: string;
}

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface CharacterSpell {
  id?: number;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  prepared: boolean;
}

export interface Feat {
  id?: number;
  name: string;
  description: string;
  statModifiers: Partial<AbilityScores>;
}

export interface ClassEntry {
  className: string;
  subclass?: string;
  level: number;
}

export interface Character {
  id?: number;
  name: string;
  race: string;
  background: string;
  alignment: string;
  classes: ClassEntry[];
  abilityScores: AbilityScores;
  level: number;
  hp: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  ac: number;
  speed: number;
  proficiencyBonus: number;
  skills: SkillProficiency[];
  equipment: Equipment[];
  spellSlots: SpellSlot[];
  spells: CharacterSpell[];
  feats: Feat[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { DndSpell, SpellSchool } from './spells';
export type { SrdEquipment, EquipmentCategory, WeaponCategory, ArmorCategory, WeaponMastery } from './equipment';
