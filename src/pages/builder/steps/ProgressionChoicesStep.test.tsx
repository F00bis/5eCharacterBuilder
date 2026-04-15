import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import ProgressionChoicesStep from './ProgressionChoicesStep';

function SetupState({
  classes,
  skills,
}: {
  classes: { className: string; level: number }[];
  skills: { skill: 'stealth' | 'perception'; ability: 'dexterity' | 'wisdom'; level: 'proficient'; source: string }[];
}) {
  const { dispatch } = useCharacterBuilder();

  useEffect(() => {
    dispatch({ type: 'UPDATE_DRAFT', updates: { classes, skills } });
  }, [classes, dispatch, skills]);

  return null;
}

describe('ProgressionChoicesStep', () => {
  it('renders expertise choices when rogue gains level 1 expertise', async () => {
    render(
      <CharacterBuilderProvider>
        <SetupState
          classes={[{ className: 'Rogue', level: 1 }]}
          skills={[
            { skill: 'stealth', ability: 'dexterity', level: 'proficient', source: 'Class: Rogue' },
            { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Background' },
          ]}
        />
        <ProgressionChoicesStep />
      </CharacterBuilderProvider>
    );

    expect(await screen.findByText(/Expertise \(Rogue 1\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stealth' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perception' })).toBeInTheDocument();
  });

  it('renders mystic arcanum selector at warlock 11', async () => {
    render(
      <CharacterBuilderProvider>
        <SetupState classes={[{ className: 'Warlock', level: 11 }]} skills={[]} />
        <ProgressionChoicesStep />
      </CharacterBuilderProvider>
    );

    expect(await screen.findByText(/Mystic Arcanum \(Warlock 11\)/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
