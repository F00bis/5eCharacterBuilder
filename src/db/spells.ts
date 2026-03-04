import { db } from './index';
import type { DndSpell } from '../types/spells';

export async function getAllSpells(): Promise<DndSpell[]> {
  return db.spells.toArray();
}

export async function getSpellByName(name: string): Promise<DndSpell | undefined> {
  return db.spells.get(name);
}

export async function getSRDSpells(): Promise<DndSpell[]> {
  return db.spells.where('isSRD').equals(1).toArray();
}

export async function getUserSpells(): Promise<DndSpell[]> {
  return db.spells.where('isSRD').equals(0).toArray();
}

export async function getSpellsByClass(className: string): Promise<DndSpell[]> {
  return db.spells.where('classes').equals(className).toArray();
}

export async function getSpellNames(): Promise<string[]> {
  return db.spells.toCollection().primaryKeys();
}
