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
  describe('Tasha\'s Rules enabled', () => {
    it('returns false when race is undefined', () => {
      const result = isValidRaceStep(undefined, undefined, true, null, null, {}, [], {}, [], 0);
      expect(result).toBe(false);
    });

    it('returns false when race is empty string', () => {
      const result = isValidRaceStep('', undefined, true, null, null, {}, [], {}, [], 0);
      expect(result).toBe(false);
    });

    it('returns false when plus2 is null', () => {
      const result = isValidRaceStep('Human', undefined, true, null, 'dexterity', {}, [], {}, [], 0);
      expect(result).toBe(false);
    });

    it('returns false when plus1 is null', () => {
      const result = isValidRaceStep('Human', undefined, true, 'strength', null, {}, [], {}, [], 0);
      expect(result).toBe(false);
    });

    it('returns false when plus2 and plus1 are the same', () => {
      const result = isValidRaceStep('Human', undefined, true, 'strength', 'strength', {}, [], {}, [], 0);
      expect(result).toBe(false);
    });

    it('returns true when race is selected with valid different plus2 and plus1', () => {
      const result = isValidRaceStep('Human', undefined, true, 'strength', 'dexterity', {}, [], {}, [], 0);
      expect(result).toBe(true);
    });
  });

  describe('Tasha\'s Rules disabled (traditional)', () => {
    it('returns false when not enough flexible selections', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        { 0: 'strength' },
        [
          { ability: 'intelligence', amount: 1 },
          { ability: undefined, amount: 1 },
          { ability: undefined, amount: 1 },
        ],
        {},
        [],
        0
      );
      expect(result).toBe(false);
    });

    it('returns false when duplicate abilities selected', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        { 0: 'strength', 1: 'strength' },
        [
          { ability: 'intelligence', amount: 1 },
          { ability: undefined, amount: 1 },
          { ability: undefined, amount: 1 },
        ],
        {},
        [],
        0
      );
      expect(result).toBe(false);
    });

    it('returns true when all selections are valid', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        { 0: 'strength', 1: 'dexterity' },
        [
          { ability: 'intelligence', amount: 1 },
          { ability: undefined, amount: 1 },
          { ability: undefined, amount: 1 },
        ],
        {},
        [],
        0
      );
      expect(result).toBe(true);
    });
  });

  describe('required choices', () => {
    it('returns false when required choice is missing', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        {},
        [],
        {},
        [{ type: 'skill', count: 2 }],
        0
      );
      expect(result).toBe(false);
    });

    it('returns true when required choice is satisfied', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        {},
        [],
        { skill: ['Athletics', 'Acrobatics'] },
        [{ type: 'skill', count: 2 }],
        0
      );
      expect(result).toBe(true);
    });

    it('returns true when required choice has single value', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        {},
        [],
        { draconicAncestry: 'red' },
        [{ type: 'draconicAncestry' }],
        0
      );
      expect(result).toBe(true);
    });

    it('returns false when language choice has insufficient count', () => {
      const result = isValidRaceStep(
        'Human',
        undefined,
        false,
        null,
        null,
        {},
        [],
        { language: ['Common'] },
        [{ type: 'language', count: 2 }],
        0
      );
      expect(result).toBe(false);
    });
  });
});
