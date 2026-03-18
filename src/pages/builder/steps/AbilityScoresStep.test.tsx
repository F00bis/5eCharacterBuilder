import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AbilityScoresStep from './AbilityScoresStep';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';

// Mock the dice roller so it's predictable
vi.mock('../../../utils/diceRoller', () => ({
  rollDice: vi.fn(() => 10), // always rolls 10 for simplicity in testing
}));

describe('AbilityScoresStep', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <CharacterBuilderProvider>
        <AbilityScoresStep />
      </CharacterBuilderProvider>
    );
  };

  it('renders standard array by default and allows assigning scores', () => {
    renderComponent();

    // Check tabs
    expect(screen.getByText('Standard Array')).toBeInTheDocument();
    expect(screen.getByText('Point Buy')).toBeInTheDocument();
    expect(screen.getByText('Manual Roll')).toBeInTheDocument();

    // Check standard array intro text
    expect(screen.getByText(/Assign the standard array values/)).toBeInTheDocument();

    // Check that we have selects for each ability
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(6);

    // Assign a value
    fireEvent.change(selects[0], { target: { value: '15' } });
    
    // The option "15" should no longer be available in the second select
    const secondSelectOptions = Array.from(selects[1].querySelectorAll('option')).map(o => o.value);
    expect(secondSelectOptions).not.toContain('15');
    expect(secondSelectOptions).toContain('14');
  });

  it('switches to point buy and handles points correctly', () => {
    renderComponent();

    // Switch to point buy tab
    fireEvent.click(screen.getByText('Point Buy'));
    expect(screen.getByText(/You have 27 points to spend/)).toBeInTheDocument();

    // Click the + button for strength (first one)
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]); // Increases from 8 to 9 (costs 1 point)

    // Check remaining points
    expect(screen.getByText('Points: 26 / 27')).toBeInTheDocument();
  });

  it('switches to manual roll and rolls dice', () => {
    renderComponent();

    // Switch to manual roll tab
    fireEvent.click(screen.getByText('Manual Roll'));
    
    // Click Roll Stats button
    fireEvent.click(screen.getByText('Roll Stats'));

    // Because we mocked rollDice to return 10, there should be six '10's displayed
    const tens = screen.getAllByText('10');
    expect(tens.length).toBeGreaterThanOrEqual(6); // 6 from the rolled boxes
  });
});
