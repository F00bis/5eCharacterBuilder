import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import ReviewStep from './ReviewStep';

vi.mock('../../../db/characters', () => ({
  addCharacter: vi.fn().mockResolvedValue(1),
  updateCharacter: vi.fn().mockResolvedValue(1),
}));

describe('ReviewStep', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CharacterBuilderProvider>
          <ReviewStep />
        </CharacterBuilderProvider>
      </BrowserRouter>
    );
  };

  it('renders name input in create mode', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Character Name');
    expect(input).toBeInTheDocument();
  });

  it('displays level and race subtitle', () => {
    renderComponent();
    expect(screen.getByText(/Level \d+/)).toBeInTheDocument();
  });

  it('shows 6 ability score badges with modifiers', () => {
    renderComponent();
    const badges = screen.getAllByText(/^(str|dex|con|int|wis|cha)$/);
    expect(badges.length).toBe(6);
  });

  it('shows maxHP and AC stats', () => {
    renderComponent();
    expect(screen.getByText('Max HP')).toBeInTheDocument();
    expect(screen.getByText('Armor Class')).toBeInTheDocument();
  });

  it('shows acquisitions summary section', () => {
    renderComponent();
    expect(screen.getByText('This Session')).toBeInTheDocument();
  });

  it('finish button disabled when name is empty', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /save character/i });
    expect(button).toBeDisabled();
  });

  it('finish button enabled when name is filled', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Character Name');
    fireEvent.change(input, { target: { value: 'Gandalf' } });
    const button = screen.getByRole('button', { name: /save character/i });
    expect(button).toBeEnabled();
  });

  it('button text reflects mode', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /save character/i })).toBeInTheDocument();
  });

  it('displays equipment quantities in the session summary', async () => {
    function SetupEquipment() {
      const { dispatch } = useCharacterBuilder();

      useEffect(() => {
        dispatch({
          type: 'UPDATE_DRAFT',
          updates: {
            equipment: [
              {
                name: 'Arrows',
                rarity: 'common',
                weight: 1,
                description: 'A bundle of arrows.',
                quantity: 20,
              },
            ],
          },
        });
      }, [dispatch]);

      return null;
    }

    render(
      <BrowserRouter>
        <CharacterBuilderProvider>
          <SetupEquipment />
          <ReviewStep />
        </CharacterBuilderProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Arrows x20')).toBeInTheDocument();
    });
  });
});
