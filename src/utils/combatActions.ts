import type { ActionType, Character } from '../types';
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
    const spellDamage = getSpellDamage(spell);
    
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

    actions.push(action);
  }
  
  return actions;
}

function getSpellDamage(spell: Pick<Character, 'spells'>['spells'][number]): {
  damage: string;
  damageType: string;
  progression: { label: string; dice: string }[];
} | undefined {
  const combinedText = `${spell.description} ${spell.higherLevel ?? ''}`;
  const match = combinedText.match(/(\d+)d(\d+)(?:\s*\+\s*\d+)?\s+([a-zA-Z]+)\s+damage/i);
  if (!match) {
    return undefined;
  }

  const baseDiceCount = parseInt(match[1], 10);
  const dieSize = parseInt(match[2], 10);
  const damageType = match[3].toLowerCase();

  const allDiceMatches = [...combinedText.matchAll(/(\d+)d(\d+)/gi)];
  const maxDiceCount = allDiceMatches
    .map((diceMatch) => ({
      count: parseInt(diceMatch[1], 10),
      size: parseInt(diceMatch[2], 10),
    }))
    .filter((dice) => dice.size === dieSize)
    .reduce((max, dice) => Math.max(max, dice.count), baseDiceCount);

  const displayMaxDice = Math.max(baseDiceCount, maxDiceCount);

  const progression = getSpellDamageProgression(spell, baseDiceCount, dieSize);

  return {
    damage: `1-${displayMaxDice}d${dieSize}`,
    damageType,
    progression,
  };
}

function getSpellDamageProgression(
  spell: Pick<Character, 'spells'>['spells'][number],
  baseDiceCount: number,
  dieSize: number
): { label: string; dice: string }[] {
  const scalingText = `${spell.description} ${spell.higherLevel ?? ''}`;

  if (spell.level === 0) {
    const cantripThresholds = [1, 5, 11, 17];
    const counts = [...scalingText.matchAll(/(\d+)d(\d+)/gi)]
      .map((m) => ({ count: parseInt(m[1], 10), size: parseInt(m[2], 10) }))
      .filter((d) => d.size === dieSize)
      .map((d) => d.count);
    const uniqueCounts = Array.from(new Set([baseDiceCount, ...counts])).sort((a, b) => a - b);

    return uniqueCounts.map((count, index) => ({
      label: `Lvl ${cantripThresholds[index] ?? cantripThresholds[cantripThresholds.length - 1]}`,
      dice: `${count}d${dieSize}`,
    }));
  }

  const scalingMatch = scalingText.match(
    /damage increases by (\d+)d(\d+) for each slot level above (\d+)(?:st|nd|rd|th)/i,
  );

  if (!scalingMatch) {
    return [{ label: `${getOrdinal(spell.level)} lvl`, dice: `${baseDiceCount}d${dieSize}` }];
  }

  const increaseDiceCount = parseInt(scalingMatch[1], 10);
  const scalingDieSize = parseInt(scalingMatch[2], 10);
  const startsAboveLevel = parseInt(scalingMatch[3], 10);

  if (scalingDieSize !== dieSize || startsAboveLevel !== spell.level) {
    return [{ label: `${getOrdinal(spell.level)} lvl`, dice: `${baseDiceCount}d${dieSize}` }];
  }

  const progression: { label: string; dice: string }[] = [];
  for (let castLevel = spell.level; castLevel <= 9; castLevel += 1) {
    const extraLevels = castLevel - spell.level;
    const totalDice = baseDiceCount + extraLevels * increaseDiceCount;
    progression.push({ label: `${getOrdinal(castLevel)} lvl`, dice: `${totalDice}d${dieSize}` });
  }

  return progression;
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
