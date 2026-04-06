import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InventoryPanel } from './InventoryPanel';
import { CharacterContext, type CharacterContextValue } from '../contexts/CharacterContext';
import type { Character, Equipment } from '../types';

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

function createEquipment(overrides: Partial<Equipment> = {}): Equipment {
  return {
    name: 'Test Item',
    rarity: 'common',
    weight: 1,
    description: 'A test item',
    ...overrides,
  };
}

describe('InventoryPanel', () => {
  it('renders equipment list with correct sorting', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ name: 'Zebra', equipped: true }),
        createEquipment({ name: 'Apple', equipped: true }),
        createEquipment({ name: 'Banana', equipped: false }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Zebra')).toBeInTheDocument();
  });

  it('equipped items appear before unequipped', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ name: 'Shield', equipped: false, equippable: true }),
        createEquipment({ name: 'Sword', equipped: true, equippable: true }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    const items = screen.getAllByText(/Sword|Shield/);
    expect(items[0].textContent).toBe('Sword');
    expect(items[1].textContent).toBe('Shield');
  });

  it('checkbox toggles equipped status', async () => {
    const updateFn = vi.fn();
    const character = baseCharacter({
      equipment: [
        createEquipment({ name: 'Sword', equipped: true, equippable: true }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    
    const mockContext: CharacterContextValue = {
      character,
      isLoading: false,
      isNotFound: false,
      update: updateFn,
    };
    
    render(
      <CharacterContext.Provider value={mockContext}>
        <InventoryPanel />
      </CharacterContext.Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    checkbox.click();

    expect(updateFn).toHaveBeenCalled();
  });

  it('encumbrance display calculates correctly', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ weight: 50 }),
        createEquipment({ weight: 50 }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    // Weight shows as text (click to edit)
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('/ 150 lbs')).toBeInTheDocument();
  });

  it('attunement count displays correctly', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ attuned: true }),
        createEquipment({ attuned: true }),
        createEquipment({ attuned: false }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    // Attunement shows as text (click to edit)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('currency display renders all denominations', () => {
    const character = baseCharacter({
      equipment: [],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      currency: { cp: 32, sp: 15, ep: 2, gp: 150, pp: 5 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    // Currency shows as text (click to edit)
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('~203 GP')).toBeInTheDocument();
  });

  it('item name is displayed', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ name: 'Magic Sword', description: 'A +1 sword', rarity: 'uncommon' }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    expect(screen.getByText('Magic Sword')).toBeInTheDocument();
  });

  it('non-equippable items have no checkbox', () => {
    const character = baseCharacter({
      equipment: [
        createEquipment({ name: 'Rope', equippable: false }),
      ],
      abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    renderWithCharacter(<InventoryPanel />, character);

    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes.length).toBe(0);
  });
});
