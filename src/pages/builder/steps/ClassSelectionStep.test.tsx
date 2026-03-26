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
});
