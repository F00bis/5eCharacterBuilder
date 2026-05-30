import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import type { CharacterSpell, SkillProficiency } from '../../../types';
import RaceStep from './RaceStep';

function DraftSkillsProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="draft-skills">{JSON.stringify(state.draft.skills || [])}</pre>;
}

function getDraftSkills(): SkillProficiency[] {
  const raw = screen.getByTestId('draft-skills').textContent || '[]';
  return JSON.parse(raw) as SkillProficiency[];
}

function DraftSpellsProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="draft-spells">{JSON.stringify(state.draft.spells || [])}</pre>;
}

function getDraftSpells(): CharacterSpell[] {
  const raw = screen.getByTestId('draft-spells').textContent || '[]';
  return JSON.parse(raw) as CharacterSpell[];
}

function RaceValidationProbe() {
  const { state } = useCharacterBuilder();
  return <pre data-testid="race-valid">{String(state.stepValidations['race'] ?? false)}</pre>;
}

function SeedValidRaceState() {
  const { dispatch } = useCharacterBuilder();

  useEffect(() => {
    dispatch({
      type: 'UPDATE_DRAFT',
      updates: {
        race: 'Dwarf',
        subrace: undefined,
        raceStatSelections: [
          { ability: 'strength', amount: 2 },
          { ability: 'dexterity', amount: 1 },
        ],
        languages: ['Dwarvish'],
      },
    });
    dispatch({ type: 'CLEAR_RACE_CHOICES' });
    dispatch({ type: 'SET_TASHAS_RULES', enabled: true });
  }, [dispatch]);

  return null;
}

function RaceRemountHarness() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button type="button" onClick={() => setVisible(v => !v)}>Toggle</button>
      {visible && <RaceStep />}
      <RaceValidationProbe />
    </>
  );
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


  it('renders cantrip choice with bottom padding in the left panel for high elf', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
      </CharacterBuilderProvider>
    );

    const raceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(raceSelect, { target: { value: 'elf' } });

    const subraceSelect = await screen.findByDisplayValue('None (Base Elf)');
    fireEvent.change(subraceSelect, { target: { value: 'high-elf' } });

    await waitFor(() => {
      expect(screen.getByText('Choose a Cantrip')).toBeInTheDocument();
    });

    const leftPanel = screen.getByTestId('race-step-left-panel');
    expect(leftPanel.className).toContain('pb-');
    expect(leftPanel.className).toContain('min-h-0');
    expect(leftPanel.className).toContain('px-4');
    expect(leftPanel.className).toContain('overflow-y-auto');
  });

  it('renders right panel with constrained height and scrollable content', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
      </CharacterBuilderProvider>
    );

    const rightPanel = screen.getByTestId('race-step-right-panel');
    expect(rightPanel.className).toContain('min-h-0');
    expect(rightPanel.className).toContain('h-full');

    const rightInner = rightPanel.querySelector('div');
    expect(rightInner).not.toBeNull();
    if (!rightInner) throw new Error('Expected rightInner to exist');
    expect(rightInner.className).toContain('overflow-y-auto');
    expect(rightInner.className).toContain('pb-');
  });

  it('preserves race validation after race step remount with persisted draft selections', async () => {
    render(
      <CharacterBuilderProvider>
        <SeedValidRaceState />
        <RaceRemountHarness />
      </CharacterBuilderProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('race-valid')).toHaveTextContent('true');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

    await waitFor(() => {
      expect(screen.getByTestId('race-valid')).toHaveTextContent('true');
    });
  });

  it('syncs selected racial cantrip into draft spells', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
        <DraftSpellsProbe />
      </CharacterBuilderProvider>
    );

    const raceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(raceSelect, { target: { value: 'elf' } });

    const subraceSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(subraceSelect, { target: { value: 'high-elf' } });

    const cantripLabel = await screen.findByText('Choose a Cantrip');
    const cantripContainer = cantripLabel.closest('div');
    expect(cantripContainer).not.toBeNull();

    const cantripSelect = await within(cantripContainer as HTMLElement).findByRole('combobox');
    fireEvent.change(cantripSelect, { target: { value: 'Fire Bolt' } });

    await waitFor(() => {
      const raceSpells = getDraftSpells().filter(spell => spell.source?.startsWith('Race:'));
      expect(raceSpells).toHaveLength(1);
      expect(raceSpells[0]).toMatchObject({
        name: 'Fire Bolt',
        level: 0,
        source: 'Race: High Elf',
      });
    });
  });

  it('removes race-sourced spells when race changes', async () => {
    render(
      <CharacterBuilderProvider>
        <RaceStep />
        <DraftSpellsProbe />
      </CharacterBuilderProvider>
    );

    const raceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(raceSelect, { target: { value: 'elf' } });

    const subraceSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(subraceSelect, { target: { value: 'high-elf' } });

    const cantripLabel = await screen.findByText('Choose a Cantrip');
    const cantripContainer = cantripLabel.closest('div');
    expect(cantripContainer).not.toBeNull();

    const cantripSelect = await within(cantripContainer as HTMLElement).findByRole('combobox');
    fireEvent.change(cantripSelect, { target: { value: 'Fire Bolt' } });

    await waitFor(() => {
      const raceSpells = getDraftSpells().filter(spell => spell.source?.startsWith('Race:'));
      expect(raceSpells.length).toBe(1);
    });

    fireEvent.change(raceSelect, { target: { value: 'dwarf' } });

    await waitFor(() => {
      const raceSpells = getDraftSpells().filter(spell => spell.source?.startsWith('Race:'));
      expect(raceSpells).toHaveLength(0);
    });
  });
});
