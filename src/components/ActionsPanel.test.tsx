import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { Character } from '../types';
import { ActionsPanel } from './ActionsPanel';

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
    classes: [{ className: 'Fighter', level: 5 }],
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
    deathSaves: {successes: 0, failures: 0},
    proficiencyBonus: 3,
    skills: [],
    equipment: [],
    currency: {cp: 0, sp: 0, ep: 0, gp: 0, pp: 0},
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

describe('ActionsPanel filter tabs', () => {
  it('labels the spell filter tab as "Spell Actions" not "Spells"', () => {
    const character = baseCharacter({
      spells: [],
      classes: [{ className: 'Wizard', level: 5 }],
    });

    renderWithCharacter(<ActionsPanel />, character);

    expect(screen.getByRole('button', { name: 'Spell Actions' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Spells' })).not.toBeInTheDocument();
  });
});
