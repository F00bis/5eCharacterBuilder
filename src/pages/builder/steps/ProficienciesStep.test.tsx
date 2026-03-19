import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ProficienciesStep from './ProficienciesStep';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';

describe('ProficienciesStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <CharacterBuilderProvider>
        <ProficienciesStep />
      </CharacterBuilderProvider>
    );
  };

  it('renders a class selection dropdown', () => {
    renderComponent();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('-- Choose a Class --')).toBeInTheDocument();
  });

  it('shows message when no class is selected', () => {
    renderComponent();
    expect(screen.getByText(/no class selected/i)).toBeInTheDocument();
  });

  it('shows expertise section for Rogue class', async () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Rogue' } });
    });
    
    expect(screen.getByRole('heading', { name: /expertise/i })).toBeInTheDocument();
  });

  it('does not show expertise section for Fighter class', async () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    expect(screen.queryByText(/expertise/i)).not.toBeInTheDocument();
  });

  it('shows validation summary', async () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    expect(screen.getByText(/selection summary/i)).toBeInTheDocument();
  });

  it('shows class skill options after selection', async () => {
    renderComponent();
    
    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: 'Fighter' } });
    });
    
    expect(screen.getByText(/choose 2 skills/i)).toBeInTheDocument();
  });
});
