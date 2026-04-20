import { describe, expect, it } from 'vitest';
import { calculateProficiencyEntitlement } from './proficiencyEntitlements';

describe('calculateProficiencyEntitlement', () => {
  it('shows proficiencies in create mode with class skill choices', () => {
    const result = calculateProficiencyEntitlement({
      mode: 'create',
      draftClasses: [{ className: 'Fighter', level: 1 }],
      baseClassesSnapshot: [],
      currentPassClassName: null,
    });

    expect(result).toMatchObject({
      showProficienciesStep: true,
      className: 'Fighter',
      skillChoicesCount: 2,
    });
  });

  it('hides proficiencies in levelup mode when class is not selected for current pass', () => {
    const result = calculateProficiencyEntitlement({
      mode: 'levelup',
      draftClasses: [{ className: 'Fighter', level: 5 }],
      baseClassesSnapshot: [{ className: 'Fighter', level: 4 }],
      currentPassClassName: null,
    });

    expect(result).toMatchObject({
      showProficienciesStep: false,
      className: null,
      skillChoicesCount: 0,
    });
  });

  it('hides proficiencies in levelup mode when leveling an existing class', () => {
    const result = calculateProficiencyEntitlement({
      mode: 'levelup',
      draftClasses: [{ className: 'Fighter', level: 5 }],
      baseClassesSnapshot: [{ className: 'Fighter', level: 4 }],
      currentPassClassName: 'Fighter',
    });

    expect(result).toMatchObject({
      showProficienciesStep: false,
      className: 'Fighter',
      skillChoicesCount: 0,
    });
  });

  it('shows proficiencies in levelup mode for new multiclass with skill choices', () => {
    const result = calculateProficiencyEntitlement({
      mode: 'levelup',
      draftClasses: [
        { className: 'Fighter', level: 4 },
        { className: 'Rogue', level: 1 },
      ],
      baseClassesSnapshot: [{ className: 'Fighter', level: 4 }],
      currentPassClassName: 'Rogue',
    });

    expect(result).toMatchObject({
      showProficienciesStep: true,
      className: 'Rogue',
      skillChoicesCount: 1,
    });
  });

  it('hides proficiencies in levelup mode for new multiclass with no skill choices', () => {
    const result = calculateProficiencyEntitlement({
      mode: 'levelup',
      draftClasses: [
        { className: 'Wizard', level: 3 },
        { className: 'Fighter', level: 1 },
      ],
      baseClassesSnapshot: [{ className: 'Wizard', level: 3 }],
      currentPassClassName: 'Fighter',
    });

    expect(result).toMatchObject({
      showProficienciesStep: false,
      className: 'Fighter',
      skillChoicesCount: 0,
    });
  });
});
