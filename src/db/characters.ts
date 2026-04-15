import type { Character } from '../types';
import { db } from './index';

export function addCharacter(character: Character): Promise<number> {
  return db.characters.add(character) as Promise<number>;
}

export function getCharacterById(id: number): Promise<Character | undefined> {
  return db.characters.get(id);
}

export async function updateCharacter(id: number, updates: Partial<Character>): Promise<number> {
  return db.characters.update(id, { ...updates, updatedAt: new Date() });
}

export function getAllCharacters(): Promise<Character[]> {
  return db.characters.toArray();
}

export function deleteCharacter(id: number): Promise<void> {
  return db.characters.delete(id);
}
