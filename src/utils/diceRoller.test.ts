import { describe, it, expect, vi } from 'vitest';
import { rollDice } from './diceRoller';

describe('rollDice', () => {
  it('rolls simple dice formulas', () => {
    // Mock Math.random to always return 0.5 (so 1d6 is 4)
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    
    expect(rollDice('1d6')).toBe(4);
    expect(rollDice('2d6')).toBe(8);
    expect(rollDice('1d20')).toBe(11);
    
    vi.restoreAllMocks();
  });

  it('drops the lowest rolls correctly', () => {
    const mockValues = [0.1, 0.9, 0.5, 0.2]; // mapped to 1, 6, 4, 2 for a d6
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => mockValues[i++ % mockValues.length]);

    // Rolls will be: 1, 6, 4, 2
    // Dropping lowest 1 should drop the '1', leaving 6, 4, 2 => sum is 12
    expect(rollDice('4d6dl1')).toBe(12);

    vi.restoreAllMocks();
  });

  it('throws an error for invalid formulas', () => {
    expect(() => rollDice('abc')).toThrow();
    expect(() => rollDice('0d6')).toThrow();
    expect(() => rollDice('1d0')).toThrow();
    expect(() => rollDice('4d6dl4')).toThrow(); // Can't drop all or more than all dice
  });
});
