import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import SpellSelectionStep from './SpellSelectionStep';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { calculateSpellEntitlements, getMaxAccessibleSpellLevel, getSpellListForClass } from '../../../utils/spellCalculations';
import { srdSpells } from '../../../data/srdSpells';
import type { CharacterBuilderState } from '../../../contexts/CharacterBuilderContextTypes';
import { createDefaultCharacter, type CharacterSpell } from '../../../types';

vi.mock('../../../contexts/CharacterBuilderContextTypes', () => ({
  useCharacterBuilder: vi.fn(),
}));

vi.mock('../../../utils/spellCalculations', () => ({
  calculateSpellEntitlements: vi.fn(),
  getMaxAccessibleSpellLevel: vi.fn(),
  getSpellListForClass: vi.fn(),
  loadSpellProgressions: vi.fn(),
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-content">{children}</div>,
}));

vi.mock('../../../components/SpellTooltipDetail', () => ({
  SpellTooltipDetail: ({ spell }: { spell: { name: string } }) => <div data-testid="spell-tooltip-detail" data-name={spell.name} />,
}));

vi.mock('../../../data/srdSpells', () => ({
  srdSpells: [
    { name: 'Fire Bolt', level: 0, school: 'Evocation', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'A beam of fire.', classes: ['Wizard', 'Sorcerer'], isSRD: true },
    { name: 'Mage Hand', level: 0, school: 'Conjuration', castingTime: '1 action', range: '30 feet', components: 'V, S', duration: '1 minute', description: 'A spectral hand.', classes: ['Wizard', 'Bard'], isSRD: true },
    { name: 'Burning Hands', level: 1, school: 'Evocation', castingTime: '1 action', range: 'Self (15-foot cone)', components: 'V, S', duration: 'Instantaneous', description: 'A cone of fire.', classes: ['Wizard', 'Sorcerer'], isSRD: true },
    { name: 'Magic Missile', level: 1, school: 'Evocation', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'Darts of magical force.', classes: ['Wizard', 'Sorcerer'], isSRD: true },
    { name: 'Cure Wounds', level: 1, school: 'Evocation', castingTime: '1 action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', description: 'Heal a creature.', classes: ['Cleric', 'Bard'], isSRD: true },
  ],
}));

function createMockState(draftSpells: CharacterSpell[] = []): CharacterBuilderState {
  return {
    draft: {
      ...createDefaultCharacter(),
      classes: [{ className: 'Wizard', level: 1 }],
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 16,
        wisdom: 10,
        charisma: 10,
      },
      spells: draftSpells,
    },
    currentStep: 0,
    mode: 'create',
    baseCharacterId: null,
    baseLevel: 0,
    targetLevel: 1,
    asiChoices: [],
    featChoices: [],
    expertiseChoices: {},
    metamagicChoices: {},
    invocationChoices: {},
    mysticArcanumChoices: {},
    stepValidations: {},
    useTashasRules: true,
    raceChoices: {},
    backgroundChoices: {},
    backgroundEquipmentPackage: null,
    currentPassClassName: null,
    baseClassesSnapshot: [],
  };
}

