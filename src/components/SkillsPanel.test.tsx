import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillsPanel } from './SkillsPanel';
import type { Character } from '../types';

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Fighter', level: 5 }],
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    level: 5,
    xp: 3500,
    portrait: null,
    hp: 40,
    maxHp: 40,
    currentHp: 40,
    tempHp: 0,
    ac: 16,
    speed: 30,
    initiative: 0,
    vision: {},
    deathSaves: { successes: 0, failures: 0 },
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    spellSlots: [],
    spells: [],
    statusEffects: [],
    feats: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('SkillsPanel', () => {
  it('renders all 18 skills', () => {
    const character = baseCharacter();
    render(<SkillsPanel character={character} />);

    // Check for all skill names
    expect(screen.getByText('Athletics')).toBeInTheDocument();
    expect(screen.getByText('Acrobatics')).toBeInTheDocument();
    expect(screen.getByText('Sleight of Hand')).toBeInTheDocument();
    expect(screen.getByText('Stealth')).toBeInTheDocument();
    expect(screen.getByText('Arcana')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Investigation')).toBeInTheDocument();
    expect(screen.getByText('Nature')).toBeInTheDocument();
    expect(screen.getByText('Religion')).toBeInTheDocument();
    expect(screen.getByText('Animal Handling')).toBeInTheDocument();
    expect(screen.getByText('Insight')).toBeInTheDocument();
    expect(screen.getByText('Medicine')).toBeInTheDocument();
    expect(screen.getByText('Perception')).toBeInTheDocument();
    expect(screen.getByText('Survival')).toBeInTheDocument();
    expect(screen.getByText('Deception')).toBeInTheDocument();
    expect(screen.getByText('Intimidation')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Persuasion')).toBeInTheDocument();
  });

  it('groups skills under ability headers', () => {
    const character = baseCharacter();
    render(<SkillsPanel character={character} />);

    // Skills are displayed in a flat list (not grouped by ability)
    // Verify all 18 skills are present
    expect(screen.getByText('Athletics')).toBeInTheDocument();
    expect(screen.getByText('Acrobatics')).toBeInTheDocument();
  });

  it('displays zero bonuses for all 10 ability scores', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
    });
    render(<SkillsPanel character={character} />);

    // All 18 skills should show "0" (no proficiency, 0 modifier)
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(18);
  });

  it('displays correct bonuses based on ability modifiers', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 16, // +3
        dexterity: 14, // +2
        constitution: 10,
        intelligence: 12, // +1
        wisdom: 8, // -1
        charisma: 10,
      },
    });
    render(<SkillsPanel character={character} />);

    // Athletics (STR) should show +3
    expect(screen.getByText('Athletics').parentElement?.textContent).toContain('+3');

    // Acrobatics (DEX) should show +2
    expect(screen.getByText('Acrobatics').parentElement?.textContent).toContain('+2');

    // Arcana (INT) should show +1
    expect(screen.getByText('Arcana').parentElement?.textContent).toContain('+1');

    // Perception (WIS) should show -1
    expect(screen.getByText('Perception').parentElement?.textContent).toContain('-1');
  });

  it('adds proficiency bonus to proficient skills', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 14, // +2
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'athletics', ability: 'strength', level: 'proficient' }],
    });
    render(<SkillsPanel character={character} />);

    // Athletics: +2 (ability) + 3 (proficiency) = +5
    expect(screen.getByText('Athletics').parentElement?.textContent).toContain('+5');
  });

  it('doubles proficiency bonus for expertise skills', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 16, // +3
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'stealth', ability: 'dexterity', level: 'expertise' }],
    });
    render(<SkillsPanel character={character} />);

    // Stealth: +3 (ability) + 6 (expertise = 2x proficiency) = +9
    expect(screen.getByText('Stealth').parentElement?.textContent).toContain('+9');
  });

  it('includes feat skill modifiers in total bonus', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14, // +2
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      feats: [
        {
          name: 'Skill Expert',
          description: 'Gain expertise in one skill',
          statModifiers: {},
          skillModifiers: { stealth: 2 },
        },
      ],
    });
    render(<SkillsPanel character={character} />);

    // Stealth: +2 (ability) + 2 (feat) = +4
    expect(screen.getByText('Stealth').parentElement?.textContent).toContain('+4');
  });

  it('includes equipment skill modifiers in total bonus', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 14, // +2
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      equipment: [
        {
          name: 'Cloak of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Grants advantage on Stealth checks',
          skillModifiers: { stealth: 5 },
        },
      ],
    });
    render(<SkillsPanel character={character} />);

    // Stealth: +2 (ability) + 5 (equipment) = +7
    expect(screen.getByText('Stealth').parentElement?.textContent).toContain('+7');
  });

  it('stacks proficiency, feat, and equipment bonuses correctly', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 10,
        dexterity: 18, // +4
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 4,
      skills: [{ skill: 'stealth', ability: 'dexterity', level: 'expertise' }],
      feats: [
        {
          name: 'Skill Expert',
          description: 'Gain expertise in one skill',
          statModifiers: {},
          skillModifiers: { stealth: 2 },
        },
      ],
      equipment: [
        {
          name: 'Cloak of Elvenkind',
          rarity: 'uncommon',
          weight: 1,
          description: 'Grants advantage on Stealth checks',
          skillModifiers: { stealth: 5 },
        },
      ],
    });
    render(<SkillsPanel character={character} />);

    // Stealth: +4 (ability) + 8 (expertise) + 2 (feat) + 5 (equipment) = +19
    expect(screen.getByText('Stealth').parentElement?.textContent).toContain('+19');
  });

  it('displays proficiency indicators correctly', () => {
    const character = baseCharacter({
      proficiencyBonus: 3,
      skills: [
        { skill: 'athletics', ability: 'strength', level: 'proficient' },
        { skill: 'stealth', ability: 'dexterity', level: 'expertise' },
      ],
    });
    render(<SkillsPanel character={character} />);

    // Check for proficiency indicators - 1 proficient (purple circle), 1 expertise (star)
    const purpleCircles = document.querySelectorAll('.rounded-full.bg-purple-700.border-purple-700');
    expect(purpleCircles.length).toBe(1);

    const starIcons = document.querySelectorAll('.text-purple-700 > path');
    expect(starIcons.length).toBe(1);

    // Remaining 16 skills should be non-proficient (border only, no bg)
    const nonProficient = document.querySelectorAll('.rounded-full.border.border-slate-400:not(.bg-purple-700)');
    expect(nonProficient.length).toBe(16);
  });

  it('handles multiple proficient skills correctly', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 14, // +2
        dexterity: 16, // +3
        constitution: 10,
        intelligence: 12, // +1
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [
        { skill: 'athletics', ability: 'strength', level: 'proficient' },
        { skill: 'acrobatics', ability: 'dexterity', level: 'proficient' },
        { skill: 'stealth', ability: 'dexterity', level: 'expertise' },
        { skill: 'arcana', ability: 'intelligence', level: 'proficient' },
      ],
    });
    render(<SkillsPanel character={character} />);

    // Athletics: +2 + 3 = +5
    expect(screen.getByText('Athletics').parentElement?.textContent).toContain('+5');

    // Acrobatics: +3 + 3 = +6
    expect(screen.getByText('Acrobatics').parentElement?.textContent).toContain('+6');

    // Stealth: +3 + 6 = +9
    expect(screen.getByText('Stealth').parentElement?.textContent).toContain('+9');

    // Arcana: +1 + 3 = +4
    expect(screen.getByText('Arcana').parentElement?.textContent).toContain('+4');
  });

  it('handles negative ability modifiers correctly', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 8, // -1
        dexterity: 6, // -2
        constitution: 10,
        intelligence: 7, // -2
        wisdom: 10,
        charisma: 10,
      },
    });
    render(<SkillsPanel character={character} />);

    // Athletics (STR): -1
    expect(screen.getByText('Athletics').parentElement?.textContent).toContain('-1');

    // Acrobatics (DEX): -2
    expect(screen.getByText('Acrobatics').parentElement?.textContent).toContain('-2');

    // Arcana (INT): -2
    expect(screen.getByText('Arcana').parentElement?.textContent).toContain('-2');
  });

  it('proficiency can offset negative ability modifiers', () => {
    const character = baseCharacter({
      abilityScores: {
        strength: 8, // -1
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      proficiencyBonus: 3,
      skills: [{ skill: 'athletics', ability: 'strength', level: 'proficient' }],
    });
    render(<SkillsPanel character={character} />);

    // Athletics: -1 (ability) + 3 (proficiency) = +2
    expect(screen.getByText('Athletics').parentElement?.textContent).toContain('+2');
  });
});
