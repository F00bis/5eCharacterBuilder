import type { ActionType, Character } from '../types';
import type { SpellDamageComponent } from '../types/spells';
import { getSpellAttack, getUnarmedStrike, getWeaponAttack } from './attackCalculations';

export interface CombatAction {
  id: string;
  name: string;
  type: ActionType;
  source: 'weapon' | 'unarmed' | 'feature' | 'feat' | 'race' | 'spell';
  toHit?: string;
  toHitBreakdown?: { name: string; value: number }[];
  saveDC?: number;
  saveDCBreakdown?: { name: string; value: number }[];
  saveAbility?: string;
  damage?: string;
  damageProgression?: { label: string; dice: string }[];
  healing?: string;
  healingProgression?: { label: string; dice: string }[];
  damageBreakdown?: { name: string; value: number }[];
  damageBonusSources?: { name: string; value: number }[];
  damageType?: string;
  description?: string;
  spellDescription?: string;
  resourceCost?: { resourceId: string; amount: number; resourceName: string };
  requirements?: string;
  castingTime?: string;
  spellLevel?: number;
}

export interface ResourcePool {
  id: string;
  name: string;
  current: number;
  max: number;
  maxFormula: string;
  resetOn: 'long-rest' | 'short-rest';
}

export type ActionFilter = 'all' | 'action' | 'bonus-action' | 'reaction' | 'weapon' | 'spell';

export function getWeaponAttacks(character: Character): CombatAction[] {
  const actions: CombatAction[] = [];
  
  const equippedWeapons = character.equipment.filter(eq => eq.equipped && eq.weaponCategory);
  
  for (const weapon of equippedWeapons) {
    const attack = getWeaponAttack(character, weapon);
    actions.push({
      id: `weapon-${weapon.id || weapon.name}`,
      name: weapon.name,
      type: 'action',
      source: 'weapon',
      toHit: attack.toHit >= 0 ? '+' + attack.toHit : String(attack.toHit),
      toHitBreakdown: attack.toHitBreakdown,
      damage: attack.damage,
      damageBreakdown: attack.damageBreakdown,
      damageBonusSources: attack.damageBonusSources,
      damageType: attack.damageType,
      description: weapon.properties?.join(', '),
    });
  }
  
  return actions;
}

export function getUnarmedStrikeAction(character: Character): CombatAction {
  const attack = getUnarmedStrike(character);
  
  return {
    id: 'unarmed-strike',
    name: 'Unarmed Strike',
    type: 'action',
    source: 'unarmed',
    toHit: attack.toHit >= 0 ? '+' + attack.toHit : String(attack.toHit),
    toHitBreakdown: attack.toHitBreakdown,
    damage: attack.damage,
    damageBreakdown: attack.damageBreakdown,
    damageBonusSources: attack.damageBonusSources,
    damageType: attack.damageType,
    description: attack.damageBreakdown.map(b => b.name + ': ' + b.value).join(', '),
  };
}

export async function getFeatureActions(character: Character): Promise<CombatAction[]> {
  const actions: CombatAction[] = [];
  
  const classNames = character.classes.map(c => c.className);
  
  for (const className of classNames) {
    try {
      const { getClassByName } = await import('../db/classes');
      const dndClass = await getClassByName(className);
      
      if (dndClass?.features) {
        const classEntry = character.classes.find(c => c.className === className);
        const level = classEntry?.level || 1;
        
        for (const feature of dndClass.features) {
          if (feature.levelAcquired <= level && feature.actions) {
            for (const action of feature.actions) {
              const resource = dndClass.resources?.find(r => r.id === action.resourceCost?.resourceId);
              
              actions.push({
                id: `feature-${className.toLowerCase()}-${feature.name.toLowerCase().replace(/\s+/g, '-')}-${action.type}`,
                name: feature.name,
                type: action.type,
                source: 'feature',
                description: action.description,
                resourceCost: action.resourceCost ? {
                  ...action.resourceCost,
                  resourceName: resource?.name || action.resourceCost.resourceId,
                } : undefined,
                requirements: action.requirements,
              });
            }
          }
        }
      }
    } catch {
      // Class not found in database, skip
    }
  }
  
  for (const feat of character.feats) {
    if (feat.actions) {
      for (const action of feat.actions) {
        actions.push({
          id: `feat-${feat.name.toLowerCase().replace(/\s+/g, '-')}-${action.type}`,
          name: feat.name,
          type: action.type,
          source: 'feat',
          description: action.description,
          resourceCost: action.resourceCost ? {
            ...action.resourceCost,
            resourceName: action.resourceCost.resourceId,
          } : undefined,
          requirements: action.requirements,
        });
      }
    }
  }
  
  try {
    const { db } = await import('../db/index');
    const raceName = character.race;
    const race = await db.races.get(raceName);
    
    if (race?.features) {
      for (const feature of race.features) {
        if (feature.actions) {
          for (const action of feature.actions) {
            actions.push({
              id: `race-${raceName.toLowerCase()}-${feature.name.toLowerCase().replace(/\s+/g, '-')}-${action.type}`,
              name: feature.name,
              type: action.type,
              source: 'race',
              description: action.description,
              resourceCost: action.resourceCost ? {
                ...action.resourceCost,
                resourceName: action.resourceCost.resourceId,
              } : undefined,
              requirements: action.requirements,
            });
          }
        }
      }
    }
  } catch {
    // Race not found in database, skip
  }
  
  return actions;
}

