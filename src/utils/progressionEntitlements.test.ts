import { describe, expect, it } from 'vitest';
import {
  calculateExpertiseEntitlements,
  calculateInvocationEntitlements,
  calculateMetamagicEntitlements,
  calculateMysticArcanumEntitlements,
} from './progressionEntitlements';

describe('calculateExpertiseEntitlements', () => {
  it('returns bard expertise at level 3 and rogue expertise at level 1', () => {
    const result = calculateExpertiseEntitlements([
      { className: 'Bard', level: 3 },
      { className: 'Rogue', level: 1 },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ domain: 'expertise', className: 'Bard', count: 2, level: 3 });
    expect(result[1]).toMatchObject({ domain: 'expertise', className: 'Rogue', count: 2, level: 1 });
  });

  it('keeps multiclass source keys collision-free by class index', () => {
    const result = calculateExpertiseEntitlements([
      { className: 'Rogue', level: 1 },
      { className: 'Rogue', level: 6 },
    ]);

    expect(result[0].sourceKey).toBe('expertise:0:rogue:1');
    expect(result[1].sourceKey).toBe('expertise:1:rogue:6');
    expect(result[0].sourceKey).not.toBe(result[1].sourceKey);
  });

  it('supports homebrew expertise fallback map', () => {
    const result = calculateExpertiseEntitlements(
      [{ className: 'Scholar', level: 2 }],
      { expertiseByClass: { Scholar: { 2: 1 } } }
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ className: 'Scholar', count: 1, level: 2 });
  });
});

describe('calculateMetamagicEntitlements', () => {
  it('returns metamagic count at sorcerer unlock levels', () => {
    const third = calculateMetamagicEntitlements([{ className: 'Sorcerer', level: 3 }]);
    const tenth = calculateMetamagicEntitlements([{ className: 'Sorcerer', level: 10 }]);

    expect(third[0]).toMatchObject({ count: 2, level: 3 });
    expect(tenth[0]).toMatchObject({ count: 1, level: 10 });
  });

  it('returns empty for unknown class without homebrew override', () => {
    const result = calculateMetamagicEntitlements([{ className: 'CustomClass', level: 3 }]);
    expect(result).toEqual([]);
  });
});

describe('calculateInvocationEntitlements', () => {
  it('returns invocation gains as level-by-level deltas', () => {
    const lvl2 = calculateInvocationEntitlements([{ className: 'Warlock', level: 2 }]);
    const lvl7 = calculateInvocationEntitlements([{ className: 'Warlock', level: 7 }]);

    expect(lvl2[0]).toMatchObject({ count: 2, level: 2 });
    expect(lvl7[0]).toMatchObject({ count: 1, level: 7 });
  });

  it('supports custom invocation progression map for homebrew classes', () => {
    const result = calculateInvocationEntitlements(
      [{ className: 'HexbladePlus', level: 3 }],
      { invocationKnownByClassLevel: { HexbladePlus: [0, 0, 1, 3] } }
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ className: 'HexbladePlus', count: 2, level: 3 });
  });
});

describe('calculateMysticArcanumEntitlements', () => {
  it('returns mystic arcanum entitlement at warlock unlock levels', () => {
    const result = calculateMysticArcanumEntitlements([{ className: 'Warlock', level: 13 }]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ domain: 'mystic-arcanum', level: 13, arcanumLevel: 7, count: 1 });
  });

  it('supports homebrew mystic arcanum map', () => {
    const result = calculateMysticArcanumEntitlements(
      [{ className: 'Voidcaller', level: 9 }],
      { mysticArcanumByClass: { Voidcaller: { 9: 6 } } }
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ className: 'Voidcaller', arcanumLevel: 6, level: 9 });
  });
});