describe('SpellSelectionStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculateSpellEntitlements).mockReturnValue({
      cantripsKnown: 2,
      spellsKnown: 2,
      canPrepare: true,
      preparedSpellsMax: 3,
      spellcastingAbility: 'intelligence',
    });
    vi.mocked(getMaxAccessibleSpellLevel).mockReturnValue(1);
    vi.mocked(getSpellListForClass).mockImplementation((className: string) => {
      if (className === 'Wizard') return ['Wizard'];
      if (className === 'Sorcerer') return ['Sorcerer'];
      if (className === 'Cleric') return ['Cleric'];
      if (className === 'Bard') return ['Bard'];
      return [];
    });
  });

  it('excludes spells already in draft.spells from available cantrips and spells', async () => {
    const existingCantrip: CharacterSpell = {
      ...srdSpells.find(s => s.name === 'Fire Bolt')!,
      prepared: false,
      source: 'Race',
    };
    const existingSpell: CharacterSpell = {
      ...srdSpells.find(s => s.name === 'Burning Hands')!,
      prepared: false,
      source: 'Race',
    };

    vi.mocked(useCharacterBuilder).mockReturnValue({
      state: createMockState([existingCantrip, existingSpell]),
      dispatch: vi.fn(),
      isComplete: false,
    });

    render(<SpellSelectionStep isVisible />);
    const user = userEvent.setup();

    // Cantrips
    const cantripTrigger = screen.getByText('Select cantrip...');
    await user.click(cantripTrigger);

    expect(screen.queryByText('Fire Bolt')).not.toBeInTheDocument();
    expect(screen.getByText('Mage Hand')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    // Spells
    const spellTrigger = screen.getByText('Select spell...');
    await user.click(spellTrigger);

    expect(screen.queryByText('Burning Hands (Lv 1)')).not.toBeInTheDocument();
    expect(screen.getByText('Magic Missile (Lv 1)')).toBeInTheDocument();
  });

  it('renders a tooltip with SpellTooltipDetail for each selected cantrip and spell', async () => {
    vi.mocked(useCharacterBuilder).mockReturnValue({
      state: createMockState(),
      dispatch: vi.fn(),
      isComplete: false,
    });

    render(<SpellSelectionStep isVisible />);
    const user = userEvent.setup();

    // Add cantrip
    await user.click(screen.getByText('Select cantrip...'));
    await user.click(screen.getByText('Fire Bolt'));

    // Add spell
    await user.click(screen.getByText('Select spell...'));
    await user.click(screen.getByText('Burning Hands (Lv 1)'));

    // Verify badges are present
    expect(screen.getByText('Fire Bolt')).toBeInTheDocument();
    expect(screen.getByText('Burning Hands')).toBeInTheDocument();

    // Verify tooltip details rendered
    const tooltipDetails = screen.getAllByTestId('spell-tooltip-detail');
    expect(tooltipDetails).toHaveLength(2);

    const names = tooltipDetails.map(el => el.getAttribute('data-name'));
    expect(names).toContain('Fire Bolt');
    expect(names).toContain('Burning Hands');

    const tooltipContents = screen.getAllByTestId('tooltip-content');
    expect(tooltipContents.length).toBeGreaterThanOrEqual(2);
  });

  it('shows accurate prepared spells message instead of reference only', () => {
    vi.mocked(useCharacterBuilder).mockReturnValue({
      state: createMockState(),
      dispatch: vi.fn(),
      isComplete: false,
    });

    render(<SpellSelectionStep isVisible />);

    expect(screen.getByText('You can prepare up to 3 spells after character creation.')).toBeInTheDocument();
    expect(screen.queryByText(/reference only/i)).not.toBeInTheDocument();
  });

  it('preserves non-Class spells when saving to draft', async () => {
    const existingCantrip: CharacterSpell = {
      ...srdSpells.find(s => s.name === 'Fire Bolt')!,
      prepared: false,
      source: 'Race',
    };
    const dispatch = vi.fn();

    vi.mocked(useCharacterBuilder).mockReturnValue({
      state: createMockState([existingCantrip]),
      dispatch,
      isComplete: false,
    });

    render(<SpellSelectionStep isVisible />);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalled();
    });

    const lastDispatchCall = dispatch.mock.calls[dispatch.mock.calls.length - 1] as [{ type: string; updates: { spells: CharacterSpell[] } }];
    const updatedSpells = lastDispatchCall[0].updates.spells;

    expect(updatedSpells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Fire Bolt', source: 'Race' }),
      ])
    );
  });

  it('does not enter an infinite dispatch loop when draft.spells contains non-Class spells', async () => {
    const existingCantrip: CharacterSpell = {
      ...srdSpells.find(s => s.name === 'Fire Bolt')!,
      prepared: false,
      source: 'Race',
    };
    const dispatch = vi.fn();

    vi.mocked(useCharacterBuilder).mockReturnValue({
      state: createMockState([existingCantrip]),
      dispatch,
      isComplete: false,
    });

    render(<SpellSelectionStep isVisible />);

    // Allow effects and re-renders to settle
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalled();
    });

    // Wait a tick to confirm no further dispatches are queued
    await new Promise(resolve => setTimeout(resolve, 50));

    const callCount = dispatch.mock.calls.length;
    // A single initial save is expected; an infinite loop would produce many more
    expect(callCount).toBeLessThan(5);
  });
});
