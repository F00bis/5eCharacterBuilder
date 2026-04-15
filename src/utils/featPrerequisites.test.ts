import { describe, it, expect } from 'vitest';
import {
  parseAbilityPrerequisite,
  characterMeetsFeatPrerequisites,
  getFilteredFeats,
} from './featPrerequisites';

describe('parseAbilityPrerequisite', () => {
  it('returns null for empty string', () => {
    expect(parseAbilityPrerequisite('')).toBeNull();
  });

  it('parses "Dexterity 13 or higher"', () => {
    const result = parseAbilityPrerequisite('Dexterity 13 or higher');
    expect(result).toEqual({ ability: 'dexterity', minimum: 13 });
  });

  it('parses "Strength 13 or higher"', () => {
    const result = parseAbilityPrerequisite('Strength 13 or higher');
    expect(result).toEqual({ ability: 'strength', minimum: 13 });
  });

  it('parses "Charisma 13 or higher"', () => {
    const result = parseAbilityPrerequisite('Charisma 13 or higher');
    expect(result).toEqual({ ability: 'charisma', minimum: 13 });
  });

  it('returns null for "Intelligence or Wisdom 13 or higher" (complex OR)', () => {
    const result = parseAbilityPrerequisite('Intelligence or Wisdom 13 or higher');
    expect(result).toBeNull();
  });

  it('returns null for non-ability prerequisites', () => {
    expect(parseAbilityPrerequisite('The ability to cast at least one spell')).toBeNull();
    expect(parseAbilityPrerequisite('Proficiency with medium armor')).toBeNull();
    expect(parseAbilityPrerequisite('Extra Attack feature')).toBeNull();
  });

  it('returns null for "or more" format', () => {
    const result = parseAbilityPrerequisite('Dexterity 13 or more');
    expect(result).toEqual({ ability: 'dexterity', minimum: 13 });
  });
});

describe('characterMeetsFeatPrerequisites', () => {
  const abilityScores = {
    strength: 15,
    dexterity: 10,
    constitution: 14,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };

  it('returns met: true for empty prerequisite', () => {
    expect(characterMeetsFeatPrerequisites('', abilityScores)).toEqual({ met: true });
  });

  it('returns met: true when ability score meets prerequisite', () => {
    const result = characterMeetsFeatPrerequisites('Strength 13 or higher', abilityScores);
    expect(result).toEqual({ met: true });
  });

  it('returns met: false with reason when ability score does not meet prerequisite', () => {
    const result = characterMeetsFeatPrerequisites('Dexterity 13 or higher', abilityScores);
    expect(result).toEqual({
      met: false,
      reason: 'Requires Dexterity 13 or higher (current: 10)',
    });
  });

  it('returns met: true for non-ability prerequisites', () => {
    expect(characterMeetsFeatPrerequisites('The ability to cast at least one spell', abilityScores)).toEqual({ met: true });
    expect(characterMeetsFeatPrerequisites('Proficiency with medium armor', abilityScores)).toEqual({ met: true });
    expect(characterMeetsFeatPrerequisites('Extra Attack feature', abilityScores)).toEqual({ met: true });
  });
});

describe('getFilteredFeats', () => {
  const abilityScores = {
    strength: 15,
    dexterity: 10,
    constitution: 14,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };

  it('marks feats with met prerequisites correctly', () => {
    const feats = [
      { name: 'Alert', prerequisites: '' },
      { name: 'Heavy Armor Master', prerequisites: 'Proficiency with heavy armor' },
      { name: 'Resilient', prerequisites: 'Strength 13 or higher' },
      { name: 'War Caster', prerequisites: 'Dexterity 13 or higher' },
    ];

    const result = getFilteredFeats(feats, abilityScores);

    expect(result[0].meetsPrerequisites).toBe(true);
    expect(result[1].meetsPrerequisites).toBe(true);
    expect(result[2].meetsPrerequisites).toBe(true);
    expect(result[3].meetsPrerequisites).toBe(false);
    expect(result[3].reason).toBe('Requires Dexterity 13 or higher (current: 10)');
  });

  it('preserves other feat properties', () => {
    const feats = [
      { name: 'Athlete', prerequisites: '', isHalfFeat: true },
      { name: 'Powerful Build', prerequisites: 'Strength 13 or higher', isHalfFeat: false },
    ];

    const result = getFilteredFeats(feats, abilityScores);

    expect(result[0].isHalfFeat).toBe(true);
    expect(result[1].isHalfFeat).toBe(false);
  });
});