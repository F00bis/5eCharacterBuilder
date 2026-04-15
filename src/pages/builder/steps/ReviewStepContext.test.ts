import { describe, expect, it } from 'vitest';
import { calculateFinalAbilityScores } from './ReviewStepContext';

describe('calculateFinalAbilityScores', () => {
  it('applies ASI bonuses from featChoices in review calculations', () => {
    const result = calculateFinalAbilityScores({
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      featChoices: [
        {
          source: 'Class (Fighter 4)',
          type: 'asi',
          asiBonuses: [
            { ability: 'strength', amount: 2 },
          ],
        },
      ],
    });

    expect(result.strength).toBe(12);
    expect(result.dexterity).toBe(10);
  });

  it('stacks ASI featChoices with feat and equipment modifiers', () => {
    const result = calculateFinalAbilityScores({
      baseAbilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      featChoices: [
        {
          source: 'Class (Fighter 4)',
          type: 'asi',
          asiBonuses: [
            { ability: 'strength', amount: 1 },
            { ability: 'dexterity', amount: 1 },
          ],
        },
      ],
      feats: [
        {
          statModifiers: {
            strength: 1,
          },
        },
      ],
      equipment: [
        {
          equipped: true,
          statModifiers: {
            strength: 1,
          },
        },
      ],
    });

    expect(result.strength).toBe(13);
    expect(result.dexterity).toBe(11);
  });
});
