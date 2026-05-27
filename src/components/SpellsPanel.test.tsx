import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { DisplaySpell, UseSpellPreparationResult } from '../hooks/useSpellPreparation';
import type { Character, CharacterSpell } from '../types';
import { groupSpellsByLevel } from '../utils/spellCalculations';
import { SpellsPanel } from './SpellsPanel';

vi.mock('../hooks/useSpellPreparation', () => ({
  useSpellPreparation: vi.fn(),
}));

vi.mock('../hooks/useWizardSpellbook', () => ({
  useWizardSpellbook: vi.fn(),
}));

import { useSpellPreparation } from '../hooks/useSpellPreparation';
import { useWizardSpellbook } from '../hooks/useWizardSpellbook';

const mockUseSpellPreparation = vi.mocked(useSpellPreparation);
const mockUseWizardSpellbook = vi.mocked(useWizardSpellbook);

// Provide a default mock so existing tests that render Wizard characters don't crash
beforeEach(() => {
  mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult());
});

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

function createDisplaySpell(overrides: Partial<DisplaySpell> = {}): DisplaySpell {
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
    canToggle: true,
    ...overrides,
  };
}

function createMockHookResult(overrides: Partial<UseSpellPreparationResult> = {}): UseSpellPreparationResult {
  return {
    canPrepare: false,
    displaySpells: new Map(),
    preparedCount: 0,
    preparedMax: 0,
    quotaColor: 'green',
    atLimit: false,
    isLoading: false,
    togglePrepare: vi.fn(),
    warningMessage: null,
    ...overrides,
  };
}

function createMockWizardSpellbookResult(
  overrides: Partial<ReturnType<typeof useWizardSpellbook>> = {}
): ReturnType<typeof useWizardSpellbook> {
  return {
    isWizard: true,
    spellbookSpells: [],
    spellbookCount: 0,
    spellbookMax: 9,
    nearCap: false,
    availableToAdd: [],
    isLoading: false,
    addSpell: vi.fn(),
    removeSpell: vi.fn(),
    ...overrides,
  };
}

function setupNonPreparedHook(spells: CharacterSpell[]): void {
  mockUseSpellPreparation.mockReturnValue(
    createMockHookResult({
      canPrepare: false,
      displaySpells: groupSpellsByLevel(
        spells.map(s => ({ ...s, canToggle: false }) as DisplaySpell)
      ) as Map<number, DisplaySpell[]>,
    })
  );
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
    setupNonPreparedHook([]);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('No spells recorded for this character.')).toBeInTheDocument();
  });

  it('renders sticky headers for each level present', () => {
    const spells = [
      createCharacterSpell({ name: 'Light', level: 0 }),
      createCharacterSpell({ name: 'Magic Missile', level: 1 }),
    ];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Cantrips')).toBeInTheDocument();
    expect(screen.getByText('1st Level')).toBeInTheDocument();
  });

  it('renders correct count in header badge', () => {
    const spells = [
      createCharacterSpell({ name: 'Light', level: 0 }),
      createCharacterSpell({ name: 'Mage Hand', level: 0 }),
      createCharacterSpell({ name: 'Magic Missile', level: 1 }),
    ];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not render levels with zero spells', () => {
    const spells = [createCharacterSpell({ name: 'Light', level: 0 })];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.queryByText('1st Level')).not.toBeInTheDocument();
    expect(screen.queryByText('2nd Level')).not.toBeInTheDocument();
  });
});

describe('SpellsPanel row content', () => {
  it('shows spell name and school badge', () => {
    const spells = [createCharacterSpell({ name: 'Magic Missile', school: 'Evocation' })];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Magic Missile')).toBeInTheDocument();
    expect(screen.getByText('Evocation')).toBeInTheDocument();
  });

  it('shows concentration indicator only when concentration is true', () => {
    const spells = [
      createCharacterSpell({ name: 'Shield', concentration: false }),
      createCharacterSpell({ name: 'Hold Person', concentration: true }),
    ];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Shield');
    expect(rows[1]).toHaveTextContent('Hold Person');
    expect(screen.getByLabelText('Concentration')).toBeInTheDocument();
  });

  it('shows ritual indicator only when ritual is true', () => {
    const spells = [
      createCharacterSpell({ name: 'Fireball', ritual: false }),
      createCharacterSpell({ name: 'Detect Magic', ritual: true }),
    ];
    const character = baseCharacter({ spells });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Fireball');
    expect(rows[1]).toHaveTextContent('Detect Magic');
    expect(screen.getByLabelText('Ritual')).toBeInTheDocument();
  });
});

