import { describe, it, expect } from 'vitest';
import { srdFeats } from './srdFeats';
import type { Ability } from '../types';

const ALL_ABILITIES: Ability[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'
];

describe('srdFeats data integrity', () => {
  it('every half-feat has asiOptions', () => {
    const halfFeats = srdFeats.filter(f => f.isHalfFeat);
    for (const feat of halfFeats) {
      expect(feat.asiOptions, `${feat.name} missing asiOptions`).toBeDefined();
      expect(feat.asiOptions!.length, `${feat.name} has empty asiOptions`).toBeGreaterThan(0);
    }
  });

  it('no non-half-feat has asiOptions', () => {
    const nonHalfFeats = srdFeats.filter(f => !f.isHalfFeat);
    for (const feat of nonHalfFeats) {
      expect(feat.asiOptions, `${feat.name} should not have asiOptions`).toBeUndefined();
    }
  });

  it('all asiOptions contain valid ability names', () => {
    for (const feat of srdFeats) {
      if (feat.asiOptions) {
        for (const ability of feat.asiOptions) {
          expect(ALL_ABILITIES, `${feat.name} has invalid ability '${ability}'`).toContain(ability);
        }
      }
    }
  });

  it('asiOptions has no duplicates within a single feat', () => {
    for (const feat of srdFeats) {
      if (feat.asiOptions) {
        const unique = new Set(feat.asiOptions);
        expect(unique.size, `${feat.name} has duplicate asiOptions`).toBe(feat.asiOptions.length);
      }
    }
  });

  it('every feat has a unique id', () => {
    const ids = srdFeats.map(f => f.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every feat has a unique name', () => {
    const names = srdFeats.map(f => f.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('specific half-feats have correct asiOptions', () => {
    const expectations: Record<string, Ability[]> = {
      'Athlete': ['strength', 'dexterity'],
      'Actor': ['charisma'],
      'Durable': ['constitution'],
      'Heavily Armored': ['strength'],
      'Heavy Armor Master': ['strength'],
      'Keen Mind': ['intelligence'],
      'Lightly Armored': ['strength', 'dexterity'],
      'Linguist': ['intelligence'],
      'Moderately Armored': ['strength', 'dexterity'],
      'Observant': ['intelligence', 'wisdom'],
      'Piercer': ['strength', 'dexterity'],
      'Resilient': ALL_ABILITIES,
      'Skill Expert': ALL_ABILITIES,
      'Swordsage': ['strength', 'dexterity'],
      'Weapon Master': ['strength', 'dexterity'],
    };

    for (const [name, expected] of Object.entries(expectations)) {
      const feat = srdFeats.find(f => f.name === name);
      expect(feat, `Feat '${name}' not found`).toBeDefined();
      expect(feat!.asiOptions).toEqual(expected);
    }
  });
});