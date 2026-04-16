import type { Character, InitiativeBonus } from '../types';
import { getAbilityBreakdown, getModifier } from './abilityScores';
import { db } from '../db';
import { srdBackgrounds } from '../data/srdBackgrounds';
import { srdRaces } from '../data/srdRaces';

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
  type: 'base' | 'race' | 'background' | 'feat' | 'equipment' | 'class' | 'other';
  value: number;
  description?: string;
}

export interface StatBreakdown {
  total: number;
  sources: BreakdownSource[];
}

function resolveInitiativeBonus(bonus: InitiativeBonus | undefined, proficiencyBonus: number): number {
  if (!bonus) return 0;
  return bonus.type === 'flat' ? bonus.value : proficiencyBonus;
}

function getDexterityInitiativeBreakdown(character: Character): StatBreakdown {
  const sources: BreakdownSource[] = [];
  const dexterity = getAbilityBreakdown('dexterity', character);

  let currentScore = dexterity.baseScore + dexterity.racialBonus;
  let currentModifier = getModifier(currentScore);

  sources.push({
    name: 'Dexterity Modifier',
    type: 'base',
    value: currentModifier,
  });

  const applyDexteritySource = (
    name: string,
    type: BreakdownSource['type'],
    scoreDelta: number,
    description?: string
  ) => {
    if (scoreDelta === 0) return;

    const nextScore = currentScore + scoreDelta;
    const nextModifier = getModifier(nextScore);
    const modifierDelta = nextModifier - currentModifier;

    currentScore = nextScore;
    currentModifier = nextModifier;

    if (modifierDelta !== 0) {
      sources.push({ name, type, value: modifierDelta, description });
    }
  };

  for (const featSource of dexterity.featSources) {
    applyDexteritySource(featSource.name, 'feat', featSource.value);
  }

  for (const equipmentSource of dexterity.equipmentSources) {
    applyDexteritySource(equipmentSource.name, 'equipment', equipmentSource.value);
  }

  if (dexterity.override !== null) {
    const featBonus = dexterity.featSources.reduce((sum, source) => sum + source.value, 0);
    const overrideScore = dexterity.override.value + featBonus;
    const nextModifier = getModifier(overrideScore);
    const modifierDelta = nextModifier - currentModifier;

    currentScore = overrideScore;
    currentModifier = nextModifier;

    if (modifierDelta !== 0) {
      sources.push({
        name: dexterity.override.name,
        type: 'equipment',
        value: modifierDelta,
        description: `Sets DEX to ${dexterity.override.value}`,
      });
    }
  }

  return { total: currentModifier, sources };
}

function getExplicitInitiativeBreakdown(character: Character): StatBreakdown {
  const sources: BreakdownSource[] = [];
  let total = 0;

  const race = srdRaces.find((entry) => entry.name === character.race);
  const subrace = character.subrace
    ? race?.subraces?.find((entry) => entry.id === character.subrace)
    : undefined;

  const raceBonus = resolveInitiativeBonus(race?.initiativeBonus, character.proficiencyBonus);
  if (raceBonus !== 0 && race) {
    sources.push({ name: race.name, type: 'race', value: raceBonus });
    total += raceBonus;
  }

  const subraceBonus = resolveInitiativeBonus(subrace?.initiativeBonus, character.proficiencyBonus);
  if (subraceBonus !== 0 && race && subrace) {
    sources.push({ name: `${race.name} (${subrace.name})`, type: 'race', value: subraceBonus });
    total += subraceBonus;
  }

  for (const feat of character.feats) {
    const bonus = resolveInitiativeBonus(feat.initiativeBonus, character.proficiencyBonus);

    if (bonus !== 0) {
      sources.push({ name: feat.name, type: 'feat', value: bonus });
      total += bonus;
    }
  }

  for (const item of character.equipment) {
    if (!item.equipped) continue;

    const bonus = resolveInitiativeBonus(item.initiativeBonus, character.proficiencyBonus);

    if (bonus !== 0) {
      const type: BreakdownSource['type'] = item.source === 'Background' ? 'background' : 'equipment';
      sources.push({ name: item.name, type, value: bonus });
      total += bonus;
    }
  }

  const selectedBackground = srdBackgrounds.find((background) => background.name === character.background);
  if (selectedBackground) {
    const backgroundBonus = resolveInitiativeBonus(selectedBackground.initiativeBonus, character.proficiencyBonus);

    if (backgroundBonus !== 0) {
      sources.push({
        name: selectedBackground.name,
        type: 'background',
        value: backgroundBonus,
      });
      total += backgroundBonus;
    }
  }

  return { total, sources };
}

function getCalculatedInitiativeBreakdown(character: Character): StatBreakdown {
  const dexterityBreakdown = getDexterityInitiativeBreakdown(character);
  const explicitInitiativeBreakdown = getExplicitInitiativeBreakdown(character);

  return {
    total: dexterityBreakdown.total + explicitInitiativeBreakdown.total,
    sources: [...dexterityBreakdown.sources, ...explicitInitiativeBreakdown.sources],
  };
}

export function calculateInitiative(character: Character): number {
  return getCalculatedInitiativeBreakdown(character).total;
}

export async function getInitiativeBreakdown(character: Character): Promise<StatBreakdown> {
  const calculated = getCalculatedInitiativeBreakdown(character);
  const sources = [...calculated.sources];
  let total = calculated.total;

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
