import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CharacterSpell } from '../types';
import { SpellTooltipDetail } from './SpellTooltipDetail';

function createSpell(overrides: Partial<CharacterSpell> = {}): CharacterSpell {
  return {
    name: 'Test Spell',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: 'V, S',
    duration: 'Instantaneous',
    description: 'A test spell description',
    classes: ['Wizard'],
    isSRD: true,
    prepared: false,
    ...overrides,
  };
}

describe('SpellTooltipDetail', () => {
  it('renders spell name as title', () => {
    render(<SpellTooltipDetail spell={createSpell({ name: 'Fireball' })} />);
    expect(screen.getByText('Fireball')).toBeInTheDocument();
  });

  it('renders level as "Cantrip" for level 0', () => {
    render(<SpellTooltipDetail spell={createSpell({ level: 0 })} />);
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('Cantrip')).toBeInTheDocument();
  });

  it('renders level as ordinal for levels > 0', () => {
    render(<SpellTooltipDetail spell={createSpell({ level: 3 })} />);
    expect(screen.getByText('3rd')).toBeInTheDocument();
  });

  it('renders school', () => {
    render(<SpellTooltipDetail spell={createSpell({ school: 'Necromancy' })} />);
    expect(screen.getByText('School')).toBeInTheDocument();
    expect(screen.getByText('Necromancy')).toBeInTheDocument();
  });

  it('renders casting time', () => {
    render(<SpellTooltipDetail spell={createSpell({ castingTime: '1 bonus action' })} />);
    expect(screen.getByText('Casting Time')).toBeInTheDocument();
    expect(screen.getByText('1 bonus action')).toBeInTheDocument();
  });

  it('renders range/area', () => {
    render(<SpellTooltipDetail spell={createSpell({ range: 'Self (15-foot cone)' })} />);
    expect(screen.getByText('Range/Area')).toBeInTheDocument();
    expect(screen.getByText('Self (15-foot cone)')).toBeInTheDocument();
  });

  it('renders components', () => {
    render(<SpellTooltipDetail spell={createSpell({ components: 'V, S, M (a morsel of food)' })} />);
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('V, S, M (a morsel of food)')).toBeInTheDocument();
  });

  it('renders duration', () => {
    render(<SpellTooltipDetail spell={createSpell({ duration: 'Concentration, up to 1 minute' })} />);
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Concentration, up to 1 minute')).toBeInTheDocument();
  });

  it('renders spell attack when requiresAttackRoll is true', () => {
    render(<SpellTooltipDetail spell={createSpell({ requiresAttackRoll: true })} />);
    expect(screen.getByText('Attack/Save')).toBeInTheDocument();
    expect(screen.getByText('Spell Attack')).toBeInTheDocument();
  });

  it('renders saving throw ability when savingThrowAbility is set', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({ savingThrowAbility: 'dexterity' })}
      />
    );
    expect(screen.getByText('Attack/Save')).toBeInTheDocument();
    expect(screen.getByText('DEX Saving Throw')).toBeInTheDocument();
  });

  it('renders "—" for attack/save when neither is set', () => {
    render(<SpellTooltipDetail spell={createSpell()} />);
    expect(screen.getByText('Attack/Save')).toBeInTheDocument();
    const attackSaveRow = screen.getByText('Attack/Save').closest('div');
    expect(attackSaveRow).toHaveTextContent('—');
  });

  it('renders base damage as formatted string', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          damage: {
            base: [{ dice: '1d10', type: 'fire' }],
            scaling: { kind: 'none' },
          },
        })}
      />
    );
    expect(screen.getByText('Damage/Effect')).toBeInTheDocument();
    expect(screen.getByText('1d10 fire')).toBeInTheDocument();
  });

  it('renders multiple damage components separated by commas', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          damage: {
            base: [
              { dice: '2d6', type: 'cold' },
              { flat: 5, type: 'cold' },
            ],
            scaling: { kind: 'none' },
          },
        })}
      />
    );
    expect(screen.getByText('2d6 cold, 5 cold')).toBeInTheDocument();
  });

  it('renders flat damage with "mod" as modifier', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          damage: {
            base: [{ flat: 'mod', type: 'radiant' }],
            scaling: { kind: 'none' },
          },
        })}
      />
    );
    expect(screen.getByText('mod radiant')).toBeInTheDocument();
  });

  it('renders healing when present instead of damage', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          healing: {
            base: [{ dice: '1d8', type: 'healing' }],
            scaling: { kind: 'none' },
          },
        })}
      />
    );
    expect(screen.getByText('Damage/Effect')).toBeInTheDocument();
    expect(screen.getByText('1d8 healing')).toBeInTheDocument();
  });

  it('renders "—" for damage/effect when neither damage nor healing is set', () => {
    render(<SpellTooltipDetail spell={createSpell()} />);
    expect(screen.getByText('Damage/Effect')).toBeInTheDocument();
    const damageEffectRow = screen.getByText('Damage/Effect').closest('div');
    expect(damageEffectRow).toHaveTextContent('—');
  });

  it('renders description text', () => {
    render(<SpellTooltipDetail spell={createSpell({ description: 'You hurl a mote of fire.' })} />);
    expect(screen.getByText('You hurl a mote of fire.')).toBeInTheDocument();
  });

  it('renders higher level text when present', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          higherLevel: 'When you cast this spell using a spell slot of 2nd level or higher.',
        })}
      />
    );
    expect(
      screen.getByText(
        'When you cast this spell using a spell slot of 2nd level or higher.'
      )
    ).toBeInTheDocument();
  });

  it('does not render higher level section when higherLevel is absent', () => {
    render(<SpellTooltipDetail spell={createSpell()} />);
    expect(screen.queryByText('At Higher Levels')).not.toBeInTheDocument();
  });

  it('renders damage formula when dice is absent but formula is present', () => {
    render(
      <SpellTooltipDetail
        spell={createSpell({
          damage: {
            base: [{ formula: '2d8 + spell mod', type: 'force' }],
            scaling: { kind: 'none' },
          },
        })}
      />
    );
    expect(screen.getByText('2d8 + spell mod force')).toBeInTheDocument();
  });
});
