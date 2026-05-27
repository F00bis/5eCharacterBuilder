import { TooltipProvider } from '@/components/ui/tooltip';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterSpell, DndSpell } from '../types';
import { WizardSpellbookManager } from './WizardSpellbookManager';

function createMockDndSpell(overrides: Partial<DndSpell> = {}): DndSpell {
  return {
    name: 'Mock Spell',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'A mock spell for testing.',
    classes: ['Wizard'],
    isSRD: true,
    ...overrides,
  };
}

function createMockCharacterSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    ...createMockDndSpell(),
    id: 1,
    prepared: false,
    ...overrides,
  };
}

function renderManager(props: Partial<React.ComponentProps<typeof WizardSpellbookManager>> = {}) {
  const defaultProps: React.ComponentProps<typeof WizardSpellbookManager> = {
    spellbookSpells: [],
    availableToAdd: [],
    onAdd: vi.fn(),
    onRemove: vi.fn(),
  };

  return render(
    <TooltipProvider delayDuration={0}>
      <WizardSpellbookManager {...defaultProps} {...props} />
    </TooltipProvider>
  );
}

describe('WizardSpellbookManager', () => {
  it('renders empty state when spellbookSpells is empty', () => {
    renderManager();

    expect(
      screen.getByText('Your spellbook is empty. Use Add Spell to record learned magic.')
    ).toBeInTheDocument();
  });

  it('renders spell rows with name, school badge, and remove button', () => {
    const spells = [
      createMockCharacterSpell({ id: 1, name: 'Magic Missile', school: 'Evocation', level: 1 }),
      createMockCharacterSpell({ id: 2, name: 'Shield', school: 'Abjuration', level: 1 }),
    ];

    renderManager({
      spellbookSpells: spells,
    });

    expect(screen.getByText('Magic Missile')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.getByText('Evocation')).toBeInTheDocument();
    expect(screen.getByText('Abjuration')).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    expect(removeButtons).toHaveLength(2);
  });

  it('renders tooltip with spell details on hover', async () => {
    const user = userEvent.setup();
    const spells = [
      createMockCharacterSpell({
        id: 1,
        name: 'Magic Missile',
        school: 'Evocation',
        level: 1,
        description: 'Dart of magical force.',
      }),
    ];

    renderManager({
      spellbookSpells: spells,
    });

    const spellName = screen.getByText('Magic Missile');
    await user.hover(spellName);

    const tooltips = screen.getAllByText('Dart of magical force.');
    expect(tooltips.length).toBeGreaterThanOrEqual(1);
  });

  it('shows cap indicator with orange styling when nearCap is true', () => {
    renderManager();

    const indicator = screen.getByText(/8 \/ 9/);
    expect(indicator).toBeInTheDocument();
    expect(indicator.closest('div')).toHaveClass('border-orange-300');
  });

  it('selecting a spell from combobox calls onAdd with correct DndSpell', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();

    const availableSpells: DndSpell[] = [
      createMockDndSpell({ name: 'Fireball', level: 3 }),
    ];

    renderManager({
      availableToAdd: availableSpells,
      onAdd: mockOnAdd,
    });

    const trigger = screen.getByRole('button', { name: /Search spells/i });
    await user.click(trigger);

    const option = screen.getByText(/Fireball/i);
    await user.click(option);

    expect(mockOnAdd).toHaveBeenCalledOnce();
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Fireball', level: 3 })
    );
  });

  it('clicking Remove opens confirmation dialog with correct spell name', async () => {
    const user = userEvent.setup();
    const spells = [
      createMockCharacterSpell({ id: 1, name: 'Magic Missile', level: 1 }),
    ];

    renderManager({
      spellbookSpells: spells,
    });

    const removeButton = screen.getByRole('button', { name: /Remove Magic Missile/i });
    await user.click(removeButton);

    expect(
      screen.getByText(/Remove Magic Missile from your spellbook/i)
    ).toBeInTheDocument();
  });

  it('confirming removal calls onRemove with spell name', async () => {
    const user = userEvent.setup();
    const mockOnRemove = vi.fn();
    const spells = [
      createMockCharacterSpell({ id: 1, name: 'Magic Missile', level: 1, prepared: true }),
    ];

    renderManager({
      spellbookSpells: spells,
      onRemove: mockOnRemove,
    });

    const removeButton = screen.getByRole('button', { name: /Remove Magic Missile/i });
    await user.click(removeButton);

    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    expect(mockOnRemove).toHaveBeenCalledOnce();
    expect(mockOnRemove).toHaveBeenCalledWith('Magic Missile');
  });

  it('cancelling removal does not call onRemove', async () => {
    const user = userEvent.setup();
    const mockOnRemove = vi.fn();
    const spells = [
      createMockCharacterSpell({ id: 1, name: 'Magic Missile', level: 1 }),
    ];

    renderManager({
      spellbookSpells: spells,
      onRemove: mockOnRemove,
    });

    const removeButton = screen.getByRole('button', { name: /Remove Magic Missile/i });
    await user.click(removeButton);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnRemove).not.toHaveBeenCalled();
  });
});
