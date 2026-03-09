import type { Ability, DndSpell } from '../types';

const savingThrowPattern = /(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving throw/i;
const attackRollPattern = /make\s+a\s+(?:melee|ranged\s+)?spell attack/i;

export function inferSpellMechanics(spell: Pick<DndSpell, 'description'>): {
  requiresAttackRoll?: boolean;
  savingThrowAbility?: Ability;
} {
  const requiresAttackRoll = attackRollPattern.test(spell.description);
  const saveMatch = spell.description.match(savingThrowPattern);

  return {
    ...(requiresAttackRoll ? { requiresAttackRoll: true } : {}),
    ...(saveMatch ? { savingThrowAbility: saveMatch[1].toLowerCase() as Ability } : {}),
  };
}
