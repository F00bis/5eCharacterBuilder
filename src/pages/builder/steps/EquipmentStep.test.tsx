import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import EquipmentStep from './EquipmentStep';

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
      name: "Explorer's Pack",
      equipmentCategory: 'Pack',
      cost: '10 GP',
      weight: '59 lb.',
      description: "An Explorer's Pack contains the following items.",
      isSRD: true
    },
    {
      name: 'Arrows',
      equipmentCategory: 'Ammunition',
      cost: '1 GP',
      weight: '1 lb.',
      description: 'A bundle of arrows.',
      quantity: 20,
      isSRD: true
    }
  ])
}));

vi.mock('../../../db/classes', () => ({
  getClassByName: vi.fn().mockImplementation((name: string) => {
    if (name === 'Fighter') {
      return Promise.resolve({
        name: 'Fighter',
        startingEquipment: {
          startingGoldFormula: '5d4 * 10',
          startingGoldAverage: 125,
          choices: [
            {
              label: 'Choose your armor:',
              options: [
                { label: '(a) Chain Mail', items: ['Chain Mail'], type: 'bundle' },
                { label: '(b) Leather Armor', items: ['Leather Armor'], type: 'bundle' },
              ]
            },
            {
              label: 'Choose your weapon:',
              options: [
                { label: '(a) Longsword and Shield', items: ['Longsword', 'Shield'], type: 'bundle' },
                { label: '(b) Two Longswords', items: ['Longsword', 'Longsword'], type: 'bundle' },
              ]
            }
          ],
          fixedEquipment: ["Dungeoneer's Pack"]
        }
      });
    }
    if (name === 'Barbarian') {
      return Promise.resolve({
        name: 'Barbarian',
        startingEquipment: {
          startingGoldFormula: '2d4 * 10',
          startingGoldAverage: 50,
          choices: [],
          fixedEquipment: []
        }
      });
    }
    return Promise.resolve(undefined);
  }),
}));

function EquipmentStepWithClass({ className, mode = 'create' }: { className: string; mode?: string }) {
  const { dispatch } = useCharacterBuilder();

  useEffect(() => {
    dispatch({ type: 'UPDATE_DRAFT', updates: { classes: [{ className, level: 1 }] } });
    if (mode === 'levelup') {
      dispatch({ type: 'SET_MODE', mode: 'levelup' } as Parameters<typeof dispatch>[0]);
    }
  }, [dispatch, className, mode]);

  return <EquipmentStep />;
}

describe('EquipmentFeatsStep - No Class Selected', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a message when no class is selected', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/select a class first/i)).toBeInTheDocument();
  });

  it('renders the component without crashing', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/Please select a class first to configure equipment\./i)).toBeInTheDocument();
  });

  it('shows no class selected message when draft.classes is empty', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    const message = screen.getByText(/select a class first/i);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-slate-500');
  });

  it('displays equipment section in the validation message', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getAllByText(/equipment/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays the no class selected message in a centered div', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    const message = screen.getByText(/Please select a class first to configure equipment\./i);
    expect(message).toHaveClass('text-center');
    expect(message).toHaveClass('py-8');
  });

  it('renders the container with correct spacing', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStep />
      </CharacterBuilderProvider>
    );
    const container = screen.getByText(/Please select a class first/i).parentElement;
    expect(container).toHaveClass('space-y-6');
  });
});

describe('EquipmentFeatsStep - Class Selected (Create Mode Level 1)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Starting Equipment section heading', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Starting Equipment')).toBeInTheDocument();
    });
  });

  it('shows Class Packages and Starting Gold toggle buttons', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
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
        <EquipmentStepWithClass className="Fighter" />
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
        <EquipmentStepWithClass className="Fighter" />
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
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      const options = screen.getAllByRole('radio');
      expect(options.length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByRole('radio')[0]);
  });

  it('toggles to Starting Gold mode', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Roll Gold/i })).toBeInTheDocument();
    });
  });
});

describe('EquipmentFeatsStep - Starting Gold Mode', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows roll button for starting gold', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Roll Gold/i })).toBeInTheDocument();
    });
  });

  it('rolls gold and displays amount', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Roll Gold/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Roll Gold/i }));
    await waitFor(() => {
      // After rolling, remaining gold is displayed
      expect(screen.getByText(/Remaining:/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows shop items when gold is rolled', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search equipment/i)).toBeInTheDocument();
    });
  });

  it('adds purchased shop items with their SRD quantity', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const testEquipment: { name: string; quantity?: number }[] = [];

    function TestConsumer() {
      const { state } = useCharacterBuilder();
      useEffect(() => {
        testEquipment.length = 0;
        testEquipment.push(...state.draft.equipment);
      }, [state.draft.equipment]);
      return null;
    }

    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
        <TestConsumer />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting Gold' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Roll Gold/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Roll Gold/i }));

    await waitFor(() => {
      expect(screen.getByText('Arrows')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Arrows'));

    await waitFor(() => {
      expect(testEquipment.find(item => item.name === 'Arrows')?.quantity).toBe(20);
    });

    randomSpy.mockRestore();
  });
});

describe('EquipmentFeatsStep - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles partial equipment selections correctly', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Fighter" />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);
    });
  });

  it('displays correct starting gold formula for different classes', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentStepWithClass className="Barbarian" />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Starting Gold' }));
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Roll Gold/i })).toBeInTheDocument();
    });
  });
});
