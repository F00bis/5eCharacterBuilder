import Dexie, { type Table } from 'dexie';
import { srdClasses } from '../data/srdClasses';
import { srdEquipment } from '../data/srdEquipment';
import { srdRaces } from '../data/srdRaces';
import { srdSpells } from '../data/srdSpells';
import type { Character, Equipment, StatusEffect } from '../types';
import type { DndClass } from '../types/classes';
import type { DndRace } from '../types/races';
import type { SrdEquipment } from '../types/equipment';
import type { DndSpell } from '../types/spells';

export class CharacterDatabase extends Dexie {
  characters!: Table<Character>;
  classes!: Table<DndClass, string>;
  races!: Table<DndRace, string>;
  spells!: Table<DndSpell, string>;
  equipment!: Table<SrdEquipment, string>;
  customStatusEffects!: Table<StatusEffect, string>;

  constructor() {
    super('5eCharacterBuilder');
    this.version(1).stores({
      characters: '++id, name, race, level, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory'
    });
    this.version(2).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory'
    }).upgrade(tx => {
      return tx.table('characters').toCollection().modify(character => {
        if (character.xp === undefined) {
          character.xp = 0;
        }
        if (character.portrait === undefined) {
          character.portrait = null;
        }
      });
    });
    this.version(3).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory'
    }).upgrade(tx => {
      return tx.table('characters').toCollection().modify(character => {
        if (character.statusEffects === undefined) {
          character.statusEffects = [];
        }
      });
    });
    this.version(4).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      customStatusEffects: 'id, name, category'
    });
    this.version(5).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      customStatusEffects: 'id, name, category'
    }).upgrade(tx => {
      return tx.table('characters').toCollection().modify(character => {
        if (character.initiative === undefined) {
          character.initiative = 0;
        }
        if (character.vision === undefined) {
          character.vision = {};
        }
        if (character.deathSaves === undefined) {
          character.deathSaves = { successes: 0, failures: 0 };
        }
      });
    });
    this.version(6).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      customStatusEffects: 'id, name, category'
    }).upgrade(async tx => {
      await tx.table('spells').clear();
      await tx.table('spells').bulkAdd(srdSpells);
    });
    this.version(7).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      customStatusEffects: 'id, name, category'
    }).upgrade(async tx => {
      await tx.table('spells').clear();
      await tx.table('spells').bulkAdd(srdSpells);
    });
    this.version(8).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      customStatusEffects: 'id, name, category'
    }).upgrade(tx => {
      return tx.table('characters').toCollection().modify(character => {
        if (character.currency === undefined) {
          character.currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
        }
        if (character.equipment) {
          character.equipment = character.equipment.map((item: Equipment) => {
            const hasStatEffects = 
              item.weaponCategory || 
              item.armorCategory || 
              item.abilityOverride || 
              item.statModifiers || 
              item.skillModifiers || 
              item.savingThrowModifiers ||
              item.armorClass;
            
            if (hasStatEffects) {
              return { ...item, equippable: true, equipped: item.equipped !== false };
            }
            return { ...item, equippable: false };
          });
        }
      });
    });
    this.on('populate', tx => {
      tx.table('classes').bulkAdd(srdClasses);
      
      const batchSize = 10;
      for (let i = 0; i < srdRaces.length; i += batchSize) {
        const batch = srdRaces.slice(i, i + batchSize);
        tx.table('races').bulkAdd(batch);
      }
      
      tx.table('spells').bulkAdd(srdSpells);
      tx.table('equipment').bulkAdd(srdEquipment);
    });
  }
}

export const db = new CharacterDatabase();
