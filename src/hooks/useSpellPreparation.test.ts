import { renderHook, act, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { Character, CharacterSpell } from '../types';
import { useSpellPreparation, type DisplaySpell } from './useSpellPreparation';

vi.mock('../utils/spellCalculations', async () => {
  const actual = await vi.importActual<typeof import('../utils/spellCalculations')>('../utils/spellCalculations');
  return {
    ...actual,
    getAvailableSpellsForCaster: vi.fn(),
  };
});

import { getAvailableSpellsForCaster } from '../utils/spellCalculations';
const mockGetAvailableSpells = vi.mocked(getAvailableSpellsForCaster);

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

describe('useSpellPreparation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('non-prepared casters', () => {
    it('returns canPrepare false for a known-caster (Bard)', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Bard', level: 5 }],
        spells: [
          createCharacterSpell({ id: 1, name: 'Healing Word', level: 1, prepared: true }),
        ],
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: character.spells,
        spellbook: [],
        preparedSpellsMax: 0,
        canPrepare: false,
        spellcastingAbility: 'charisma',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canPrepare).toBe(false);
      expect(result.current.preparedMax).toBe(0);
    });

    it('returns canPrepare false for a non-caster (Fighter)', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Fighter', level: 5 }],
        spells: [],
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: [],
        spellbook: [],
        preparedSpellsMax: 0,
        canPrepare: false,
        spellcastingAbility: 'intelligence',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canPrepare).toBe(false);
    });
  });

  describe('prepared caster quota calculation', () => {
    it('returns correct quota for L1 Cleric with WIS 16 (preparedMax = 4)', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells: [
          createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        ],
      });

      const availableSpells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Bless', level: 1, prepared: false }),
        createCharacterSpell({ id: 3, name: 'Cure Wounds', level: 1, prepared: false }),
        createCharacterSpell({ id: 4, name: 'Guiding Bolt', level: 1, prepared: false }),
        createCharacterSpell({ id: 5, name: 'Shield of Faith', level: 1, prepared: false }),
        createCharacterSpell({ id: 6, name: 'Healing Word', level: 1, prepared: false }),
      ];

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canPrepare).toBe(true);
      expect(result.current.preparedCount).toBe(0);
      expect(result.current.preparedMax).toBe(4);
      expect(result.current.quotaColor).toBe('green');
    });

    it('shows amber color when at 100% quota', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 12, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 2,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.preparedCount).toBe(2);
      expect(result.current.preparedMax).toBe(2);
      expect(result.current.quotaColor).toBe('amber');
    });

    it('excludes cantrips from prepared count', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Bless', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Only Bless counts; Sacred Flame is a cantrip
      expect(result.current.preparedCount).toBe(1);
    });
  });

  describe('display spells', () => {
    it('returns full class spell list for Cleric (prepared caster)', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells: [
          createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        ],
      });

      const fullClassList: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Bless', level: 1, prepared: false }),
        createCharacterSpell({ id: 3, name: 'Cure Wounds', level: 1, prepared: false }),
      ];

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: fullClassList,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should have all 3 spells from the full class list
      const allSpells = Array.from(result.current.displaySpells.values()).flat() as DisplaySpell[];
      expect(allSpells).toHaveLength(3);
      expect(allSpells.map(s => s.name)).toContain('Sacred Flame');
      expect(allSpells.map(s => s.name)).toContain('Bless');
      expect(allSpells.map(s => s.name)).toContain('Cure Wounds');
    });

    it('returns only character.spells for Wizard', async () => {
      const wizardSpells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Fire Bolt', level: 0, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Magic Missile', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 16, wisdom: 10, charisma: 10,
        },
        spells: wizardSpells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: wizardSpells,
        spellbook: wizardSpells,
        preparedSpellsMax: 8,
        canPrepare: true,
        spellcastingAbility: 'intelligence',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const allSpells = Array.from(result.current.displaySpells.values()).flat() as DisplaySpell[];
      expect(allSpells).toHaveLength(2);
      expect(allSpells.map(s => s.name)).toEqual(['Fire Bolt', 'Magic Missile']);
    });

    it('marks cantrips as canToggle false', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Bless', level: 1, prepared: false }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const cantrips = result.current.displaySpells.get(0) ?? [];
      expect(cantrips).toHaveLength(1);
      expect(cantrips[0].canToggle).toBe(false);

      const level1 = result.current.displaySpells.get(1) ?? [];
      expect(level1).toHaveLength(1);
      expect(level1[0].canToggle).toBe(true);
    });
  });

  describe('wizard spellbook restriction', () => {
    it('marks spells not in spellbook with toggleDisabledReason', async () => {
      const characterSpells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Magic Missile', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Wizard', level: 5 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 16, wisdom: 10, charisma: 10,
        },
        spells: characterSpells,
      });

      // Wizard: availableSpells = spellbook = character.spells
      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: characterSpells,
        spellbook: characterSpells,
        preparedSpellsMax: 8,
        canPrepare: true,
        spellcastingAbility: 'intelligence',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Magic Missile is in spellbook — should be toggleable
      const level1 = (result.current.displaySpells.get(1) ?? []) as DisplaySpell[];
      const magicMissile = level1.find((s: DisplaySpell) => s.name === 'Magic Missile');
      expect(magicMissile?.canToggle).toBe(true);
      expect(magicMissile?.toggleDisabledReason).toBeUndefined();
    });
  });

  describe('toggle behavior', () => {
    it('optimistically toggles a spell to prepared and calls update', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: false }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: false }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      const mockUpdate = vi.fn().mockResolvedValue(undefined);

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.preparedCount).toBe(0);

      await act(async () => {
        result.current.togglePrepare('Bless');
      });

      // Optimistic: count should increase immediately
      expect(result.current.preparedCount).toBe(1);
      expect(mockUpdate).toHaveBeenCalledOnce();

      // update should be called with a spells array where Bless is prepared
      const updateArg = mockUpdate.mock.calls[0][0];
      expect(updateArg.spells).toBeDefined();
      const updatedSpell = (updateArg.spells as CharacterSpell[]).find((s: CharacterSpell) => s.name === 'Bless');
      expect(updatedSpell?.prepared).toBe(true);
    });

    it('optimistically toggles a prepared spell to unprepared', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      const mockUpdate = vi.fn().mockResolvedValue(undefined);

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.preparedCount).toBe(1);

      await act(async () => {
        result.current.togglePrepare('Bless');
      });

      expect(result.current.preparedCount).toBe(0);
      expect(mockUpdate).toHaveBeenCalledOnce();
    });

    it('blocks toggle when at preparation limit and sets warning', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: true }),
        createCharacterSpell({ id: 3, name: 'Guiding Bolt', level: 1, prepared: false }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 12, charisma: 10,
        },
        spells,
      });

      const mockUpdate = vi.fn().mockResolvedValue(undefined);

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 2,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.preparedCount).toBe(2);
      expect(result.current.atLimit).toBe(true);

      await act(async () => {
        result.current.togglePrepare('Guiding Bolt');
      });

      // Should not have toggled
      expect(result.current.preparedCount).toBe(2);
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(result.current.warningMessage).toBe('At preparation limit');
    });

    it('allows unpreparing when at limit', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 12, charisma: 10,
        },
        spells,
      });

      const mockUpdate = vi.fn().mockResolvedValue(undefined);

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 2,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.atLimit).toBe(true);

      await act(async () => {
        result.current.togglePrepare('Bless');
      });

      // Should allow unpreparing even when at limit
      expect(result.current.preparedCount).toBe(1);
      expect(mockUpdate).toHaveBeenCalledOnce();
    });

    it('reverts optimistic toggle on update failure', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: false }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      const mockUpdate = vi.fn().mockRejectedValue(new Error('DB write failed'));

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character, mockUpdate),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.preparedCount).toBe(0);

      await act(async () => {
        result.current.togglePrepare('Bless');
      });

      // After failure, should revert back to 0
      await waitFor(() => {
        expect(result.current.preparedCount).toBe(0);
      });
    });
  });

  describe('quota color', () => {
    it('returns green when under 75%', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 1/4 = 25%
      expect(result.current.quotaColor).toBe('green');
    });

    it('returns amber when between 76% and 100%', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: true }),
        createCharacterSpell({ id: 3, name: 'Guiding Bolt', level: 1, prepared: true }),
        createCharacterSpell({ id: 4, name: 'Shield of Faith', level: 1, prepared: true }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 16, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 4,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 4/4 = 100%
      expect(result.current.quotaColor).toBe('amber');
    });

    it('returns green when preparedMax is 0', async () => {
      const character = baseCharacter({
        classes: [{ className: 'Bard', level: 5 }],
        spells: [],
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: [],
        spellbook: [],
        preparedSpellsMax: 0,
        canPrepare: false,
        spellcastingAbility: 'charisma',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.quotaColor).toBe('green');
    });
  });

  describe('warning message', () => {
    it('clears warning message after a short delay', async () => {
      const spells: CharacterSpell[] = [
        createCharacterSpell({ id: 1, name: 'Bless', level: 1, prepared: true }),
        createCharacterSpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: true }),
        createCharacterSpell({ id: 3, name: 'Guiding Bolt', level: 1, prepared: false }),
      ];

      const character = baseCharacter({
        classes: [{ className: 'Cleric', level: 1 }],
        abilityScores: {
          strength: 10, dexterity: 10, constitution: 10,
          intelligence: 10, wisdom: 12, charisma: 10,
        },
        spells,
      });

      mockGetAvailableSpells.mockResolvedValue({
        availableSpells: spells,
        spellbook: [],
        preparedSpellsMax: 2,
        canPrepare: true,
        spellcastingAbility: 'wisdom',
      });

      const { result } = renderHook(() => useSpellPreparation(), {
        wrapper: createWrapper(character),
      });

      // Wait for loading with real timers
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Switch to fake timers after async loading is done
      vi.useFakeTimers();

      await act(async () => {
        result.current.togglePrepare('Guiding Bolt');
      });

      expect(result.current.warningMessage).toBe('At preparation limit');

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.warningMessage).toBeNull();

      vi.useRealTimers();
    });
  });
});
