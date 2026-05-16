import type { CharacterSpell } from '../types';
import type { SpellDamage } from '../types/spells';

function formatOrdinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function formatAbility(ability: string): string {
  return ability.slice(0, 3).toUpperCase();
}

function formatDamageComponent({ dice, type, flat, formula }: SpellDamage['base'][number]): string {
  if (dice) return `${dice} ${type}`;
  if (flat !== undefined) return `${flat} ${type}`;
  if (formula) return `${formula} ${type}`;
  return type;
}

function formatSpellDamage(damage?: SpellDamage): string {
  if (!damage || damage.base.length === 0) return '';
  return damage.base.map(formatDamageComponent).join(', ');
}

interface SpellTooltipDetailProps {
  spell: CharacterSpell;
}

export function SpellTooltipDetail({ spell }: SpellTooltipDetailProps) {
  const levelLabel = spell.level === 0 ? 'Cantrip' : formatOrdinal(spell.level);

  const attackOrSave = spell.requiresAttackRoll
    ? 'Spell Attack'
    : spell.savingThrowAbility
      ? `${formatAbility(spell.savingThrowAbility)} Saving Throw`
      : '—';

  const damageOrEffect = formatSpellDamage(spell.damage) || formatSpellDamage(spell.healing) || '—';

  return (
    <div className="w-80">
      <div className="px-3 pt-2 pb-1 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">{spell.name}</h3>
      </div>

      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
        <div>
          <span className="font-semibold text-slate-500">Level</span>{' '}
          <span>{levelLabel}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">School</span>{' '}
          <span>{spell.school}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Casting Time</span>{' '}
          <span>{spell.castingTime}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Range/Area</span>{' '}
          <span>{spell.range}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Components</span>{' '}
          <span>{spell.components}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Duration</span>{' '}
          <span>{spell.duration}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Attack/Save</span>{' '}
          <span>{attackOrSave}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500">Damage/Effect</span>{' '}
          <span>{damageOrEffect}</span>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      <div className="px-3 py-2 max-h-48 overflow-y-auto text-xs text-slate-700 space-y-2">
        <p className="whitespace-pre-wrap">{spell.description}</p>
        {spell.higherLevel && (
          <div>
            <p className="font-semibold text-slate-500 mt-2">At Higher Levels</p>
            <p className="whitespace-pre-wrap">{spell.higherLevel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
