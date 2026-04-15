import { describe, it, expect } from 'vitest';
import { DAMAGE_TYPES } from './damageTypes';

describe('DAMAGE_TYPES', () => {
  it('contains all 13 standard D&D 5e damage types', () => {
    expect(DAMAGE_TYPES).toHaveLength(13);
  });

  it('includes the 5 elemental adept damage types', () => {
    const elementalAdeptTypes = ['acid', 'cold', 'fire', 'lightning', 'thunder'];
    for (const type of elementalAdeptTypes) {
      expect(DAMAGE_TYPES).toContain(type);
    }
  });

  it('includes physical damage types', () => {
    expect(DAMAGE_TYPES).toContain('bludgeoning');
    expect(DAMAGE_TYPES).toContain('piercing');
    expect(DAMAGE_TYPES).toContain('slashing');
  });

  it('has no duplicates', () => {
    const unique = new Set(DAMAGE_TYPES);
    expect(unique.size).toBe(DAMAGE_TYPES.length);
  });
});