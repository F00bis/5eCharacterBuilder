import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterSpell } from '../types';
import { SpellDetailDialog } from './SpellDetailDialog';

function createSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
    castingTime: '1 action',
    range: '150 feet',
    components: 'V, S, M',
    duration: 'Instantaneous',
    description: 'A bright streak flashes from your pointing finger.',
    classes: ['Wizard'],
    isSRD: true,
    prepared: false,
    ...overrides,
  };
}

describe('SpellDetailDialog', () => {
  it('renders dialog with spell name as title when open', () => {
    render(
      <SpellDetailDialog
        spell={createSpell()}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fireball' })).toBeInTheDocument();
  });

  it('renders spell details in the dialog body', () => {
    render(
      <SpellDetailDialog
        spell={createSpell()}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('3rd');
    expect(dialog).toHaveTextContent('Evocation');
    expect(dialog).toHaveTextContent('1 action');
    expect(dialog).toHaveTextContent('150 feet');
    expect(dialog).toHaveTextContent('V, S, M');
    expect(dialog).toHaveTextContent('Instantaneous');
    expect(dialog).toHaveTextContent('A bright streak flashes from your pointing finger.');
  });

  it('does not render dialog content when spell is null', () => {
    render(
      <SpellDetailDialog
        spell={null}
        open={false}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render dialog content when closed', () => {
    render(
      <SpellDetailDialog
        spell={createSpell()}
        open={false}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when dialog is closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <SpellDetailDialog
        spell={createSpell()}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not duplicate the spell name in the body', () => {
    render(
      <SpellDetailDialog
        spell={createSpell()}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    // The name should appear exactly once — as the dialog title
    // SpellTooltipDetail is rendered with showName={false}, so no h3 inside
    const nameOccurrences = dialog.textContent?.split('Fireball').length ?? 0;
    expect(nameOccurrences).toBe(2); // splits on 'Fireball', so 2 parts = 1 occurrence
  });

  it('renders higher level text when present', () => {
    render(
      <SpellDetailDialog
        spell={createSpell({ higherLevel: 'When you cast this spell using a spell slot of 4th level or higher, the damage increases.' })}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('At Higher Levels');
    expect(screen.getByRole('dialog')).toHaveTextContent('When you cast this spell using a spell slot of 4th level or higher, the damage increases.');
  });
});
