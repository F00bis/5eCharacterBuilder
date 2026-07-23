import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ClassSelectionStep from './ClassSelectionStep';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';

function DraftStateProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="draft-state">{JSON.stringify(state.draft)}</pre>;
}

describe('ClassSelectionStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <CharacterBuilderProvider>
        <ClassSelectionStep />
        <DraftStateProbe />
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

  it('describes Rogue Expertise without rendering a class-step choice', async () => {
    renderComponent();

    const classSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Rogue' } });
    });

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(1);
    expect(screen.getByText(/your proficiency bonus is doubled for any ability check/i)).toBeInTheDocument();
    expect(screen.queryByText(/Selected: Acrobatics/i)).not.toBeInTheDocument();
  });

  it('replaces class selection in create mode when switching classes', async () => {
    renderComponent();

    const classSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Warlock' } });
    });

    await act(async () => {
      fireEvent.change(classSelect, { target: { value: 'Fighter' } });
    });

    const draft = JSON.parse(screen.getByTestId('draft-state').textContent || '{}') as {
      classes?: Array<{ className: string; level: number }>;
    };

    expect(draft.classes).toEqual([{ className: 'Fighter', level: 1 }]);
  });
});
