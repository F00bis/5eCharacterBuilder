import { db } from './index';
import type { DndClass } from '../types/classes';

export async function getAllClasses(): Promise<DndClass[]> {
  return db.classes.toArray();
}

export async function getClassByName(name: string): Promise<DndClass | undefined> {
  return db.classes.get(name);
}

export async function getClassNames(): Promise<string[]> {
  return db.classes.toCollection().primaryKeys();
}
