export const DEFAULT_ASI_LEVELS: number[] = [4, 8, 12, 16, 19];

/**
 * Returns the ASI levels for a class. Falls back to DEFAULT_ASI_LEVELS
 * when the provided array is undefined or empty (e.g. for legacy data or
 * custom classes that omit the field).
 */
export function getAsiLevelsForClass(asiLevels: number[] | undefined): number[] {
  if (!asiLevels || asiLevels.length === 0) {
    return DEFAULT_ASI_LEVELS;
  }
  return asiLevels;
}

/**
 * Returns true if the given level is an ASI level for the provided progression.
 */
export function isAsiLevel(asiLevels: number[], level: number): boolean {
  return asiLevels.includes(level);
}

/**
 * Returns the next ASI level after currentLevel, or null if there are none.
 */
export function getNextAsiLevel(asiLevels: number[], currentLevel: number): number | null {
  const nextLevel = asiLevels.find(level => level > currentLevel);
  return nextLevel ?? null;
}

/**
 * Returns the type of choice available at an ASI level.
 * Currently all ASI levels grant an ASI-or-Feat choice.
 */
export function getAsiChoiceType(_asiLevels: number[], _level: number): 'ASI' | 'Feat' | 'ASI-or-Feat' {
  return 'ASI-or-Feat';
}
