import Dexie, { type Table } from 'dexie';
import { srdClasses } from '../data/srdClasses';
import { srdEquipment } from '../data/srdEquipment';
import { srdSpells } from '../data/srdSpells';
import type { Character } from '../types';
import type { DndClass } from '../types/classes';
import type { SrdEquipment } from '../types/equipment';
import type { DndSpell } from '../types/spells';

export class CharacterDatabase extends Dexie {
  characters!: Table<Character>;
  classes!: Table<DndClass, string>;
  spells!: Table<DndSpell, string>;
  equipment!: Table<SrdEquipment, string>;

  constructor() {
    super('5eCharacterBuilder');
    this.version(1).stores({
      characters: '++id, name, race, level, createdAt',
      classes: 'name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory'
    });
    this.on('populate', tx => {
      tx.table('classes').bulkAdd(srdClasses);
      tx.table('spells').bulkAdd(srdSpells);
      tx.table('equipment').bulkAdd(srdEquipment);
    });
  }
}

export const db = new CharacterDatabase();
