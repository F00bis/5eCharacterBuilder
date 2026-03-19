import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterBuilderState } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import EquipmentFeatsStep from './EquipmentFeatsStep';

vi.mock('../../../db/equipment', () => ({
  getAllEquipment: vi.fn().mockResolvedValue([
    {
      name: 'Longsword',
      equipmentCategory: 'Weapon',
      weaponCategory: 'Martial Melee',
      cost: '15 GP',
      weight: '3 lb.',
      damage: '1d8 Slashing',
      properties: ['Versatile'],
      description: 'A versatile martial weapon.',
      isSRD: true
    },
    {
      name: 'Chain Mail',
      equipmentCategory: 'Armor',
      armorCategory: 'Heavy',
      cost: '75 GP',
      weight: '55 lb.',
      armorClass: '18',
      stealthDisadvantage: true,
      description: 'Heavy armor made of interlocking metal rings.',
      isSRD: true
    },
    {
      name: 'Shield',
      equipmentCategory: 'Armor',
      armorCategory: 'Shield',
      cost: '10 GP',
      weight: '6 lb.',
      armorClass: '+2',
      description: 'A wooden or metal shield.',
      isSRD: true
    },
    {
      name: 'Leather Armor',
      equipmentCategory: 'Armor',
      armorCategory: 'Light',
      cost: '10 GP',
      weight: '10 lb.',
      armorClass: '11',
      description: 'Light armor made of leather.',
      isSRD: true
    },
    {
      name: 'Explorer\'s Pack',
      equipmentCategory: 'Pack',
      cost: '10 GP',
      weight: '59 lb.',
      description: 'An Explorer\'s Pack contains the following items: Backpack, Bedroll, 2 flasks of Oil, 10 days of Rations, Rope, Tinderbox, 10 Torches, and Waterskin.',
      isSRD: true
    }
  ])
}));

function renderWithInitialState(initialState: Partial<CharacterBuilderState>) {
  localStorage.setItem('builderDraft_v1', JSON.stringify({
    draft: {
      classes: [],
      baseAbilityScores: {
        strength: 15, dexterity: 10, constitution: 14,
        intelligence: 10, wisdom: 10, charisma: 10
      }
    },
    currentStep: 0,
    mode: 'create',
    baseCharacterId: null,
    asiChoices: [],
    ...initialState
  }));
}

describe('EquipmentFeatsStep - No Class Selected', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a message when no class is selected', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/select a class first/i)).toBeInTheDocument();
  });

  it('renders the component without crashing', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/Please select a class first to configure equipment and feats/i)).toBeInTheDocument();
  });

  it('shows no class selected message when draft.classes is empty', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    const message = screen.getByText(/select a class first/i);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-slate-500');
  });

  it('displays equipment section in the validation message', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/equipment/i)).toBeInTheDocument();
  });

  it('displays the no class selected message in a centered div', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    const message = screen.getByText(/Please select a class first to configure equipment and feats/i);
    expect(message).toHaveClass('text-center');
    expect(message).toHaveClass('py-8');
  });

  it('renders the container with correct spacing', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    const container = screen.getByText(/Please select a class first/i).parentElement;
    expect(container).toHaveClass('space-y-6');
  });
});

describe('EquipmentFeatsStep - Class Selected (Create Mode Level 1)', () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Fighter', level: 1 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'create'
    });
  });

  it('shows Starting Equipment section heading', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Starting Equipment')).toBeInTheDocument();
    });
  });

  it('shows Class Packages and Starting Gold toggle buttons', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Class Packages' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
  });

  it('shows Fighter equipment choices by default in packages mode', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Choose your armor/i)).toBeInTheDocument();
      expect(screen.getByText(/Choose your weapon/i)).toBeInTheDocument();
    });
  });

  it('shows fixed equipment list', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Fixed Equipment/i)).toBeInTheDocument();
      expect(screen.getByText(/Dungeoneer/i)).toBeInTheDocument();
    });
  });

  it('allows selecting an equipment option', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      const options = screen.getAllByRole('radio');
      expect(options.length).toBeGreaterThan(0);
      fireEvent.click(options[0]);
    });
  });

  it('toggles to Starting Gold mode', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByText(/Roll Starting Gold/i)).toBeInTheDocument();
    });
  });

  it('shows validation incomplete before selections', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Please complete all selections/i)).toBeInTheDocument();
    });
  });
});

describe('EquipmentFeatsStep - Starting Gold Mode', () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Fighter', level: 1 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'create'
    });
  });

  it('shows roll button for starting gold', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByText(/Roll Starting Gold/i)).toBeInTheDocument();
    });
  });

  it('rolls gold and displays amount', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByText(/Starting Gold Formula: 5d4/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /roll starting gold/i }));
    await waitFor(() => {
      const container = document.querySelector('.text-green-600');
      expect(container).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows shop filters when gold is rolled', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByText(/Starting Gold Formula: 5d4/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /roll starting gold/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Weapons' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Armor' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Gear' })).toBeInTheDocument();
    });
  });
});

describe('EquipmentFeatsStep - ASI Level (Levelup Mode)', () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Fighter', level: 4 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'levelup'
    });
  });

  it('shows ASI section when leveling to ASI level', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Choose to increase your ability scores/i)).toBeInTheDocument();
    });
  });

  it('shows level indicator in ASI section', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Level 4/i)).toBeInTheDocument();
    });
  });

  it('shows ASI and Feat toggle buttons', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ability Score Improvement' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Choose a Feat' })).toBeInTheDocument();
    });
  });

  it('shows increase type selector in ASI mode', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/First Increase/i)).toBeInTheDocument();
      expect(screen.getByText(/Increase Type/i)).toBeInTheDocument();
    });
  });

  it('displays ASI/Feat section when in levelup mode with pending class', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Choose a Feat/i)).toBeInTheDocument();
    });
  });
});

describe('EquipmentFeatsStep - Validation States', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows complete status after making valid selections', async () => {
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Fighter', level: 1 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'create'
    });

    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      fireEvent.click(radioButtons[radioButtons.length - 1]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Ready to proceed/i)).toBeInTheDocument();
    });
  });
});

describe('EquipmentFeatsStep - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles partial equipment selections correctly', async () => {
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Fighter', level: 1 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'create'
    });

    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(screen.getByText(/Please complete all selections/i)).toBeInTheDocument();
    });
  });

  it('displays correct starting gold formula for different classes', async () => {
    renderWithInitialState({
      draft: {
        classes: [{ className: 'Barbarian', level: 1 }],
        baseAbilityScores: {
          strength: 15, dexterity: 10, constitution: 14,
          intelligence: 10, wisdom: 10, charisma: 10
        }
      },
      mode: 'create'
    });

    render(
      <CharacterBuilderProvider>
        <EquipmentFeatsStep />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    });
    await waitFor(() => {
      expect(screen.getByText(/2d4 \* 10/i)).toBeInTheDocument();
    });
  });
});
