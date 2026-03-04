import type { Character } from '../types';
import { db } from './index';

export function getCharacterById(id: number): Promise<Character | undefined> {
  return db.characters.get(id);
}
