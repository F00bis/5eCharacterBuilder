import { describe, it, expect } from 'vitest';
import {
  calculateFeatEntitlements,
  hasEntitlements,
  getEntitlementSourceLabel,
  getFeatEntitlementLabel,
} from './featEntitlements';
import type { CharacterBase } from '../types';

describe('calculateFeatEntitlements', () => {
  const baseDraft: CharacterBase = {
    name: '',
    race: 'Human',
    subrace: 'variant-human',
    background: '',
    alignment: '',
    classes: [],
    raceStatSelections: [],
    baseAbilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    featureChoices: {},
    hpRolls: [],
    level: 1,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 10,
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    ac: 10,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 2,
    skills: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    feats: [],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
  };

  // Standard ASI levels for most SRD classes
  const standardAsiLevels = [4, 8, 12, 16, 19];
  // Fighter's extended ASI progression
  const fighterAsiLevels = [4, 6, 8, 12, 14, 16, 19];
  // Rogue's extended ASI progression
  const rogueAsiLevels = [4, 8, 10, 12, 16, 19];

  describe('create mode', () => {
    it('returns feat entitlement for Variant Human in create mode', () => {
      const result = calculateFeatEntitlements(baseDraft, 'create', {});
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Race (Variant Human)');
      expect(result[0].type).toBe('feat-only');
    });

    it('returns empty array when no subrace', () => {
      const draft = { ...baseDraft, subrace: undefined };
      const result = calculateFeatEntitlements(draft, 'create', {});
      expect(result).toHaveLength(0);
    });

    it('returns empty array for regular Human', () => {
      const draft = { ...baseDraft, subrace: undefined };
      const result = calculateFeatEntitlements(draft, 'create', {});
      expect(result).toHaveLength(0);
    });
  });

  describe('levelup mode', () => {
    it('returns ASI entitlement when leveling to ASI level (Fighter 4)', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'Fighter', level: 4 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', { Fighter: fighterAsiLevels });
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (Fighter 4)');
      expect(result[0].type).toBe('feat-or-asi');
      expect(result[0].level).toBe(4);
    });

    it('returns empty array when not at ASI level (Fighter 3)', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'Fighter', level: 3 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', { Fighter: fighterAsiLevels });
      expect(result).toHaveLength(0);
    });

    it('returns ASI entitlement for Fighter at level 6 (extra ASI)', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'Fighter', level: 6 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', { Fighter: fighterAsiLevels });
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (Fighter 6)');
      expect(result[0].type).toBe('feat-or-asi');
    });

    it('returns ASI entitlement for Rogue at level 10 (extra ASI)', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'Rogue', level: 10 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', { Rogue: rogueAsiLevels });
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (Rogue 10)');
    });

    it('returns ASI entitlement for standard class at level 4', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'Wizard', level: 4 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', { Wizard: standardAsiLevels });
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (Wizard 4)');
    });

    it('returns empty array when no classes', () => {
      const draft = { ...baseDraft, classes: [] };
      const result = calculateFeatEntitlements(draft, 'levelup', {});
      expect(result).toHaveLength(0);
    });

    it('falls back to DEFAULT_ASI_LEVELS when class is not in the lookup map', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'CustomClass', level: 4 }],
      };
      // No entry for CustomClass — should fall back to [4,8,12,16,19]
      const result = calculateFeatEntitlements(draft, 'levelup', {});
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (CustomClass 4)');
      expect(result[0].type).toBe('feat-or-asi');
    });

    it('supports custom ASI progressions from a custom class', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'MyBrewClass', level: 3 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', {
        MyBrewClass: [3, 7, 11, 15, 18],
      });
      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('Class (MyBrewClass 3)');
    });

    it('returns empty array for custom class at non-ASI level', () => {
      const draft = {
        ...baseDraft,
        classes: [{ className: 'MyBrewClass', level: 4 }],
      };
      const result = calculateFeatEntitlements(draft, 'levelup', {
        MyBrewClass: [3, 7, 11, 15, 18],
      });
      expect(result).toHaveLength(0);
    });
  });
});

describe('hasEntitlements', () => {
  it('returns true when entitlements exist', () => {
    expect(hasEntitlements([{ source: 'Test', type: 'feat-only' as const }])).toBe(true);
  });

  it('returns false for empty array', () => {
    expect(hasEntitlements([])).toBe(false);
  });
});

describe('getEntitlementSourceLabel', () => {
  it('returns the source string', () => {
    const entitlement = { source: 'Race (Variant Human)', type: 'feat-only' as const };
    expect(getEntitlementSourceLabel(entitlement)).toBe('Race (Variant Human)');
  });
});

describe('getFeatEntitlementLabel', () => {
  it('returns the source string', () => {
    const entitlement = { source: 'Class (Fighter 4)', type: 'feat-or-asi' as const, level: 4 };
    expect(getFeatEntitlementLabel(entitlement)).toBe('Class (Fighter 4)');
  });
});
