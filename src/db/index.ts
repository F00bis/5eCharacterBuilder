import Dexie, { type Table } from 'dexie';
import { srdClasses } from '../data/srdClasses';
import { srdEquipment } from '../data/srdEquipment';
import { srdRaces } from '../data/srdRaces';
import { srdSpells } from '../data/srdSpells';
import type { Character } from '../types';
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
