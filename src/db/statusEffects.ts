import type { StatusEffect } from '../types';
import { db } from './index';

export function saveCustomStatusEffect(effect: StatusEffect): Promise<string> {
  return db.customStatusEffects.put(effect);
}

export function getCustomStatusEffects(): Promise<StatusEffect[]> {
  return db.customStatusEffects.toArray();
}

export function deleteCustomStatusEffect(id: string): Promise<void> {
  return db.customStatusEffects.delete(id);
}
