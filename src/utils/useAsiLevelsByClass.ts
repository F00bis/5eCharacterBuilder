import { useEffect, useState } from 'react';
import { getAsiLevelsByClass } from '../db/classes';
import type { AsiLevelsByClass } from './featEntitlements';

/**
 * Loads the ASI level progression for every class stored in the DB and returns
 * it as an AsiLevelsByClass map (class name -> number[]).
 *
 * Returns an empty map while loading so callers receive a stable (non-null)
 * value from the first render. When the map is empty, calculateFeatEntitlements
 * will fall back to DEFAULT_ASI_LEVELS for any class, which is safe.
 */
export function useAsiLevelsByClass(): AsiLevelsByClass {
  const [asiLevelsByClass, setAsiLevelsByClass] = useState<AsiLevelsByClass>({});

  useEffect(() => {
    let cancelled = false;
    getAsiLevelsByClass().then(map => {
      if (!cancelled) {
        setAsiLevelsByClass(map);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return asiLevelsByClass;
}
