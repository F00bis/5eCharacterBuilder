import type { Character, Feat } from '../types';

export interface DisplayFeature {
  name: string;
  description: string;
  source: 'race' | 'class' | 'feat';
  sourceDetail: string;
  levelAcquired?: number;
}

export interface GroupedFeatures {
  raceFeatures: { raceName: string; features: DisplayFeature[] };
  classFeatures: { className: string; features: DisplayFeature[] }[];
  featFeatures: DisplayFeature[];
}

function mapRaceFeature(
  name: string,
  description: string,
  raceName: string
): DisplayFeature {
  return {
    name,
    description,
    source: 'race',
    sourceDetail: raceName,
  };
}

function mapClassFeature(
  name: string,
  description: string,
  className: string,
  level: number
): DisplayFeature {
  return {
    name,
    description,
    source: 'class',
    sourceDetail: `${className} (Lvl ${level})`,
    levelAcquired: level,
  };
}

function mapFeatFeature(feat: Feat): DisplayFeature {
  return {
    name: feat.name,
    description: feat.description || '',
    source: 'feat',
    sourceDetail: feat.name,
  };
}

export async function getCharacterFeatures(character: Character): Promise<GroupedFeatures> {
  const result: GroupedFeatures = {
    raceFeatures: { raceName: '', features: [] },
    classFeatures: [],
    featFeatures: [],
  };

  // Get race features
  try {
    const { db } = await import('../db/index');
    const race = await db.races.get(character.race);

    if (race) {
      const raceFeatureList: DisplayFeature[] = [];

      // Map regular racial features
      for (const feature of race.features || []) {
        raceFeatureList.push(
          mapRaceFeature(feature.name, feature.description, race.name)
        );
      }

      // Map racial saving throw features
      for (const stFeature of race.savingThrowFeatures || []) {
        const typeLabel = stFeature.type === 'advantage' ? 'Advantage' : 'Resistance';
        raceFeatureList.push(
          mapRaceFeature(
            `${typeLabel} on Saving Throws`,
            stFeature.description,
            race.name
          )
        );
      }

      result.raceFeatures = {
        raceName: race.name,
        features: raceFeatureList,
      };
    }
  } catch {
    // Race not found, skip
  }

  // Get class features (filtered by level)
  for (const classEntry of character.classes) {
    try {
      const { getClassByName } = await import('../db/classes');
      const dndClass = await getClassByName(classEntry.className);

      if (dndClass?.features) {
        const classFeatureList: DisplayFeature[] = [];

        for (const feature of dndClass.features) {
          if (feature.levelAcquired <= classEntry.level) {
            classFeatureList.push(
              mapClassFeature(
                feature.name,
                feature.description,
                dndClass.name,
                feature.levelAcquired
              )
            );
          }
        }

        if (classFeatureList.length > 0) {
          result.classFeatures.push({
            className: dndClass.name,
            features: classFeatureList,
          });
        }
      }
    } catch {
      // Class not found, skip
    }
  }

  // Get feat features (stored directly on character)
  for (const feat of character.feats) {
    result.featFeatures.push(mapFeatFeature(feat));
  }

  return result;
}
