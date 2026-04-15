import Dexie, { type Table } from 'dexie';
import { srdClasses } from '../data/srdClasses';
import { srdEquipment } from '../data/srdEquipment';
import { srdFeats } from '../data/srdFeats';
import { srdRaces } from '../data/srdRaces';
import { srdSpells } from '../data/srdSpells';
import type { Character, StatusEffect } from '../types';
import type { DndClass } from '../types/classes';
import type { SrdEquipment } from '../types/equipment';
import type { Feat } from '../types/feats';
import type { DndRace } from '../types/races';
import type { DndSpell } from '../types/spells';
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

    const storeSchema = {
      characters: '++id, name, race, level, xp, createdAt',
      classes: 'name',
      races: 'id, name',
      spells: 'name, level, school, *classes',
      equipment: 'name, equipmentCategory, weaponCategory, weaponClass, weaponForm, armorCategory',
      feats: '++id, &name, prerequisite, isSRD',
      customStatusEffects: 'id, name, category',
      spellProgressions: '++id, className, isCustom',
    };

    this.version(10).stores(storeSchema);

    const SRD_ASI_LEVELS: Record<string, number[]> = {
      Barbarian: [4, 8, 12, 16, 19],
      Bard: [4, 8, 12, 16, 19],
      Cleric: [4, 8, 12, 16, 19],
      Druid: [4, 8, 12, 16, 19],
      Fighter: [4, 6, 8, 12, 14, 16, 19],
      Monk: [4, 8, 12, 16, 19],
      Paladin: [4, 8, 12, 16, 19],
      Ranger: [4, 8, 12, 16, 19],
      Rogue: [4, 8, 10, 12, 16, 19],
      Sorcerer: [4, 8, 12, 16, 19],
      Warlock: [4, 8, 12, 16, 19],
      Wizard: [4, 8, 12, 16, 19],
    };

    this.version(11).stores(storeSchema).upgrade(async tx => {
      const classes = await tx.table('classes').toArray();
      const updates = classes
        .filter((cls: DndClass) => !cls.asiLevels || cls.asiLevels.length === 0)
        .map((cls: DndClass) => ({
          name: cls.name,
          changes: {
            asiLevels: SRD_ASI_LEVELS[cls.name] ?? [4, 8, 12, 16, 19],
          },
        }));
      for (const update of updates) {
        await tx.table('classes').update(update.name, update.changes);
      }
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
