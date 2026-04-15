import type { ClassEntry } from '../types';
import type {
  ExpertiseEntitlement,
  InvocationEntitlement,
  MetamagicEntitlement,
  MysticArcanumEntitlement,
  ProgressionDomain,
} from '../types/progression';

type LevelCountMap = Record<number, number>;

interface ProgressionRuleOverrides {
  expertiseByClass?: Record<string, LevelCountMap>;
  metamagicByClass?: Record<string, LevelCountMap>;
  invocationKnownByClassLevel?: Record<string, number[]>;
  mysticArcanumByClass?: Record<string, Record<number, 6 | 7 | 8 | 9>>;
}

const DEFAULT_EXPERTISE_BY_CLASS: Record<string, LevelCountMap> = {
  Bard: { 3: 2, 10: 2 },
  Rogue: { 1: 2, 6: 2 },
};

const DEFAULT_METAMAGIC_BY_CLASS: Record<string, LevelCountMap> = {
  Sorcerer: { 3: 2, 10: 1, 17: 1 },
};

const DEFAULT_INVOCATION_KNOWN_BY_LEVEL: number[] = [
  0,
  0,
  2,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  5,
  6,
  6,
  6,
  7,
  7,
  7,
  8,
  8,
  8,
];

const DEFAULT_MYSTIC_ARCANUM_BY_CLASS: Record<string, Record<number, 6 | 7 | 8 | 9>> = {
  Warlock: { 11: 6, 13: 7, 15: 8, 17: 9 },
};

function toSourceKey(domain: ProgressionDomain, entry: ClassEntry, classIndex: number): string {
  const classSlug = entry.className.trim().toLowerCase().replace(/\s+/g, '-');
  return `${domain}:${classIndex}:${classSlug}:${entry.level}`;
}

function classProgressionFor(
  className: string,
  overrides: Record<string, LevelCountMap> | undefined,
  defaults: Record<string, LevelCountMap>
): LevelCountMap | null {
  return overrides?.[className] ?? defaults[className] ?? null;
}

export function calculateExpertiseEntitlements(
  classes: ClassEntry[],
  overrides: ProgressionRuleOverrides = {}
): ExpertiseEntitlement[] {
  const entitlements: ExpertiseEntitlement[] = [];

  classes.forEach((entry, classIndex) => {
    const rule = classProgressionFor(entry.className, overrides.expertiseByClass, DEFAULT_EXPERTISE_BY_CLASS);
    if (!rule) return;

    const count = rule[entry.level] ?? 0;
    if (count <= 0) return;

    entitlements.push({
      domain: 'expertise',
      className: entry.className,
      classIndex,
      level: entry.level,
      count,
      sourceKey: toSourceKey('expertise', entry, classIndex),
    });
  });

  return entitlements;
}

export function calculateMetamagicEntitlements(
  classes: ClassEntry[],
  overrides: ProgressionRuleOverrides = {}
): MetamagicEntitlement[] {
  const entitlements: MetamagicEntitlement[] = [];

  classes.forEach((entry, classIndex) => {
    const rule = classProgressionFor(entry.className, overrides.metamagicByClass, DEFAULT_METAMAGIC_BY_CLASS);
    if (!rule) return;

    const count = rule[entry.level] ?? 0;
    if (count <= 0) return;

    entitlements.push({
      domain: 'metamagic',
      className: entry.className,
      classIndex,
      level: entry.level,
      count,
      sourceKey: toSourceKey('metamagic', entry, classIndex),
    });
  });

  return entitlements;
}

export function calculateInvocationEntitlements(
  classes: ClassEntry[],
  overrides: ProgressionRuleOverrides = {}
): InvocationEntitlement[] {
  const entitlements: InvocationEntitlement[] = [];

  classes.forEach((entry, classIndex) => {
    const progression =
      overrides.invocationKnownByClassLevel?.[entry.className] ??
      (entry.className === 'Warlock' ? DEFAULT_INVOCATION_KNOWN_BY_LEVEL : undefined);

    if (!progression) return;

    const level = Math.max(0, Math.min(entry.level, progression.length - 1));
    const currentKnown = progression[level] ?? 0;
    const previousKnown = progression[Math.max(0, level - 1)] ?? 0;
    const gainedCount = Math.max(0, currentKnown - previousKnown);
    if (gainedCount <= 0) return;

    entitlements.push({
      domain: 'invocation',
      className: entry.className,
      classIndex,
      level: entry.level,
      count: gainedCount,
      sourceKey: toSourceKey('invocation', entry, classIndex),
    });
  });

  return entitlements;
}

export function calculateMysticArcanumEntitlements(
  classes: ClassEntry[],
  overrides: ProgressionRuleOverrides = {}
): MysticArcanumEntitlement[] {
  const entitlements: MysticArcanumEntitlement[] = [];

  classes.forEach((entry, classIndex) => {
    const map =
      overrides.mysticArcanumByClass?.[entry.className] ??
      DEFAULT_MYSTIC_ARCANUM_BY_CLASS[entry.className];

    if (!map) return;

    const arcanumLevel = map[entry.level];
    if (!arcanumLevel) return;

    entitlements.push({
      domain: 'mystic-arcanum',
      className: entry.className,
      classIndex,
      level: entry.level,
      count: 1,
      arcanumLevel,
      sourceKey: toSourceKey('mystic-arcanum', entry, classIndex),
    });
  });

  return entitlements;
}

export function hasProgressionEntitlements(classes: ClassEntry[]): boolean {
  return (
    calculateExpertiseEntitlements(classes).length > 0 ||
    calculateMetamagicEntitlements(classes).length > 0 ||
    calculateInvocationEntitlements(classes).length > 0 ||
    calculateMysticArcanumEntitlements(classes).length > 0
  );
}
