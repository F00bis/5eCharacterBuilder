import type { Character } from '../types';
import { getModifier } from './abilityScores';
import { db } from '../db';

export function calculateMaxHp(character: Character): number {
  const hpRollsTotal = character.hpRolls
    ? character.hpRolls.reduce((a, b) => a + b, 0)
    : character.maxHp ?? 0;
  const totalLevel = character.classes
    ? character.classes.reduce((sum, c) => sum + c.level, 0)
    : 1;
  const conMod = getModifier(character.abilityScores.constitution);
  return hpRollsTotal + (conMod * totalLevel) + (character.hpBonus ?? 0);
}

export interface BreakdownSource {
  name: string;
  type: 'base' | 'race' | 'feat' | 'equipment' | 'class' | 'other';
  value: number;
  description?: string;
}

export interface StatBreakdown {
  total: number;
  sources: BreakdownSource[];
}

export async function getInitiativeBreakdown(character: Character): Promise<StatBreakdown> {
  const sources: BreakdownSource[] = [];
  
  const dexModifier = getModifier(character.abilityScores.dexterity);
  sources.push({
    name: 'Dexterity Modifier',
    type: 'base',
    value: dexModifier,
  });

  let total = dexModifier;

  const featBonus = character.feats.reduce((sum, feat) => {
    const speedMatch = feat.statModifiers?.dexterity;
    if (speedMatch) {
      return sum + speedMatch;
    }
    return sum;
  }, 0);
  
  if (featBonus !== 0) {
    const matchingFeats = character.feats.filter(f => f.statModifiers?.dexterity);
    for (const feat of matchingFeats) {
      sources.push({
        name: feat.name,
        type: 'feat',
        value: feat.statModifiers!.dexterity!,
      });
    }
    total += featBonus;
  }

  for (const item of character.equipment) {
    if (!item.equipped) continue;
    if (item.abilityOverride?.dexterity) {
      const overrideValue = item.abilityOverride.dexterity - character.abilityScores.dexterity;
      if (overrideValue > 0) {
        sources.push({
          name: item.name,
          type: 'equipment',
          value: overrideValue,
          description: `Sets DEX to ${item.abilityOverride.dexterity}`,
        });
        total += overrideValue;
      }
    }
  }

  const userInitiative = character.initiative;
  if (userInitiative !== total) {
    sources.push({
      name: 'Manual Override',
      type: 'other',
      value: userInitiative - total,
      description: 'User-set initiative modifier',
    });
    total = userInitiative;
  }

  return { total, sources };
}

export async function getSpeedBreakdown(character: Character): Promise<StatBreakdown> {
  const sources: BreakdownSource[] = [];
  
  let raceBaseSpeed = 30;

  try {
    const race = await db.races.get(character.race.toLowerCase());
    if (race) {
      const subrace = character.subrace 
        ? race.subraces?.find(sr => sr.id === character.subrace)
        : undefined;
      
      if (subrace?.speed !== undefined) {
        raceBaseSpeed = subrace.speed;
        sources.push({
          name: `${race.name} (${subrace.name}) Base`,
          type: 'race',
          value: raceBaseSpeed,
        });
      } else {
        raceBaseSpeed = race.speed;
        sources.push({
          name: `${race.name} Base`,
          type: 'race',
          value: raceBaseSpeed,
        });
      }
    } else {
      sources.push({
        name: 'Base Speed',
        type: 'base',
        value: raceBaseSpeed,
      });
    }
  } catch {
    sources.push({
      name: 'Base Speed',
      type: 'base',
      value: raceBaseSpeed,
    });
  }

  let total = raceBaseSpeed;

  const featSpeedBonuses = character.feats.filter(f => 
    'speed' in (f.statModifiers || {})
  );
  
  for (const feat of featSpeedBonuses) {
    const bonus = (feat.statModifiers as Record<string, number>).speed || 0;
    if (bonus) {
      sources.push({
        name: feat.name,
        type: 'feat',
        value: bonus,
      });
      total += bonus;
    }
  }

  const itemSpeedBonuses = character.equipment.filter(e => 
    e.equipped && 'speed' in (e.statModifiers || {})
  );
  for (const item of itemSpeedBonuses) {
    const bonus = (item.statModifiers as Record<string, number>).speed || 0;
    if (bonus) {
      sources.push({
        name: item.name,
        type: 'equipment',
        value: bonus,
      });
      total += bonus;
    }
  }

  if (character.speed !== total) {
    sources.push({
      name: 'Manual Override',
      type: 'other',
      value: character.speed - total,
      description: 'User-set speed',
    });
    total = character.speed;
  }

  return { total, sources };
}

export interface VisionBreakdown {
  darkvision: StatBreakdown;
  blindsight: StatBreakdown;
  truesight: StatBreakdown;
}

export async function getVisionBreakdown(character: Character): Promise<VisionBreakdown> {
  const getBreakdown = async (
    currentValue: number | undefined,
    type: 'darkvision' | 'blindsight' | 'truesight'
  ): Promise<StatBreakdown> => {
    const sources: BreakdownSource[] = [];
    
    let raceValue = 0;
    const total = currentValue || 0;

    try {
      const race = await db.races.get(character.race.toLowerCase());
      if (race) {
        const subrace = character.subrace 
          ? race.subraces?.find(sr => sr.id === character.subrace)
          : undefined;

        if (type === 'darkvision' && subrace?.darkvision !== undefined) {
          raceValue = subrace.darkvision;
          sources.push({
            name: `${race.name} (${subrace.name}) Darkvision`,
            type: 'race',
            value: raceValue,
          });
        } else {
          const feature = race.features.find(f => 
            f.name.toLowerCase().includes(type)
          );
          if (feature) {
            const match = feature.description.match(/(\d+)\s*feet/);
            if (match) {
              raceValue = parseInt(match[1], 10);
              sources.push({
                name: `${race.name} ${type === 'darkvision' ? 'Darkvision' : type === 'blindsight' ? 'Blindsight' : 'Truesight'}`,
                type: 'race',
                value: raceValue,
              });
            }
          }
        }
      }
    } catch {
      // race lookup failed
    }

    if (total !== raceValue && currentValue) {
      sources.push({
        name: 'Manual Override',
        type: 'other',
        value: currentValue,
      });
    }

    return { total, sources };
  };

  const [darkvision, blindsight, truesight] = await Promise.all([
    getBreakdown(character.vision.darkvision, 'darkvision'),
    getBreakdown(character.vision.blindsight, 'blindsight'),
    getBreakdown(character.vision.truesight, 'truesight'),
  ]);

  return { darkvision, blindsight, truesight };
}