describe('SpellsPanel quota bar (prepared casters)', () => {
  it('renders quota bar with correct prepared count and max', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [0, [createDisplaySpell({ name: 'Sacred Flame', level: 0, prepared: true, canToggle: false })]],
      [1, [
        createDisplaySpell({ id: 1, name: 'Bless', level: 1, prepared: true, canToggle: true }),
        createDisplaySpell({ id: 2, name: 'Cure Wounds', level: 1, prepared: false, canToggle: true }),
      ]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedCount: 1,
      preparedMax: 4,
      quotaColor: 'green',
    }));

    const character = baseCharacter({
      classes: [{ className: 'Cleric', level: 1 }],
    });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Prepared 1 / 4')).toBeInTheDocument();
  });

  it('does not render quota bar for non-prepared casters', () => {
    const spells = [createCharacterSpell({ name: 'Magic Missile', level: 1, prepared: true })];
    const character = baseCharacter({
      classes: [{ className: 'Bard', level: 5 }],
      spells,
    });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.queryByText(/Prepared/)).not.toBeInTheDocument();
  });

  it('renders progress bar with green color when under 75%', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [1, [createDisplaySpell({ id: 1, name: 'Bless', level: 1, prepared: true, canToggle: true })]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedCount: 1,
      preparedMax: 4,
      quotaColor: 'green',
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows warning message when at limit and attempting to prepare', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [1, [createDisplaySpell({ id: 1, name: 'Bless', level: 1, prepared: true, canToggle: true })]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedCount: 2,
      preparedMax: 2,
      quotaColor: 'amber',
      atLimit: true,
      warningMessage: 'At preparation limit',
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('At preparation limit')).toBeInTheDocument();
  });
});

describe('SpellsPanel toggle controls', () => {
  it('renders switch toggle on non-cantrip rows for prepared casters', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [0, [createDisplaySpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true, canToggle: false })]],
      [1, [createDisplaySpell({ id: 2, name: 'Bless', level: 1, prepared: false, canToggle: true })]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedMax: 4,
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    // Should have exactly one switch (for Bless, not Sacred Flame)
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(1);
  });

  it('does not render switch on cantrip rows', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [0, [createDisplaySpell({ id: 1, name: 'Sacred Flame', level: 0, prepared: true, canToggle: false })]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedMax: 4,
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('calls togglePrepare when switch is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    const displaySpells = new Map<number, DisplaySpell[]>([
      [1, [createDisplaySpell({ name: 'Bless', level: 1, prepared: false, canToggle: true })]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedMax: 4,
      togglePrepare: mockToggle,
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);

    expect(mockToggle).toHaveBeenCalledWith('Bless');
  });

  it('shows "Not in spellbook" for wizard spells that cannot be toggled', () => {
    const displaySpells = new Map<number, DisplaySpell[]>([
      [1, [
        createDisplaySpell({ id: 1, name: 'Magic Missile', level: 1, prepared: true, canToggle: true }),
        createDisplaySpell({ id: 2, name: 'Shield', level: 1, prepared: false, canToggle: false, toggleDisabledReason: 'Not in spellbook' }),
      ]],
    ]);

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells,
      preparedMax: 8,
    }));

    const character = baseCharacter({ classes: [{ className: 'Wizard', level: 5 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Not in spellbook')).toBeInTheDocument();
    // Only one switch (Magic Missile), Shield shows text instead
    expect(screen.getAllByRole('switch')).toHaveLength(1);
  });

  it('renders green checkmark for non-prepared casters instead of toggle', () => {
    const spells = [
      createCharacterSpell({ name: 'Magic Missile', level: 1, prepared: true }),
    ];
    const character = baseCharacter({
      classes: [{ className: 'Bard', level: 5 }],
      spells,
    });
    setupNonPreparedHook(spells);
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByLabelText('Prepared')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('renders loading state while fetching spells', () => {
    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      isLoading: true,
    }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByText('Loading spells...')).toBeInTheDocument();
  });
});

