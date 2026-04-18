import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CharacterBuilderProvider } from '../contexts/CharacterBuilderProvider';
import { useCharacterBuilder } from '../contexts/CharacterBuilderContextTypes';
import CharacterCreator from './CharacterCreator';
import { useEffect } from 'react';

// Simple mock components for Stepper and internal steps to be implemented later
vi.mock('../components/ui/stepper', () => ({
  default: ({ steps }: { steps: Array<{ id: string; label: string }> }) => (
    <div data-testid="mock-stepper">{steps.map(step => step.label).join(' | ')}</div>
  )
}));

vi.mock('../db/classes', () => ({
  getAllClasses: vi.fn().mockResolvedValue([]),
  getClassByName: vi.fn().mockResolvedValue(undefined),
  getClassNames: vi.fn().mockResolvedValue([]),
  getAsiLevelsByClass: vi.fn().mockResolvedValue({}),
}));

describe('CharacterCreator', () => {
  function SetupClasses({ classes }: { classes: Array<{ className: string; level: number }> }) {
    const { dispatch } = useCharacterBuilder();

    useEffect(() => {
      dispatch({ type: 'UPDATE_DRAFT', updates: { classes } });
    }, [classes, dispatch]);

    return null;
  }

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

  it('removes spells step when switching from caster to non-caster class', () => {
    const firstRender = render(
      <MemoryRouter initialEntries={['/characters/new']}>
        <CharacterBuilderProvider>
          <SetupClasses classes={[{ className: 'Warlock', level: 1 }]} />
          <Routes>
            <Route path="/characters/new" element={<CharacterCreator mode="create" />} />
          </Routes>
        </CharacterBuilderProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-stepper')).toHaveTextContent('Spells');

    firstRender.unmount();

    render(
      <MemoryRouter initialEntries={['/characters/new']}>
        <CharacterBuilderProvider>
          <SetupClasses classes={[{ className: 'Fighter', level: 1 }]} />
          <Routes>
            <Route path="/characters/new" element={<CharacterCreator mode="create" />} />
          </Routes>
        </CharacterBuilderProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-stepper')).not.toHaveTextContent('Spells');
  });
});
