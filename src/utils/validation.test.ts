import { describe, it, expect } from 'vitest';
import { isValidRaceStep, validateRaceStep } from './validation';

describe('validateRaceStep', () => {
  describe('subrace requirements', () => {
    it('returns requiresSubrace true when race has subraces', () => {
      const result = validateRaceStep('Dwarf', undefined, '', '');
      expect(result.requiresSubrace).toBe(true);
    });

    it('returns requiresSubrace false when race has no subraces', () => {
      const result = validateRaceStep('Half-Orc', undefined, '', '');
      expect(result.requiresSubrace).toBe(false);
    });

    it('returns subraceSelected true when subrace is selected', () => {
      const result = validateRaceStep('Dwarf', 'hill-dwarf', '', '');
      expect(result.subraceSelected).toBe(true);
    });

    it('returns subraceSelected false when subrace is not selected', () => {
      const result = validateRaceStep('Dwarf', undefined, '', '');
      expect(result.subraceSelected).toBe(false);
    });
  });

  describe('stat allocation validation', () => {
    it('returns hasPlus2 true when plus2 is selected', () => {
      const result = validateRaceStep('Human', undefined, 'strength', '');
      expect(result.hasPlus2).toBe(true);
    });

    it('returns hasPlus1 true when plus1 is selected', () => {
      const result = validateRaceStep('Human', undefined, '', 'dexterity');
      expect(result.hasPlus1).toBe(true);
    });

    it('returns plus2AndPlus1Different true when different abilities selected', () => {
      const result = validateRaceStep('Human', undefined, 'strength', 'dexterity');
      expect(result.plus2AndPlus1Different).toBe(true);
    });

    it('returns plus2AndPlus1Different false when same ability selected', () => {
      const result = validateRaceStep('Human', undefined, 'strength', 'strength');
      expect(result.plus2AndPlus1Different).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns isValid false when subrace required but not selected', () => {
      const result = validateRaceStep('Dwarf', undefined, '', '');
      expect(result.isValid).toBe(false);
    });

    it('returns isValid true when no subrace required', () => {
      const result = validateRaceStep('Half-Orc', undefined, '', '');
      expect(result.isValid).toBe(true);
    });

    it('returns isValid true when subrace selected', () => {
      const result = validateRaceStep('Dwarf', 'hill-dwarf', '', '');
      expect(result.isValid).toBe(true);
    });
  });
});

describe('isValidRaceStep', () => {
  it('returns false when race is undefined', () => {
    const result = isValidRaceStep(undefined, 'Acolyte', undefined, true, 'strength', 'dexterity', false);
    expect(result).toBe(false);
  });

  it('returns false when background is undefined', () => {
    const result = isValidRaceStep('Human', undefined, undefined, true, 'strength', 'dexterity', false);
    expect(result).toBe(false);
  });

  it('returns false when subrace required but not selected', () => {
    const result = isValidRaceStep('Dwarf', 'Acolyte', undefined, true, 'strength', 'dexterity', true);
    expect(result).toBe(false);
  });

  it('returns true when subrace not required and Tasha\'s rules have valid selections', () => {
    const result = isValidRaceStep('Human', 'Acolyte', undefined, true, 'strength', 'dexterity', false);
    expect(result).toBe(true);
  });

  it('returns true for traditional rules with subrace selected', () => {
    const result = isValidRaceStep('Dwarf', 'Acolyte', 'hill-dwarf', false, null, null, true);
    expect(result).toBe(true);
  });

  it('returns false for Tasha\'s rules without plus2', () => {
    const result = isValidRaceStep('Human', 'Acolyte', undefined, true, null, 'dexterity', false);
    expect(result).toBe(false);
  });

  it('returns false for Tasha\'s rules without plus1', () => {
    const result = isValidRaceStep('Human', 'Acolyte', undefined, true, 'strength', null, false);
    expect(result).toBe(false);
  });

  it('returns false for Tasha\'s rules with same ability for plus2 and plus1', () => {
    const result = isValidRaceStep('Human', 'Acolyte', undefined, true, 'strength', 'strength', false);
    expect(result).toBe(false);
  });
});
