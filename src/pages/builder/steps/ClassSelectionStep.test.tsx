import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ClassSelectionStep from './ClassSelectionStep';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';

describe('ClassSelectionStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <CharacterBuilderProvider>
        <ClassSelectionStep />
      </CharacterBuilderProvider>
    );
  };

  it('renders a dropdown for class selection', () => {
    renderComponent();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('-- Choose a Class --')).toBeInTheDocument();
  });

  it('shows class summary and HP info when a class is selected', async () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    expect(screen.getAllByText('Fighter').length).toBeGreaterThan(0);
    expect(screen.getByText('d10')).toBeInTheDocument();
    expect(screen.getByText(/Hit Points at Level 1/)).toBeInTheDocument();
    expect(screen.getByText(/At 1st level/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Fighting Style/).length).toBeGreaterThan(0);
    expect(screen.getByText('Class Feature Choices')).toBeInTheDocument();
  });

  it('allows selecting a feature choice', async () => {
    renderComponent();
    
    const classSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Fighter' } });
    });
    
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);
    
    await act(async () => {
      fireEvent.change(selects[1], { target: { value: 'Archery' } });
    });
    
    expect((selects[1] as HTMLSelectElement).value).toBe('Archery');
  });

  it('shows selected choice details in class summary', async () => {
    renderComponent();

    const classSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Fighter' } });
    });

    const selects = screen.getAllByRole('combobox');
    await act(async () => {
      fireEvent.change(selects[1], { target: { value: 'Archery' } });
    });

    expect(screen.getByText('Selected: Archery')).toBeInTheDocument();
    expect(screen.getAllByText(/\+2 bonus to attack rolls you make with ranged weapons/i).length).toBeGreaterThan(0);
  });

  it('supports multi-select level 1 features and shows both selected details', async () => {
    renderComponent();

    const classSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Rogue' } });
    });

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);

    await act(async () => {
      fireEvent.change(selects[1], { target: { value: 'acrobatics' } });
    });

    const updatedSelects = screen.getAllByRole('combobox');
    await act(async () => {
      fireEvent.change(updatedSelects[1], { target: { value: 'stealth' } });
    });

    expect(screen.getByText('Selected: Acrobatics, Stealth')).toBeInTheDocument();
    expect(screen.getAllByText(/your proficiency bonus is doubled for ability checks you make using Acrobatics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/your proficiency bonus is doubled for ability checks you make using Stealth/i).length).toBeGreaterThan(0);
  });
});
