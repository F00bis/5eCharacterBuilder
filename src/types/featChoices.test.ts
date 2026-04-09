import { describe, it, expect } from 'vitest';
import type { FeatChoiceDefinition } from './featChoices';

describe('FeatChoiceDefinition type', () => {
  it('accepts a valid choice definition', () => {
    const choice: FeatChoiceDefinition = {
      id: 'damageType',
      kind: 'damage-type',
      label: 'Choose a damage type',
      count: 1,
      options: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
    };
    expect(choice.id).toBe('damageType');
    expect(choice.kind).toBe('damage-type');
    expect(choice.count).toBe(1);
  });

  it('accepts a linked choice definition', () => {
    const choice: FeatChoiceDefinition = {
      id: 'savingThrow',
      kind: 'saving-throw',
      label: 'Saving Throw Proficiency',
      count: 1,
      linkedTo: 'asi',
    };
    expect(choice.linkedTo).toBe('asi');
  });

  it('allows options to be omitted for unconstrained choices', () => {
    const choice: FeatChoiceDefinition = {
      id: 'skillProficiency',
      kind: 'skill-proficiency',
      label: 'Choose a skill',
      count: 1,
    };
    expect(choice.options).toBeUndefined();
  });
});