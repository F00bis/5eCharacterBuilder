import Dexie, { type Table } from 'dexie';
import { srdClasses } from '../data/srdClasses';
import { srdEquipment } from '../data/srdEquipment';
import { srdRaces } from '../data/srdRaces';
import { srdSpells } from '../data/srdSpells';
import { srdFeats } from '../data/srdFeats';
import type { Character, StatusEffect } from '../types';
import type { DndClass } from '../types/classes';
import type { DndRace } from '../types/races';
import type { SrdEquipment } from '../types/equipment';
import type { DndSpell } from '../types/spells';
import type { Feat } from '../types/feats';
import { DEFAULT_SPELL_PROGRESSIONS, type SpellProgression } from './spellProgressions';

export type { SpellProgression } from './spellProgressions';

export class CharacterDatabase extends Dexie {
  characters!: Table<Character>;
  classes!: Table<DndClass, string>;
  races!: Table<DndRace, string>;
  spells!: Table<DndSpell, string>;
  equipment!: Table<SrdEquipment, string>;
  feats!: Table<Feat, number>;
  customStatusEffects!: Table<StatusEffect, string>;
  spellProgressions!: Table<SpellProgression, number>;

  constructor() {
    super('5eCharacterBuilder');
    this.version(10).stores({
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, armorCategory',
      feats: '++id, &name, prerequisite, isSRD',
      customStatusEffects: 'id, name, category',
      spellProgressions: '++id, className, isCustom'
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
      tx.table('feats').bulkAdd(srdFeats);
      
      tx.table('spellProgressions').bulkAdd(DEFAULT_SPELL_PROGRESSIONS);
    });
  }
}

export const db = new CharacterDatabase();
