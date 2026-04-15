import type { DndClass } from '../types/classes';
import { getAsiLevelsForClass } from '../utils/asiLevels';
import type { AsiLevelsByClass } from '../utils/featEntitlements';
import { db } from './index';

export async function getAllClasses(): Promise<DndClass[]> {
  return db.classes.toArray();
}

export async function getClassByName(name: string): Promise<DndClass | undefined> {
  return db.classes.get(name);
}

export async function getClassNames(): Promise<string[]> {
  return db.classes.toCollection().primaryKeys();
}

export async function getAsiLevelsByClass(): Promise<AsiLevelsByClass> {
  const classes = await db.classes.toArray();
  return Object.fromEntries(
    classes.map(cls => [cls.name, getAsiLevelsForClass(cls.asiLevels)])
  );
}
