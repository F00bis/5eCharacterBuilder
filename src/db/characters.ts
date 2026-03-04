import type { Character } from '../types';
import { db } from './index';

export function getCharacterById(id: number): Promise<Character | undefined> {
  return db.characters.get(id);
}

export async function updateCharacter(id: number, updates: Partial<Character>): Promise<number> {
  return db.characters.update(id, { ...updates, updatedAt: new Date() });
}
