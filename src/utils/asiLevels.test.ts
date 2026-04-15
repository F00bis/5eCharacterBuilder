import { describe, it, expect } from 'vitest';
import { DEFAULT_ASI_LEVELS, getAsiLevelsForClass, isAsiLevel, getNextAsiLevel, getAsiChoiceType } from './asiLevels';

describe('DEFAULT_ASI_LEVELS', () => {
  it('is the standard 5-ASI progression', () => {
    expect(DEFAULT_ASI_LEVELS).toEqual([4, 8, 12, 16, 19]);
  });
});

describe('getAsiLevelsForClass', () => {
  it('returns the provided asiLevels when defined', () => {
    expect(getAsiLevelsForClass([4, 6, 8, 12, 14, 16, 19])).toEqual([4, 6, 8, 12, 14, 16, 19]);
  });

  it('returns the provided asiLevels for Rogue-style progression', () => {
    expect(getAsiLevelsForClass([4, 8, 10, 12, 16, 19])).toEqual([4, 8, 10, 12, 16, 19]);
  });

  it('returns the provided asiLevels for standard progression', () => {
    expect(getAsiLevelsForClass([4, 8, 12, 16, 19])).toEqual([4, 8, 12, 16, 19]);
  });

  it('returns DEFAULT_ASI_LEVELS when called with undefined', () => {
    expect(getAsiLevelsForClass(undefined)).toEqual(DEFAULT_ASI_LEVELS);
  });

  it('returns DEFAULT_ASI_LEVELS when called with an empty array', () => {
    expect(getAsiLevelsForClass([])).toEqual(DEFAULT_ASI_LEVELS);
  });

  it('supports arbitrary custom progressions', () => {
    expect(getAsiLevelsForClass([3, 7, 11, 15, 18])).toEqual([3, 7, 11, 15, 18]);
  });
});

describe('isAsiLevel', () => {
  it('returns true for Fighter level 6', () => {
    expect(isAsiLevel([4, 6, 8, 12, 14, 16, 19], 6)).toBe(true);
  });

  it('returns true for Rogue level 10', () => {
    expect(isAsiLevel([4, 8, 10, 12, 16, 19], 10)).toBe(true);
  });

  it('returns false for Fighter level 5', () => {
    expect(isAsiLevel([4, 6, 8, 12, 14, 16, 19], 5)).toBe(false);
  });

  it('returns false for Rogue level 9', () => {
    expect(isAsiLevel([4, 8, 10, 12, 16, 19], 9)).toBe(false);
  });

  it('returns true for all standard ASI levels', () => {
    const standard = [4, 8, 12, 16, 19];
    expect(isAsiLevel(standard, 4)).toBe(true);
    expect(isAsiLevel(standard, 8)).toBe(true);
    expect(isAsiLevel(standard, 12)).toBe(true);
    expect(isAsiLevel(standard, 16)).toBe(true);
    expect(isAsiLevel(standard, 19)).toBe(true);
  });

  it('returns false for non-ASI standard levels', () => {
    const standard = [4, 8, 12, 16, 19];
    expect(isAsiLevel(standard, 1)).toBe(false);
    expect(isAsiLevel(standard, 5)).toBe(false);
    expect(isAsiLevel(standard, 20)).toBe(false);
  });

  it('supports custom progressions', () => {
    expect(isAsiLevel([3, 7, 11, 15, 18], 3)).toBe(true);
    expect(isAsiLevel([3, 7, 11, 15, 18], 4)).toBe(false);
  });
});

describe('getNextAsiLevel', () => {
  it('returns next ASI level for Fighter at level 3', () => {
    expect(getNextAsiLevel([4, 6, 8, 12, 14, 16, 19], 3)).toBe(4);
  });

  it('returns level 6 as next ASI for Fighter at level 4', () => {
    expect(getNextAsiLevel([4, 6, 8, 12, 14, 16, 19], 4)).toBe(6);
  });

  it('returns null when at max ASI level for Fighter', () => {
    expect(getNextAsiLevel([4, 6, 8, 12, 14, 16, 19], 19)).toBe(null);
  });

  it('returns next ASI for standard class', () => {
    const standard = [4, 8, 12, 16, 19];
    expect(getNextAsiLevel(standard, 1)).toBe(4);
    expect(getNextAsiLevel(standard, 4)).toBe(8);
    expect(getNextAsiLevel(standard, 8)).toBe(12);
    expect(getNextAsiLevel(standard, 12)).toBe(16);
    expect(getNextAsiLevel(standard, 16)).toBe(19);
    expect(getNextAsiLevel(standard, 19)).toBe(null);
  });

  it('supports custom progressions', () => {
    expect(getNextAsiLevel([3, 7, 11], 3)).toBe(7);
    expect(getNextAsiLevel([3, 7, 11], 11)).toBe(null);
  });
});

describe('getAsiChoiceType', () => {
  it('returns ASI-or-Feat for valid ASI levels', () => {
    expect(getAsiChoiceType([4, 6, 8, 12, 14, 16, 19], 4)).toBe('ASI-or-Feat');
    expect(getAsiChoiceType([4, 8, 12, 16, 19], 8)).toBe('ASI-or-Feat');
  });

  it('returns ASI-or-Feat for custom class ASI level', () => {
    expect(getAsiChoiceType([3, 7, 11, 15, 18], 3)).toBe('ASI-or-Feat');
  });
});
