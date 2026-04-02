import type { Character, Feat } from '../types';

export interface DisplayFeature {
  name: string;
  description: string;
  source: 'race' | 'class' | 'feat' | 'background' | 'language';
  sourceDetail: string;
  levelAcquired?: number;
}

export interface GroupedFeatures {
  raceFeatures: { raceName: string; features: DisplayFeature[] };
  backgroundFeatures: { backgroundName: string; features: DisplayFeature[] };
  classFeatures: { className: string; features: DisplayFeature[] }[];
  featFeatures: DisplayFeature[];
  languages: string[];
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
    backgroundFeatures: { backgroundName: '', features: [] },
    classFeatures: [],
    featFeatures: [],
    languages: character.languages || [],
  };

  // Get race features
  try {
    const { db } = await import('../db/index');
    const race = await db.races.get(character.race);

    if (race) {
      const raceFeatureList: DisplayFeature[] = [];
      const subrace = character.subrace 
        ? race.subraces?.find(sr => sr.id === character.subrace)
        : undefined;

      const raceName = subrace 
        ? `${race.name} (${subrace.name})`
        : race.name;

      // Map regular racial features
      for (const feature of race.features || []) {
        raceFeatureList.push(
          mapRaceFeature(feature.name, feature.description, raceName)
        );
      }

      // Map subrace features if selected
      if (subrace?.features) {
        for (const feature of subrace.features) {
          raceFeatureList.push(
            mapRaceFeature(feature.name, feature.description, raceName)
          );
        }
      }

      // Map racial saving throw features
      for (const stFeature of race.savingThrowFeatures || []) {
        const typeLabel = stFeature.type === 'advantage' ? 'Advantage' : 'Resistance';
        raceFeatureList.push(
          mapRaceFeature(
            `${typeLabel} on Saving Throws`,
            stFeature.description,
            raceName
          )
        );
      }

      result.raceFeatures = {
        raceName: raceName,
        features: raceFeatureList,
      };
    }
  } catch {
    // Race not found, skip
  }

  // Get background features
  try {
    const { srdBackgrounds } = await import('../data/srdBackgrounds');
    const background = srdBackgrounds.find(b => b.name === character.background);

    if (background && background.features) {
      const bgFeatureList: DisplayFeature[] = [];
      for (const feature of background.features) {
        bgFeatureList.push({
          name: feature.name,
          description: feature.description,
          source: 'background',
          sourceDetail: background.name,
        });
      }
      result.backgroundFeatures = {
        backgroundName: background.name,
        features: bgFeatureList,
      };
    }
  } catch {
    // Background not found, skip
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
            const featureName = feature.name;
            let featureDescription = feature.description;

            if (feature.choices) {
              const featureKey = `${dndClass.name.toLowerCase()}-${feature.levelAcquired}-${feature.name.toLowerCase().replace(/\s+/g, '-')}`;
              const selectedChoice = character.featureChoices[featureKey];

              if (selectedChoice) {
                const choices = Array.isArray(selectedChoice) ? selectedChoice : [selectedChoice];
                featureDescription = `${feature.name}: ${choices.join(', ')}`;
              } else {
                continue;
              }
            }

            classFeatureList.push(
              mapClassFeature(
                featureName,
                featureDescription,
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
