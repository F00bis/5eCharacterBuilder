export function getXpForLevel(level: number): number {
  const xpTable: Record<number, number> = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000,
  };
  
  return xpTable[level] ?? 0;
}

export function getXpForNextLevel(currentLevel: number): number {
  return getXpForLevel(currentLevel + 1);
}

export function getXpProgress(currentXp: number, currentLevel: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  const levelStartXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  const needed = nextLevelXp - levelStartXp;
  const current = currentXp - levelStartXp;
  
  return {
    current: Math.max(0, current),
    needed,
    percentage: Math.min(100, Math.max(0, (current / needed) * 100))
  };
}