export function getSpells(character: Character): CombatAction[] {
  const actions: CombatAction[] = [];
  
  for (const spell of character.spells) {
    const isPrepared = spell.prepared || character.classes.some(c => c.className === 'Sorcerer' || c.className === 'Bard');
    
    if (!isPrepared && character.classes.every(c => c.className !== 'Sorcerer' && c.className !== 'Bard')) {
      continue;
    }
    
    const spellAttack = getSpellAttack(character);
    const spellcastingMod = spellAttack.attackBreakdown[0]?.value ?? 0;
    const spellDamage = buildSpellDamageDisplay(spell, spellcastingMod);
    const spellHealing = buildSpellHealingDisplay(spell, spellcastingMod);
    
    const levelStr = spell.level === 0 ? 'Cantrip' : `${getOrdinal(spell.level)} level`;
    
    const castingTime = spell.castingTime.toLowerCase();
    const type: ActionType = castingTime.includes('reaction') ? 'reaction' : 
                             castingTime.includes('bonus') ? 'bonus-action' : 'action';
    
    const action: CombatAction = {
      id: `spell-${spell.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: spell.name,
      type,
      source: 'spell',
      description: spell.school,
      spellDescription: spell.description,
      castingTime: spell.castingTime,
      spellLevel: spell.level,
      requirements: levelStr,
    };

    if (spell.requiresAttackRoll) {
      action.toHit = spellAttack.attackBonus >= 0 ? `+${spellAttack.attackBonus}` : String(spellAttack.attackBonus);
      action.toHitBreakdown = spellAttack.attackBreakdown;
    }

    if (spell.savingThrowAbility) {
      action.saveDC = spellAttack.saveDC;
      action.saveDCBreakdown = spellAttack.saveDCBreakdown;
      action.saveAbility = spell.savingThrowAbility.slice(0, 3).toUpperCase();
    }

    if (spellDamage) {
      action.damage = spellDamage.damage;
      action.damageType = spellDamage.damageType;
      action.damageProgression = spellDamage.progression;
    }

    if (spellHealing) {
      action.healing = spellHealing.healing;
      action.healingProgression = spellHealing.progression;
    }

    actions.push(action);
  }
  
  return actions;
}

function buildSpellHealingDisplay(spell: Pick<Character, 'spells'>['spells'][number], spellcastingMod: number): {
  healing: string;
  progression: { label: string; dice: string }[];
} | undefined {
  if (!spell.healing) {
    return undefined;
  }

  const progression = buildHealingProgressionRows(spell, spellcastingMod);
  if (progression.length === 0) {
    return undefined;
  }

  const first = progression[0].dice;
  const last = progression[progression.length - 1].dice;
  return {
    healing: first === last ? first : `${first} - ${last}`,
    progression,
  };
}

function buildSpellDamageDisplay(spell: Pick<Character, 'spells'>['spells'][number], spellcastingMod: number): {
  damage: string;
  damageType: string;
  progression: { label: string; dice: string }[];
} | undefined {
  if (!spell.damage) {
    return undefined;
  }

  const progression = buildDamageProgressionRows(spell, spellcastingMod);
  if (progression.length === 0) {
    return undefined;
  }

  const firstDice = progression[0].dice;
  const lastDice = progression[progression.length - 1].dice;
  const damage = firstDice === lastDice ? firstDice : `${firstDice} - ${lastDice}`;
  const damageType = Array.from(new Set(spell.damage.base.map((component) => component.type.toLowerCase()))).join(' + ');

  return { damage, damageType, progression };
}

function buildDamageProgressionRows(
  spell: Pick<Character, 'spells'>['spells'][number],
  spellcastingMod: number
): { label: string; dice: string }[] {
  if (!spell.damage) {
    return [];
  }

  const rows: { label: string; dice: string }[] = [];
  const baseLabel = spell.level === 0 ? 'Lvl 1' : `${getOrdinal(spell.level)} lvl`;
  rows.push({ label: baseLabel, dice: formatDamageComponents(spell.damage.base, spellcastingMod) });

  if (spell.damage.scaling.kind === 'none') {
    return rows;
  }

  if (spell.damage.scaling.kind === 'cantrip') {
    for (const tier of spell.damage.scaling.tiers) {
      rows.push({
        label: `Lvl ${tier.level}`,
        dice: formatDamageComponents(tier.components, spellcastingMod),
      });
    }
    return rows;
  }

  if (spell.damage.scaling.kind === 'slot') {
    for (let castLevel = spell.level + 1; castLevel <= 9; castLevel += 1) {
      const extraLevels = castLevel - spell.level;
      const components = applySlotScaling(spell.damage.base, spell.damage.scaling.perSlotLevel, extraLevels);
      rows.push({
        label: `${getOrdinal(castLevel)} lvl`,
        dice: formatDamageComponents(components, spellcastingMod),
      });
    }
    return rows;
  }

  for (let castLevel = spell.level + 1; castLevel <= 9; castLevel += 1) {
    const extraLevels = castLevel - spell.level;
    const count = spell.damage.scaling.baseCount + extraLevels * spell.damage.scaling.countPerSlotLevel;
    const components = multiplyComponents(spell.damage.scaling.instanceDamage, count);
    rows.push({
      label: `${getOrdinal(castLevel)} lvl`,
      dice: formatDamageComponents(components, spellcastingMod),
    });
  }
  return rows;
}

function buildHealingProgressionRows(
  spell: Pick<Character, 'spells'>['spells'][number],
  spellcastingMod: number
): { label: string; dice: string }[] {
  if (!spell.healing) {
    return [];
  }

  const rows: { label: string; dice: string }[] = [];
  const baseLabel = spell.level === 0 ? 'Lvl 1' : `${getOrdinal(spell.level)} lvl`;
  rows.push({ label: baseLabel, dice: formatHealingComponents(spell.healing.base, spellcastingMod) });

  if (spell.healing.scaling.kind === 'none') {
    return rows;
  }

  if (spell.healing.scaling.kind === 'cantrip') {
    for (const tier of spell.healing.scaling.tiers) {
      rows.push({
        label: `Lvl ${tier.level}`,
        dice: formatHealingComponents(tier.components, spellcastingMod),
      });
    }
    return rows;
  }

  if (spell.healing.scaling.kind === 'slot') {
    for (let castLevel = spell.level + 1; castLevel <= 9; castLevel += 1) {
      const extraLevels = castLevel - spell.level;
      const components = applySlotScaling(spell.healing.base, spell.healing.scaling.perSlotLevel, extraLevels);
      rows.push({
        label: `${getOrdinal(castLevel)} lvl`,
        dice: formatHealingComponents(components, spellcastingMod),
      });
    }
    return rows;
  }

  for (let castLevel = spell.level + 1; castLevel <= 9; castLevel += 1) {
    const extraLevels = castLevel - spell.level;
    const count = spell.healing.scaling.baseCount + extraLevels * spell.healing.scaling.countPerSlotLevel;
    const components = multiplyComponents(spell.healing.scaling.instanceDamage, count);
    rows.push({
      label: `${getOrdinal(castLevel)} lvl`,
      dice: formatHealingComponents(components, spellcastingMod),
    });
  }

  return rows;
}

function applySlotScaling(
  base: SpellDamageComponent[],
  perSlotLevel: SpellDamageComponent[],
  levelsAboveBase: number
): SpellDamageComponent[] {
  const next = base.map((component) => ({ ...component }));

  for (const increment of perSlotLevel) {
    const existing = next.find(
      (component) =>
        component.type === increment.type
        && (
          (getDieSize(component.dice) !== undefined && getDieSize(component.dice) === getDieSize(increment.dice))
          || (!component.dice && !increment.dice && typeof component.flat === 'number' && typeof increment.flat === 'number')
        ),
    );

    if (existing) {
      if (existing.dice && increment.dice) {
        existing.dice = scaleDice(existing.dice, increment.dice, levelsAboveBase);
      }
      if (typeof existing.flat === 'number' && typeof increment.flat === 'number') {
        existing.flat += increment.flat * levelsAboveBase;
      }
    } else {
      next.push(scaleComponent(increment, levelsAboveBase));
    }
  }

  return next;
}

function getDieSize(dice: string | undefined): number | undefined {
  if (!dice) {
    return undefined;
  }
  return parseDice(dice)?.size;
}

function scaleComponent(component: SpellDamageComponent, multiplier: number): SpellDamageComponent {
  return {
    type: component.type,
    dice: component.dice ? multiplyDice(component.dice, multiplier) : undefined,
    flat: typeof component.flat === 'number' ? component.flat * multiplier : component.flat,
  };
}

function multiplyComponents(components: SpellDamageComponent[], multiplier: number): SpellDamageComponent[] {
  return components.map((component) => scaleComponent(component, multiplier));
}

function multiplyDice(dice: string, multiplier: number): string {
  const parsed = parseDice(dice);
  if (!parsed) {
    return dice;
  }
  return `${parsed.count * multiplier}d${parsed.size}`;
}

function scaleDice(baseDice: string, incrementDice: string, levelsAboveBase: number): string {
  const base = parseDice(baseDice);
  const increment = parseDice(incrementDice);
  if (!base || !increment || base.size !== increment.size) {
    return baseDice;
  }
  return `${base.count + increment.count * levelsAboveBase}d${base.size}`;
}

function parseDice(dice: string): { count: number; size: number } | undefined {
  const match = dice.match(/^(\d+)d(\d+)$/i);
  if (!match) {
    return undefined;
  }
  return { count: parseInt(match[1], 10), size: parseInt(match[2], 10) };
}

function formatDamageComponents(components: SpellDamageComponent[], spellcastingMod: number): string {
  return components
    .map((component) => {
      const parts: string[] = [];
      if (component.dice) {
        parts.push(component.dice);
      }
      if (component.flat !== undefined) {
        if (component.flat === 'mod') {
          parts.push(spellcastingMod >= 0 ? `+${spellcastingMod}` : `${spellcastingMod}`);
        } else {
          const hasDice = Boolean(component.dice);
          parts.push(component.flat >= 0 && hasDice ? `+${component.flat}` : `${component.flat}`);
        }
      }
      if (component.formula) {
        parts.push(component.formula);
      }
      const core = parts.join('');
      return `${core} ${component.type}`.trim();
    })
    .join(' + ');
}

function formatHealingComponents(components: SpellDamageComponent[], spellcastingMod: number): string {
  return components
    .map((component) => {
      const parts: string[] = [];
      if (component.dice) {
        parts.push(component.dice);
      }
      if (component.flat !== undefined) {
        if (component.flat === 'mod') {
          parts.push(spellcastingMod >= 0 ? `+${spellcastingMod}` : `${spellcastingMod}`);
        } else {
          const hasDice = Boolean(component.dice);
          parts.push(component.flat >= 0 && hasDice ? `+${component.flat}` : `${component.flat}`);
        }
      }
      if (component.formula) {
        parts.push(component.formula);
      }
      return parts.join('');
    })
    .filter(Boolean)
    .join(' + ');
}

export function getResourcePools(character: Character): ResourcePool[] {
  const pools: ResourcePool[] = [];
  
  for (const spellSlot of character.spellSlots) {
    const used = Math.min(spellSlot.used, spellSlot.total);
    pools.push({
      id: `spell-slot-${spellSlot.level}`,
      name: `Level ${spellSlot.level}`,
      current: spellSlot.total - used,
      max: spellSlot.total,
      maxFormula: `${spellSlot.total} slot${spellSlot.total !== 1 ? 's' : ''}`,
      resetOn: 'long-rest',
    });
  }
  
  return pools;
}

export function filterActions(
  actions: CombatAction[],
  filter: ActionFilter,
  searchTerm: string
): CombatAction[] {
  return actions.filter(action => {
    if (searchTerm && !action.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filter === 'all') {
      return true;
    }
    
    if (filter === 'action' || filter === 'bonus-action' || filter === 'reaction') {
      return action.type === filter;
    }
    
    if (filter === 'weapon') {
      return action.source === 'weapon' || action.source === 'unarmed';
    }
    
    if (filter === 'spell') {
      return action.source === 'spell';
    }
    
    return true;
  });
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
