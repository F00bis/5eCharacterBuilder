import { describe, it, expect } from 'vitest';
import { srdManeuvers } from './srdManeuvers';

describe('srdManeuvers data integrity', () => {
  it('contains at least 16 maneuvers', () => {
    expect(srdManeuvers.length).toBeGreaterThanOrEqual(16);
  });

  it('every maneuver has a name and description', () => {
    for (const maneuver of srdManeuvers) {
      expect(maneuver.name).toBeTruthy();
      expect(maneuver.description).toBeTruthy();
    }
  });

  it('has no duplicate names', () => {
    const names = srdManeuvers.map(m => m.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});
