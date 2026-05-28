import { renderHook, act, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { Character, CharacterSpell, DndSpell } from '../types';
import { useWizardSpellbook } from './useWizardSpellbook';

vi.mock('../db/spells', () => ({
  getSpellsByClass: vi.fn(),
}));

import { getSpellsByClass } from '../db/spells';

const mockGetSpellsByClass = vi.mocked(getSpellsByClass);

function createMockDndSpell(overrides: Partial<DndSpell> = {}): DndSpell {
  return {
    name: 'Mock Spell',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'A mock spell for testing.',
    classes: ['Wizard'],
    isSRD: true,
    ...overrides,
  };
}

function createMockCharacterSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    ...createMockDndSpell(),
    id: 1,
    prepared: false,
    ...overrides,
  };
}

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Test Hero',
    race: 'Human',
    background: 'Soldier',
    alignment: 'Neutral',
    classes: [{ className: 'Wizard', level: 5 }],
    raceStatSelections: [],
    baseAbilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 16,
      wisdom: 10,
      charisma: 10,
    },
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 16,
      wisdom: 10,
      charisma: 10,
    },
    featureChoices: {},
    hpRolls: [],
    level: 5,
    xp: 0,
    portrait: null,
    hpBonus: 0,
    hp: 30,
    maxHp: 30,
    currentHp: 30,
    tempHp: 0,
    ac: 10,
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
    feats: [],
    statusEffects: [],
    notes: '',
    languages: [],
    toolProficiencies: [],
    raceChoices: {},
    backgroundChoices: {},
    featChoices: [],
    expertiseChoices: {},
    metamagicChoices: {},
    invocationChoices: {},
    mysticArcanumChoices: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createWrapper(character: Character, update: CharacterContextValue['update'] = vi.fn()) {
  const mockContext: CharacterContextValue = {
    character,
    isLoading: false,
    isNotFound: false,
    update,
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(CharacterContext.Provider, { value: mockContext }, children);
  };
}

