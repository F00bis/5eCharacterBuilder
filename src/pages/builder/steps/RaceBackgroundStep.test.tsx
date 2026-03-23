import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import RaceBackgroundStep, { isValidRaceStep } from './RaceBackgroundStep';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <CharacterBuilderProvider>
      {ui}
    </CharacterBuilderProvider>
  );
};

describe('isValidRaceStep', () => {
  it('returns false when race is missing', () => {
    expect(isValidRaceStep(undefined, 'Soldier', true, 'strength', 'charisma')).toBe(false);
  });

  it('returns false when background is missing', () => {
    expect(isValidRaceStep('Human', undefined, true, 'strength', 'charisma')).toBe(false);
  });

  it('returns true for traditional rules with race and background', () => {
    expect(isValidRaceStep('Human', 'Soldier', false, null, null)).toBe(true);
  });

  it('returns false for Tasha rules without both selections', () => {
    expect(isValidRaceStep('Human', 'Soldier', true, 'strength', null)).toBe(false);
    expect(isValidRaceStep('Human', 'Soldier', true, null, 'charisma')).toBe(false);
  });

  it('returns false for Tasha rules with same ability for both', () => {
    expect(isValidRaceStep('Human', 'Soldier', true, 'strength', 'strength')).toBe(false);
  });

  it('returns true for Tasha rules with different valid selections', () => {
    expect(isValidRaceStep('Human', 'Soldier', true, 'strength', 'charisma')).toBe(true);
  });
});

describe('RaceBackgroundStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders race and background selects', () => {
    renderWithProvider(<RaceBackgroundStep />);
    expect(screen.getByText('Select Race')).toBeTruthy();
    expect(screen.getByText('Select Background')).toBeTruthy();
  });

  it('shows stat allocation dropdowns when race is selected', async () => {
    renderWithProvider(<RaceBackgroundStep />);
    
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'human' } });
    
    expect(screen.getByText(/Ability Score Increases/)).toBeTruthy();
  });

  it('Tasha toggle exists and toggles', async () => {
    renderWithProvider(<RaceBackgroundStep />);
    
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'human' } });
    
    const checkbox = screen.getByRole('checkbox');
    expect((checkbox as HTMLInputElement).checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });
});
