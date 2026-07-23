import { describe, expect, it } from 'vitest';
import type { ExpertiseChoiceStore, SkillProficiency } from '../types';
import { applyExpertiseChoices } from './expertise';

const skills: SkillProficiency[] = [
  { skill: 'stealth', ability: 'dexterity', level: 'proficient', source: 'Class: Rogue' },
  { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Background' },
  { skill: 'insight', ability: 'wisdom', level: 'proficient', source: 'Race: Half-Elf' },
];

describe('applyExpertiseChoices', () => {
  it('upgrades existing proficiencies while preserving their sources', () => {
    const choices: ExpertiseChoiceStore = {
      'expertise:0:rogue:1': ['stealth', 'perception'],
    };

    expect(applyExpertiseChoices(skills, choices)).toEqual([
      { skill: 'stealth', ability: 'dexterity', level: 'expertise', source: 'Class: Rogue' },
      { skill: 'perception', ability: 'wisdom', level: 'expertise', source: 'Background' },
      { skill: 'insight', ability: 'wisdom', level: 'proficient', source: 'Race: Half-Elf' },
    ]);
  });

  it('combines entitlements and ignores choices without a proficiency', () => {
    const choices: ExpertiseChoiceStore = {
      'expertise:0:bard:3': ['perception', 'arcana'],
      'expertise:0:bard:10': ['insight'],
    };

    const result = applyExpertiseChoices(skills, choices);

    expect(result.find(skill => skill.skill === 'perception')?.level).toBe('expertise');
    expect(result.find(skill => skill.skill === 'insight')?.level).toBe('expertise');
    expect(result.some(skill => skill.skill === 'arcana')).toBe(false);
  });

  it('collapses duplicate records and is idempotent', () => {
    const duplicated: SkillProficiency[] = [
      ...skills,
      { skill: 'stealth', ability: 'dexterity', level: 'expertise', source: 'Class: Rogue' },
    ];
    const choices: ExpertiseChoiceStore = { 'expertise:0:rogue:1': ['stealth'] };

    const resolved = applyExpertiseChoices(duplicated, choices);

    expect(resolved.filter(skill => skill.skill === 'stealth')).toHaveLength(1);
    expect(applyExpertiseChoices(resolved, choices)).toEqual(resolved);
  });

  it('retains expertise already present on a character', () => {
    const existing = skills.map(skill =>
      skill.skill === 'stealth' ? { ...skill, level: 'expertise' as const } : skill
    );

    expect(applyExpertiseChoices(existing, {})).toEqual(existing);
  });
});
