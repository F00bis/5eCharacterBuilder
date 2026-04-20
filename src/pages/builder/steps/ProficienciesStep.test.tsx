import { render, screen, waitFor, within } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import type { SkillProficiency } from '../../../types';
import ProficienciesStep from './ProficienciesStep';

function ProficienciesStepWithSetup({
  className,
  initialSkills = [],
}: {
  className: string;
  initialSkills?: SkillProficiency[];
}) {
  const { dispatch } = useCharacterBuilder();
  const initialSkillsRef = useRef(initialSkills);
  
  useEffect(() => {
    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        classes: [{ className, level: 1 }],
        skills: initialSkillsRef.current,
      }
    });
  }, [dispatch, className]);

  return <ProficienciesStep />;
}

describe('ProficienciesStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders class context from draft state', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });

    expect(screen.getByText(/Class:/i)).toBeInTheDocument();
    expect(screen.getByText('Fighter')).toBeInTheDocument();
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
    
    expect(screen.queryByText(/expertise/i)).not.toBeInTheDocument();
  });

  it('does not show expertise section for Bard at level 1', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Bard" />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('heading', { name: /expertise/i })).not.toBeInTheDocument();
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

  it('shows race-sourced skills as already known and locked', async () => {
    render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup
          className="Fighter"
          initialSkills={[
            { skill: 'athletics', ability: 'strength', level: 'proficient', source: 'Race: Half-Elf' }
          ]}
        />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
    });

    const knownSkillsHeading = screen.getByText('Already Known Skills');
    expect(knownSkillsHeading).toBeInTheDocument();
    const knownSkillsContainer = knownSkillsHeading.closest('div');
    expect(knownSkillsContainer).not.toBeNull();
    expect(within(knownSkillsContainer as HTMLElement).getByText('Athletics')).toBeInTheDocument();
    expect(within(knownSkillsContainer as HTMLElement).getByText('R:')).toBeInTheDocument();

    const athleticsButton = screen.getByRole('button', { name: /Athletics/ });
    expect(athleticsButton).toHaveAttribute('data-state', 'selected');
    expect(within(athleticsButton).getByText('R')).toBeInTheDocument();
  });

  it('updates available proficiencies when class changes', async () => {
    const view = render(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Warlock" />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proficiencies & Skills' })).toBeInTheDocument();
      expect(screen.getAllByText(/Arcana/).length).toBeGreaterThan(0);
    });

    view.rerender(
      <CharacterBuilderProvider>
        <ProficienciesStepWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText(/Arcana/)).toHaveLength(0);
      expect(screen.getAllByText(/Athletics/).length).toBeGreaterThan(0);
    });
  });
});
