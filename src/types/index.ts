export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

import type { WeaponCategory, WeaponMastery } from './equipment';
import type { FeatureAction } from './classes';
import type { DndSpell } from './spells';

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

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export type StatusEffectCategory = 'harmful' | 'neutral' | 'beneficial';

export type StatusEffect = {
  id: string;
  name: string;
  category: StatusEffectCategory;
  description: string;
  isCustom: boolean;
  isStacking: boolean;
};

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
  source?: string;
}

export interface Equipment {
  id?: number;
  name: string;
  rarity: Rarity;
  weight: number;
  description: string;
  cost?: string;
  attunement?: boolean;
  attuned?: boolean;
  equippable?: boolean;
  statModifiers?: Partial<AbilityScores>;
  abilityOverride?: Partial<AbilityScores>;
  skillModifiers?: Partial<Record<Skill, number>>;
  savingThrowModifiers?: Partial<Record<Ability, number>>;
  armorCategory?: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  armorClass?: number;
  equipped?: boolean;
  weaponCategory?: WeaponCategory;
  damage?: string;
  properties?: string[];
  mastery?: WeaponMastery;
  source?: string;
}

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface CharacterSpell extends DndSpell {
  id?: number;
  prepared: boolean;
  source?: string;
}

export interface Feat {
  id?: number;
  name: string;
  description: string;
  statModifiers: Partial<AbilityScores>;
  skillModifiers?: Partial<Record<Skill, number>>;
  savingThrowProficiencies?: Partial<Record<Ability, ProficiencyLevel>>;
  actions?: FeatureAction[];
}

export interface ClassEntry {
  className: string;
  subclass?: string;
  level: number;
}

export interface RaceStatSelection {
  ability: Ability;
  amount: number;
}

export interface Character {
  id?: number;
  name: string;
  race: string;
  subrace?: string;
  background: string;
  alignment: string;
  classes: ClassEntry[];
  raceStatSelections: RaceStatSelection[];
  baseAbilityScores: AbilityScores;
  abilityScores: AbilityScores;
  featureChoices: Record<string, string | string[]>;
  hpRolls: number[];
  level: number;
  xp: number;
  portrait: string | null;
  hpBonus: number;
  hp: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  ac: number;
  speed: number;
  initiative: number;
  vision: {
    darkvision?: number;
    truesight?: number;
    blindsight?: number;
  };
  deathSaves: {
    successes: number;
    failures: number;
  };
  proficiencyBonus: number;
  skills: SkillProficiency[];
  equipment: Equipment[];
  currency: Currency;
  spellSlots: SpellSlot[];
  spells: CharacterSpell[];
  feats: Feat[];
  statusEffects: StatusEffect[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { DndSpell, SpellSchool } from './spells';
export type { SrdEquipment, EquipmentCategory, WeaponCategory, ArmorCategory, WeaponMastery } from './equipment';
export type { ResourceDefinition, FeatureAction, ActionType } from './classes';
