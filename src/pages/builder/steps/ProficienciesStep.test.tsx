import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ProficienciesStep from './ProficienciesStep';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { useEffect, useState } from 'react';

function ProficienciesStepWithSetup({ className }: { className: string }) {
  const { dispatch } = useCharacterBuilder();
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    dispatch({ type: 'UPDATE_DRAFT', updates: { classes: [{ className, level: 1 }] } });
    setReady(true);
  }, [dispatch, className]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return <ProficienciesStep />;
}

describe('ProficienciesStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a class selection dropdown', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });
    
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('shows message when no class is selected', () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStep />
      </CharacterBuilderProvider>
    );
    expect(screen.getByText(/Please complete the Class step first/i)).toBeInTheDocument();
  });

  it('shows expertise section for Rogue class', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Rogue" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });
    
    const select = screen.getAllByRole('combobox')[0];
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Rogue' } });
    });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /expertise/i })).toBeInTheDocument();
    });
  });

  it('does not show expertise section for Fighter class', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });
    
    const select = screen.getAllByRole('combobox')[0];
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    expect(screen.queryByText(/expertise/i)).not.toBeInTheDocument();
  });

  it('shows validation summary', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });
    
    const select = screen.getAllByRole('combobox')[0];
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/selection summary/i)).toBeInTheDocument();
    });
  });

  it('shows class skill options after selection', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/choose \d+ skill/i)).toBeInTheDocument();
    });
  });
});
