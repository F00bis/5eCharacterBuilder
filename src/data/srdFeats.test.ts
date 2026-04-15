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

describe('srdFeats choices data integrity', () => {
  it('Elemental Adept has a damage-type choice with 5 options', () => {
    const feat = srdFeats.find(f => f.name === 'Elemental Adept');
    expect(feat?.choices).toHaveLength(1);
    expect(feat?.choices?.[0].kind).toBe('damage-type');
    expect(feat?.choices?.[0].options).toHaveLength(5);
  });

  it('Resilient has a saving-throw choice linked to asi', () => {
    const feat = srdFeats.find(f => f.name === 'Resilient');
    expect(feat?.choices).toHaveLength(1);
    expect(feat?.choices?.[0].kind).toBe('saving-throw');
    expect(feat?.choices?.[0].linkedTo).toBe('asi');
  });

  it('Skill Expert has skill-proficiency and skill-expertise choices', () => {
    const feat = srdFeats.find(f => f.name === 'Skill Expert');
    expect(feat?.choices).toHaveLength(2);
    expect(feat?.choices?.[0].kind).toBe('skill-proficiency');
    expect(feat?.choices?.[1].kind).toBe('skill-expertise');
  });

  it('Magic Initiate has 4 choices: spell-list, spellcasting-ability, cantrips, spell', () => {
    const feat = srdFeats.find(f => f.name === 'Magic Initiate');
    expect(feat?.choices).toHaveLength(4);
    const kinds = feat?.choices?.map(c => c.kind);
    expect(kinds).toContain('spell-list');
    expect(kinds).toContain('spellcasting-ability');
    expect(kinds).toContain('cantrip');
    expect(kinds).toContain('spell');
  });

  it('Weapon Master has a weapon-proficiency choice with count 4', () => {
    const feat = srdFeats.find(f => f.name === 'Weapon Master');
    expect(feat?.choices).toHaveLength(1);
    expect(feat?.choices?.[0].kind).toBe('weapon-proficiency');
    expect(feat?.choices?.[0].count).toBe(4);
  });

  it('Martial Adept has a maneuver choice with count 2', () => {
    const feat = srdFeats.find(f => f.name === 'Martial Adept');
    expect(feat?.choices).toHaveLength(1);
    expect(feat?.choices?.[0].kind).toBe('maneuver');
    expect(feat?.choices?.[0].count).toBe(2);
  });

  it('all choices have valid kind values', () => {
    const validKinds = [
      'ability', 'skill-proficiency', 'skill-expertise', 'saving-throw',
      'damage-type', 'spell-list', 'cantrip', 'spell',
      'weapon-proficiency', 'tool-proficiency', 'spellcasting-ability', 'maneuver',
    ];
    for (const feat of srdFeats) {
      if (feat.choices) {
        for (const choice of feat.choices) {
          expect(validKinds, `${feat.name} choice '${choice.id}' has invalid kind '${choice.kind}'`).toContain(choice.kind);
        }
      }
    }
  });

  it('all choices have count >= 1', () => {
    for (const feat of srdFeats) {
      if (feat.choices) {
        for (const choice of feat.choices) {
          expect(choice.count, `${feat.name} choice '${choice.id}' has count < 1`).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('linkedTo references exist within the same feat choices', () => {
    for (const feat of srdFeats) {
      if (feat.choices) {
        for (const choice of feat.choices) {
          if (choice.linkedTo && choice.linkedTo !== 'asi') {
            const targetExists = feat.choices.some(c => c.id === choice.linkedTo);
            expect(targetExists, `${feat.name} choice '${choice.id}' linkedTo '${choice.linkedTo}' not found`).toBe(true);
          }
        }
      }
    }
  });
});