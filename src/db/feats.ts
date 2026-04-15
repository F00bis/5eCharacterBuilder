import { db } from './index';
import { srdFeats } from '../data/srdFeats';
import type { Feat } from '../types/feats';

export async function getAllFeats(): Promise<Feat[]> {
  return db.feats.toArray();
}

export async function getFeatById(id: number): Promise<Feat | undefined> {
  return db.feats.get(id);
}

export async function getFeatByName(name: string): Promise<Feat | undefined> {
  return db.feats.where('name').equals(name).first();
}

export async function getSRDFeats(): Promise<Feat[]> {
  return db.feats.filter(feat => feat.isSRD === true).toArray();
}

export async function getFeatsByPrerequisite(prerequisite: string): Promise<Feat[]> {
  if (!prerequisite) {
    return db.feats.toArray();
  }
  return db.feats.where('prerequisite').equals(prerequisite).toArray();
}

export async function seedFeats(): Promise<void> {
  const count = await db.feats.count();
  if (count === 0) {
    const featsWithoutId = srdFeats.map(({ id, ...rest }) => rest);
    await db.feats.bulkAdd(featsWithoutId);
  }
}