describe('useWizardSpellbook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isWizard', () => {
    it('returns false for non-Wizard characters', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 5 }],
        spells: [],
      });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isWizard).toBe(false);
    });

    it('returns true for Wizard characters', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        spells: [],
      });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isWizard).toBe(true);
    });
  });

  describe('spellbookSpells', () => {
    it('returns spells with source Class or Spellbook', async () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', source: 'Class' }),
        createMockCharacterSpell({ id: 2, name: 'Shield', source: 'Spellbook' }),
        createMockCharacterSpell({ id: 3, name: 'Fireball', source: 'Feat' }),
      ];
      const character = baseCharacter({ spells });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.spellbookSpells).toHaveLength(2);
      expect(result.current.spellbookSpells.map((s: CharacterSpell) => s.name)).toContain('Magic Missile');
      expect(result.current.spellbookSpells.map((s: CharacterSpell) => s.name)).toContain('Shield');
      expect(result.current.spellbookSpells.map((s: CharacterSpell) => s.name)).not.toContain('Fireball');
    });
  });

  describe('addSpell', () => {
    it('calls update with new spells array containing appended spell', async () => {
      const character = baseCharacter({ spells: [] });
      const mockUpdate = vi.fn().mockResolvedValue(undefined);
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newSpell = createMockDndSpell({ name: 'Fireball', level: 3 });

      await act(async () => {
        result.current.addSpell(newSpell);
      });

      expect(mockUpdate).toHaveBeenCalledOnce();
      const updateArg = mockUpdate.mock.calls[0][0];
      expect(updateArg.spells).toBeDefined();
      const spells = updateArg.spells as CharacterSpell[];
      expect(spells).toHaveLength(1);
      expect(spells[0].name).toBe('Fireball');
      expect(spells[0].prepared).toBe(false);
      expect(spells[0].source).toBe('Spellbook');
    });

    it('returns AddSpellResult with spell and addedAt date', async () => {
      const character = baseCharacter({ spells: [] });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newSpell = createMockDndSpell({ name: 'Fireball', level: 3 });
      let addResult;

      await act(async () => {
        addResult = result.current.addSpell(newSpell);
      });

      expect(addResult!.spell).toEqual(newSpell);
      expect(addResult!.addedAt).toBeInstanceOf(Date);
    });

    it('does not mutate the original spells array', async () => {
      const originalSpells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', source: 'Class' }),
      ];
      const character = baseCharacter({ spells: originalSpells });
      const mockUpdate = vi.fn().mockResolvedValue(undefined);
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newSpell = createMockDndSpell({ name: 'Fireball', level: 3 });

      await act(async () => {
        result.current.addSpell(newSpell);
      });

      expect(originalSpells).toHaveLength(1);
      expect(originalSpells[0].name).toBe('Magic Missile');
    });
  });

  describe('removeSpell', () => {
    it('calls update with new spells array without the removed spell', async () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', source: 'Class' }),
        createMockCharacterSpell({ id: 2, name: 'Shield', source: 'Class' }),
      ];
      const character = baseCharacter({ spells });
      const mockUpdate = vi.fn().mockResolvedValue(undefined);
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.removeSpell('Magic Missile');
      });

      expect(mockUpdate).toHaveBeenCalledOnce();
      const updateArg = mockUpdate.mock.calls[0][0];
      const newSpells = updateArg.spells as CharacterSpell[];
      expect(newSpells).toHaveLength(1);
      expect(newSpells[0].name).toBe('Shield');
    });

    it('removes prepared spell from array', async () => {
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', source: 'Class', prepared: true }),
        createMockCharacterSpell({ id: 2, name: 'Shield', source: 'Class', prepared: false }),
      ];
      const character = baseCharacter({ spells });
      const mockUpdate = vi.fn().mockResolvedValue(undefined);
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.removeSpell('Magic Missile');
      });

      const updateArg = mockUpdate.mock.calls[0][0];
      const newSpells = updateArg.spells as CharacterSpell[];
      expect(newSpells.some((s: CharacterSpell) => s.name === 'Magic Missile')).toBe(false);
    });
  });

  describe('cap indicator', () => {
    it('nearCap is true at 90% capacity or above', async () => {
      const spells: CharacterSpell[] = Array.from({ length: 9 }, (_, i) =>
        createMockCharacterSpell({
          id: i + 1,
          name: `Spell ${i + 1}`,
          source: 'Class',
          prepared: false,
        })
      );
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        spells,
      });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.nearCap).toBe(true);
    });

    it('nearCap is false below 90% capacity', async () => {
      const spells: CharacterSpell[] = Array.from({ length: 4 }, (_, i) =>
        createMockCharacterSpell({
          id: i + 1,
          name: `Spell ${i + 1}`,
          source: 'Class',
          prepared: false,
        })
      );
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        spells,
      });
      mockGetSpellsByClass.mockResolvedValue([]);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.nearCap).toBe(false);
    });
  });

  describe('availableToAdd', () => {
    it('excludes spells already in spellbook', async () => {
      const dbSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Magic Missile', level: 1 }),
        createMockDndSpell({ name: 'Fireball', level: 3 }),
        createMockDndSpell({ name: 'Shield', level: 1 }),
      ];
      const spells: CharacterSpell[] = [
        createMockCharacterSpell({ id: 1, name: 'Magic Missile', source: 'Class' }),
      ];
      const character = baseCharacter({ spells });
      mockGetSpellsByClass.mockResolvedValue(dbSpells);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.availableToAdd).toHaveLength(2);
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Fireball');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Shield');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).not.toContain('Magic Missile');
    });

    it('filters out spells above the max level for the wizard class level', async () => {
      const dbSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Magic Missile', level: 1 }),
        createMockDndSpell({ name: 'Misty Step', level: 2 }),
        createMockDndSpell({ name: 'Fireball', level: 3 }),
      ];
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 1 }],
        spells: [],
      });
      mockGetSpellsByClass.mockResolvedValue(dbSpells);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Level 1 wizard can only cast 1st level spells
      expect(result.current.availableToAdd).toHaveLength(1);
      expect(result.current.availableToAdd[0].name).toBe('Magic Missile');
    });

    it('includes spells up to the max level for the wizard class level', async () => {
      const dbSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Magic Missile', level: 1 }),
        createMockDndSpell({ name: 'Misty Step', level: 2 }),
        createMockDndSpell({ name: 'Fireball', level: 3 }),
      ];
      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 3 }],
        spells: [],
      });
      mockGetSpellsByClass.mockResolvedValue(dbSpells);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Level 3 wizard can cast up to 2nd level spells
      expect(result.current.availableToAdd).toHaveLength(2);
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Magic Missile');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Misty Step');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).not.toContain('Fireball');
    });

    it('uses only wizard class level when multiclassed, not total character level', async () => {
      const dbSpells: DndSpell[] = [
        createMockDndSpell({ name: 'Magic Missile', level: 1 }),
        createMockDndSpell({ name: 'Misty Step', level: 2 }),
        createMockDndSpell({ name: 'Fireball', level: 3 }),
      ];
      // Wizard 3 / Fighter 2 — total level 5, but wizard max spell level is 2
      const character = baseCharacter({
        classes: [
          { className: 'Wizard', level: 3 },
          { className: 'Fighter', level: 2 },
        ],
        spells: [],
      });
      mockGetSpellsByClass.mockResolvedValue(dbSpells);

      const { result } = renderHook(() => useWizardSpellbook(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should only show up to 2nd level (wizard level 3), not 3rd level (total level 5)
      expect(result.current.availableToAdd).toHaveLength(2);
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Magic Missile');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).toContain('Misty Step');
      expect(result.current.availableToAdd.map((s: DndSpell) => s.name)).not.toContain('Fireball');
    });
  });
});
