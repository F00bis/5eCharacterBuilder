import type { CharacterBase } from '../types';
import { getAsiLevelsForClass, isAsiLevel } from './asiLevels';

export interface FeatEntitlement {
  source: string;
  type: 'feat-only' | 'feat-or-asi';
  level?: number;
}

/**
 * A map of class name to its ASI level progression, resolved from the DB before
 * calling this function. Any class not present in the map will fall back to the
 * default ASI progression (see getAsiLevelsForClass).
 */
export type AsiLevelsByClass = Record<string, number[]>;

export function calculateFeatEntitlements(
  draft: CharacterBase,
  mode: 'create' | 'levelup',
  asiLevelsByClass: AsiLevelsByClass
): FeatEntitlement[] {
  const entitlements: FeatEntitlement[] = [];

  if (mode === 'create') {
    const subrace = draft.subrace;

    if (subrace === 'variant-human') {
      entitlements.push({
        source: 'Race (Variant Human)',
        type: 'feat-only',
      });
    }
  } else if (mode === 'levelup') {
    const classes = draft.classes || [];
    if (classes.length > 0) {
      const pendingClass = classes.find(c => !c.subclass);
      const className = pendingClass?.className || classes[0]?.className;
      const classLevel = pendingClass?.level || classes[0]?.level || 0;
      const newLevel = classLevel;

      if (className) {
        const asiLevels = getAsiLevelsForClass(asiLevelsByClass[className]);
        if (isAsiLevel(asiLevels, newLevel)) {
          entitlements.push({
            source: `Class (${className} ${newLevel})`,
            type: 'feat-or-asi',
            level: newLevel,
          });
        }
      }
    }
  }

  return entitlements;
}

export function getEntitlementSourceLabel(entitlement: FeatEntitlement): string {
  return entitlement.source;
}

export function hasEntitlements(entitlements: FeatEntitlement[]): boolean {
  return entitlements.length > 0;
}

export function getFeatEntitlementLabel(entitlement: FeatEntitlement): string {
  return entitlement.source;
}
