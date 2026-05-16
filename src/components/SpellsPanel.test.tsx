import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { Character, CharacterSpell } from '../types';
import { groupSpellsByLevel } from '../utils/spellCalculations';
import { SpellsPanel } from './SpellsPanel';

function renderWithCharacter(
  ui: React.ReactElement,
  character: Character
) {
  const mockContext: CharacterContextValue = {
    character,
    isLoading: false,
    isNotFound: false,
    update: vi.fn(),
  };

  return render(
    <CharacterContext.Provider value={mockContext}>
      {ui}
    </CharacterContext.Provider>
  );
}

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Wizard', level: 5 }],
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    baseAbilityScores: {
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
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: [],
    spells: [],
    statusEffects: [],
    feats: [],
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    raceStatSelections: [],
    featureChoices: {},
    hpRolls: [],
    hpBonus: 0,
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    ...overrides,
  };
}

function createCharacterSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    name: 'Test Spell',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'A test spell',
    classes: ['Wizard'],
    isSRD: true,
    prepared: false,
    ...overrides,
  };
}

describe('groupSpellsByLevel', () => {
  it('returns an empty Map for an empty array', () => {
    const result = groupSpellsByLevel([]);
    expect(result.size).toBe(0);
  });

  it('groups spells by level in ascending order', () => {
    const spells: CharacterSpell[] = [
      createCharacterSpell({ name: 'Fireball', level: 3 }),
      createCharacterSpell({ name: 'Magic Missile', level: 1 }),
      createCharacterSpell({ name: 'Light', level: 0 }),
    ];

    const result = groupSpellsByLevel(spells);

    expect(result.size).toBe(3);
    expect(Array.from(result.keys())).toEqual([0, 1, 3]);
    expect(result.get(0)).toEqual([expect.objectContaining({ name: 'Light' })]);
    expect(result.get(1)).toEqual([expect.objectContaining({ name: 'Magic Missile' })]);
    expect(result.get(3)).toEqual([expect.objectContaining({ name: 'Fireball' })]);
  });

  it('groups multiple spells at the same level', () => {
    const spells: CharacterSpell[] = [
      createCharacterSpell({ name: 'Burning Hands', level: 1 }),
      createCharacterSpell({ name: 'Magic Missile', level: 1 }),
      createCharacterSpell({ name: 'Shield', level: 1 }),
    ];

    const result = groupSpellsByLevel(spells);

    expect(result.size).toBe(1);
    expect(result.get(1)).toHaveLength(3);
    expect(result.get(1)?.map((s: CharacterSpell) => s.name)).toEqual([
      'Burning Hands',
      'Magic Missile',
      'Shield',
    ]);
  });

  it('handles only cantrips (level 0)', () => {
    const spells: CharacterSpell[] = [
      createCharacterSpell({ name: 'Light', level: 0 }),
      createCharacterSpell({ name: 'Mage Hand', level: 0 }),
    ];

    const result = groupSpellsByLevel(spells);

    expect(result.size).toBe(1);
    expect(result.get(0)).toHaveLength(2);
  });

  it('handles mixed levels 0–5', () => {
    const spells: CharacterSpell[] = [
      createCharacterSpell({ name: 'Light', level: 0 }),
      createCharacterSpell({ name: 'Magic Missile', level: 1 }),
      createCharacterSpell({ name: 'Misty Step', level: 2 }),
      createCharacterSpell({ name: 'Fireball', level: 3 }),
      createCharacterSpell({ name: 'Dimension Door', level: 4 }),
      createCharacterSpell({ name: 'Cloudkill', level: 5 }),
    ];

    const result = groupSpellsByLevel(spells);

    expect(result.size).toBe(6);
    expect(Array.from(result.keys())).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe('SpellsPanel rendering', () => {
  it('renders empty state when no spells', () => {
    const character = baseCharacter({ spells: [] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('No spells recorded for this character.')).toBeInTheDocument();
  });

  it('renders sticky headers for each level present', () => {
    const character = baseCharacter({
      spells: [
        createCharacterSpell({ name: 'Light', level: 0 }),
        createCharacterSpell({ name: 'Magic Missile', level: 1 }),
      ],
    });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Cantrips')).toBeInTheDocument();
    expect(screen.getByText('1st Level')).toBeInTheDocument();
  });

  it('renders correct count in header badge', () => {
    const character = baseCharacter({
      spells: [
        createCharacterSpell({ name: 'Light', level: 0 }),
        createCharacterSpell({ name: 'Mage Hand', level: 0 }),
        createCharacterSpell({ name: 'Magic Missile', level: 1 }),
      ],
    });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not render levels with zero spells', () => {
    const character = baseCharacter({
      spells: [createCharacterSpell({ name: 'Light', level: 0 })],
    });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.queryByText('1st Level')).not.toBeInTheDocument();
    expect(screen.queryByText('2nd Level')).not.toBeInTheDocument();
  });
});

describe('SpellsPanel row content', () => {
  it('shows spell name and school badge', () => {
    const character = baseCharacter({
      spells: [createCharacterSpell({ name: 'Magic Missile', school: 'Evocation' })],
    });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Magic Missile')).toBeInTheDocument();
    expect(screen.getByText('Evocation')).toBeInTheDocument();
  });

  it('shows concentration indicator only when concentration is true', () => {
    const character = baseCharacter({
      spells: [
        createCharacterSpell({ name: 'Shield', concentration: false }),
        createCharacterSpell({ name: 'Hold Person', concentration: true }),
      ],
    });
    renderWithCharacter(<SpellsPanel />, character);

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Shield');
    expect(rows[1]).toHaveTextContent('Hold Person');
    // The Hold Person row should have the concentration indicator accessible text
    expect(screen.getByLabelText('Concentration')).toBeInTheDocument();
  });

  it('shows ritual indicator only when ritual is true', () => {
    const character = baseCharacter({
      spells: [
        createCharacterSpell({ name: 'Fireball', ritual: false }),
        createCharacterSpell({ name: 'Detect Magic', ritual: true }),
      ],
    });
    renderWithCharacter(<SpellsPanel />, character);

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Fireball');
    expect(rows[1]).toHaveTextContent('Detect Magic');
    expect(screen.getByLabelText('Ritual')).toBeInTheDocument();
  });
});