describe('SpellsPanel Wizard tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render tabs for non-Wizard characters', () => {
    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells: new Map([
        [1, [createDisplaySpell({ name: 'Bless', level: 1, prepared: true, canToggle: true })]],
      ]),
      preparedCount: 1,
      preparedMax: 4,
      quotaColor: 'green',
    }));
    mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult({ isWizard: false }));

    const character = baseCharacter({ classes: [{ className: 'Cleric', level: 1 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.queryByRole('tab', { name: /Prepare/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /Manage Book/i })).not.toBeInTheDocument();
    expect(screen.getByText('Prepared 1 / 4')).toBeInTheDocument();
  });

  it('renders Prepare and Manage Book tabs for Wizard characters', () => {
    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells: new Map([
        [1, [createDisplaySpell({ name: 'Magic Missile', level: 1, prepared: true, canToggle: true })]],
      ]),
      preparedCount: 1,
      preparedMax: 8,
      quotaColor: 'green',
    }));
    mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult());

    const character = baseCharacter({ classes: [{ className: 'Wizard', level: 5 }] });
    renderWithCharacter(<SpellsPanel />, character);

    expect(screen.getByRole('tab', { name: /Prepare/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Manage Book/i })).toBeInTheDocument();
  });

  it('default active tab is Prepare for Wizard characters', () => {
    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells: new Map([
        [1, [createDisplaySpell({ name: 'Magic Missile', level: 1, prepared: true, canToggle: true })]],
      ]),
      preparedCount: 1,
      preparedMax: 8,
      quotaColor: 'green',
    }));
    mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult());

    const character = baseCharacter({ classes: [{ className: 'Wizard', level: 5 }] });
    renderWithCharacter(<SpellsPanel />, character);

    const prepareTab = screen.getByRole('tab', { name: /Prepare/i });
    expect(prepareTab).toHaveAttribute('data-state', 'active');
  });

  it('clicking Manage Book tab shows the spellbook manager', async () => {
    const user = userEvent.setup();

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells: new Map([
        [1, [createDisplaySpell({ name: 'Magic Missile', level: 1, prepared: true, canToggle: true })]],
      ]),
      preparedCount: 1,
      preparedMax: 8,
      quotaColor: 'green',
    }));
    mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult({
      spellbookSpells: [createCharacterSpell({ id: 1, name: 'Shield', source: 'Class' })],
      spellbookCount: 1,
    }));

    const character = baseCharacter({ classes: [{ className: 'Wizard', level: 5 }] });
    renderWithCharacter(<SpellsPanel />, character);

    const manageTab = screen.getByRole('tab', { name: /Manage Book/i });
    await user.click(manageTab);

    expect(screen.getByText('Shield')).toBeInTheDocument();
  });

  it('clicking Prepare tab shows the spell list after switching', async () => {
    const user = userEvent.setup();

    mockUseSpellPreparation.mockReturnValue(createMockHookResult({
      canPrepare: true,
      displaySpells: new Map([
        [1, [createDisplaySpell({ name: 'Magic Missile', level: 1, prepared: true, canToggle: true })]],
      ]),
      preparedCount: 1,
      preparedMax: 8,
      quotaColor: 'green',
    }));
    mockUseWizardSpellbook.mockReturnValue(createMockWizardSpellbookResult({
      spellbookSpells: [createCharacterSpell({ id: 1, name: 'Shield', source: 'Class' })],
      spellbookCount: 1,
    }));

    const character = baseCharacter({ classes: [{ className: 'Wizard', level: 5 }] });
    renderWithCharacter(<SpellsPanel />, character);

    // Switch to Manage Book first
    const manageTab = screen.getByRole('tab', { name: /Manage Book/i });
    await user.click(manageTab);

    // Then switch back to Prepare
    const prepareTab = screen.getByRole('tab', { name: /Prepare/i });
    await user.click(prepareTab);

    expect(screen.getByText('Magic Missile')).toBeInTheDocument();
  });
});
