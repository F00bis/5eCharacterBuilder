export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

import type { FeatureAction } from './classes';
import type { WeaponCategory, WeaponMastery, WeaponClass, WeaponForm, WeaponProperty } from './equipment';
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
  quantity?: number;
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
  // Legacy weapon category (backward compatibility)
  weaponCategory?: WeaponCategory;
  // New weapon tagging system
  weaponClass?: WeaponClass;
  weaponForm?: WeaponForm;
  weaponProperties?: WeaponProperty[];
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
  resolvedChoices?: Record<string, string | string[]>;
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

export interface ToolProficiency {
  tool: string;
  source: string;
}

export interface PersistedFeatChoice {
  source: string;
  type: 'feat' | 'asi';
  featName?: string;
  asiBonuses?: { ability: Ability; amount: number }[];
  featSelections?: Record<string, string | string[]>;
}

export type ExpertiseChoiceStore = Record<string, Skill[]>;
export type MetamagicChoiceStore = Record<string, string[]>;
export type InvocationChoiceStore = Record<string, string[]>;
export type MysticArcanumChoiceStore = Record<string, string>;

export interface CharacterBase {
  name: string;
  race: string;
  subrace?: string;
  background: string;
  alignment: string;
  classes: ClassEntry[];
  subclass?: string;
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
  languages: string[];
  toolProficiencies: ToolProficiency[];
  raceChoices: Record<string, string | string[]>;
  backgroundChoices: Record<string, string | string[]>;
  featChoices?: PersistedFeatChoice[];
  expertiseChoices?: ExpertiseChoiceStore;
  metamagicChoices?: MetamagicChoiceStore;
  invocationChoices?: InvocationChoiceStore;
  mysticArcanumChoices?: MysticArcanumChoiceStore;
}

export interface Character extends CharacterBase {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export function createDefaultCharacter(): CharacterBase {
  return {
    name: '',
    race: '',
    background: '',
    alignment: '',
    classes: [],
    raceStatSelections: [],
    baseAbilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    featureChoices: {},
    hpRolls: [],
    level: 0,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 0,
    maxHp: 0,
    currentHp: 0,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 2,
    skills: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    feats: [],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    featChoices: [],
    expertiseChoices: {},
    metamagicChoices: {},
    invocationChoices: {},
    mysticArcanumChoices: {},
  };
}

export type { ActionType, FeatureAction, ResourceDefinition } from './classes';
export type { ArmorCategory, EquipmentCategory, SrdEquipment, WeaponCategory, WeaponMastery } from './equipment';
export type { DndSpell, SpellSchool } from './spells';
