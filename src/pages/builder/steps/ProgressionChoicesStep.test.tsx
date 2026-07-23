import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import type { SkillProficiency } from '../../../types';
import ProgressionChoicesStep from './ProgressionChoicesStep';

function SetupState({
  classes,
  skills,
}: {
  classes: { className: string; level: number }[];
  skills: SkillProficiency[];
}) {
  const { dispatch } = useCharacterBuilder();

  useEffect(() => {
    dispatch({ type: 'UPDATE_DRAFT', updates: { classes, skills } });
  }, [classes, dispatch, skills]);

  return null;
}

function StateProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="state-probe">{JSON.stringify({
    expertiseChoices: state.expertiseChoices,
    isValid: state.stepValidations['progression-choices'],
  })}</pre>;
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
            { skill: 'insight', ability: 'wisdom', level: 'proficient', source: 'Race: Half-Elf' },
          ]}
        />
        <ProgressionChoicesStep />
        <StateProbe />
      </CharacterBuilderProvider>
    );

    expect(await screen.findByText(/Expertise \(Rogue 1\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stealth' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perception' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stealth' }));
    fireEvent.click(screen.getByRole('button', { name: 'Perception' }));

    await waitFor(() => {
      const state = JSON.parse(screen.getByTestId('state-probe').textContent || '{}');
      expect(state.expertiseChoices['expertise:0:rogue:1']).toEqual(['stealth', 'perception']);
      expect(state.isValid).toBe(true);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Insight' }));
    await waitFor(() => {
      const state = JSON.parse(screen.getByTestId('state-probe').textContent || '{}');
      expect(state.expertiseChoices['expertise:0:rogue:1']).toEqual(['stealth', 'perception']);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Stealth' }));
    await waitFor(() => {
      const state = JSON.parse(screen.getByTestId('state-probe').textContent || '{}');
      expect(state.expertiseChoices['expertise:0:rogue:1']).toEqual(['perception']);
      expect(state.isValid).toBe(false);
    });
  });

  it('supports Bard expertise through the same progression flow', async () => {
    render(
      <CharacterBuilderProvider>
        <SetupState
          classes={[{ className: 'Bard', level: 3 }]}
          skills={[
            { skill: 'stealth', ability: 'dexterity', level: 'proficient', source: 'Class: Bard' },
            { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Background' },
          ]}
        />
        <ProgressionChoicesStep />
      </CharacterBuilderProvider>
    );

    expect(await screen.findByText(/Expertise \(Bard 3\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stealth' })).toBeInTheDocument();
  });

  it('prevents the same skill from satisfying multiple expertise entitlements', async () => {
    render(
      <CharacterBuilderProvider>
        <SetupState
          classes={[{ className: 'Bard', level: 3 }, { className: 'Rogue', level: 1 }]}
          skills={[
            { skill: 'stealth', ability: 'dexterity', level: 'proficient', source: 'Class: Bard' },
            { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Background' },
          ]}
        />
        <ProgressionChoicesStep />
      </CharacterBuilderProvider>
    );

    const bardSection = (await screen.findByText(/Expertise \(Bard 3\)/i)).closest('section');
    const rogueSection = screen.getByText(/Expertise \(Rogue 1\)/i).closest('section');
    expect(bardSection).not.toBeNull();
    expect(rogueSection).not.toBeNull();

    fireEvent.click(within(bardSection as HTMLElement).getByRole('button', { name: 'Stealth' }));

    await waitFor(() => {
      expect(within(rogueSection as HTMLElement).getByRole('button', { name: 'Stealth' })).toBeDisabled();
    });
  });

  it('does not offer a skill that already has expertise', async () => {
    render(
      <CharacterBuilderProvider>
        <SetupState
          classes={[{ className: 'Rogue', level: 6 }]}
          skills={[
            { skill: 'stealth', ability: 'dexterity', level: 'expertise', source: 'Class: Rogue' },
            { skill: 'perception', ability: 'wisdom', level: 'proficient', source: 'Background' },
          ]}
        />
        <ProgressionChoicesStep />
      </CharacterBuilderProvider>
    );

    expect(await screen.findByText(/Expertise \(Rogue 6\)/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Stealth' })).not.toBeInTheDocument();
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
