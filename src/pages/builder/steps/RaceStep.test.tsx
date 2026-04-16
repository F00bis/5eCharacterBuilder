import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import type { SkillProficiency } from '../../../types';
import RaceStep from './RaceStep';

function DraftSkillsProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="draft-skills">{JSON.stringify(state.draft.skills || [])}</pre>;
}

function getDraftSkills(): SkillProficiency[] {
  const raw = screen.getByTestId('draft-skills').textContent || '[]';
  return JSON.parse(raw) as SkillProficiency[];
}

describe('RaceStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('syncs selected racial skills into draft skills', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
        <DraftSkillsProbe />
      </CharacterBuilderProvider>
    );

    const raceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(raceSelect, { target: { value: 'half-elf' } });

    const skillChoiceLabel = await screen.findByText('Choose 2 Skills');
    const skillChoiceContainer = skillChoiceLabel.closest('div');
    expect(skillChoiceContainer).not.toBeNull();

    const firstSkillSelect = within(skillChoiceContainer as HTMLElement).getByRole('combobox');
    fireEvent.change(firstSkillSelect, { target: { value: 'athletics' } });

    const secondSkillSelect = within(skillChoiceContainer as HTMLElement).getByRole('combobox');
    fireEvent.change(secondSkillSelect, { target: { value: 'acrobatics' } });

    await waitFor(() => {
      expect(getDraftSkills()).toEqual(
        expect.arrayContaining([
          {
            skill: 'athletics',
            ability: 'strength',
            level: 'proficient',
            source: 'Race: Half-Elf',
          },
          {
            skill: 'acrobatics',
            ability: 'dexterity',
            level: 'proficient',
            source: 'Race: Half-Elf',
          },
        ])
      );
    });
  });

  it('removes race-sourced skills when race changes', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
        <DraftSkillsProbe />
      </CharacterBuilderProvider>
    );

    const raceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(raceSelect, { target: { value: 'half-elf' } });

    const skillChoiceLabel = await screen.findByText('Choose 2 Skills');
    const skillChoiceContainer = skillChoiceLabel.closest('div');
    expect(skillChoiceContainer).not.toBeNull();

    const skillSelect = within(skillChoiceContainer as HTMLElement).getByRole('combobox');
    fireEvent.change(skillSelect, { target: { value: 'athletics' } });

    await waitFor(() => {
      const raceSkills = getDraftSkills().filter(skill => skill.source?.startsWith('Race:'));
      expect(raceSkills.length).toBe(1);
    });

    fireEvent.change(raceSelect, { target: { value: 'dwarf' } });

    await waitFor(() => {
      const raceSkills = getDraftSkills().filter(skill => skill.source?.startsWith('Race:'));
      expect(raceSkills).toHaveLength(0);
    });
  });
});
