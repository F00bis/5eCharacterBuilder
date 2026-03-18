import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CharacterCreator from './CharacterCreator';
import { CharacterBuilderProvider } from '../contexts/CharacterBuilderProvider';

// Simple mock components for Stepper and internal steps to be implemented later
vi.mock('../components/ui/stepper', () => ({
  default: () => <div data-testid="mock-stepper">Stepper</div>
}));

describe('CharacterCreator', () => {
  it('renders in create mode and initializes context correctly', () => {
    render(
      <MemoryRouter initialEntries={['/characters/new']}>
        <CharacterBuilderProvider>
          <Routes>
            <Route path="/characters/new" element={<CharacterCreator mode="create" />} />
          </Routes>
        </CharacterBuilderProvider>
      </MemoryRouter>
    );

    // It should render a title reflecting create mode
    expect(screen.getByText(/Create a Character/i)).toBeInTheDocument();
  });

  it('renders in levelup mode and initializes context correctly', () => {
    render(
      <MemoryRouter initialEntries={['/characters/1/level-up']}>
        <CharacterBuilderProvider>
          <Routes>
            <Route path="/characters/:characterId/level-up" element={<CharacterCreator mode="levelup" />} />
          </Routes>
        </CharacterBuilderProvider>
      </MemoryRouter>
    );

    // It should render a title reflecting level-up mode
    expect(screen.getByText(/Level Up Character/i)).toBeInTheDocument();
  });
});
