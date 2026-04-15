import { describe, expect, it } from 'vitest';
import { srdClasses } from './srdClasses';

const remediatedLevelOneChoices: Array<{ className: string; featureName: string }> = [
  { className: 'Cleric', featureName: 'Divine Domain' },
  { className: 'Fighter', featureName: 'Fighting Style' },
  { className: 'Ranger', featureName: 'Favored Enemy' },
  { className: 'Ranger', featureName: 'Natural Explorer' },
  { className: 'Rogue', featureName: 'Expertise' },
  { className: 'Sorcerer', featureName: 'Sorcerous Origin' },
  { className: 'Warlock', featureName: 'Otherworldly Patron' },
];

describe('srdClasses level 1 choices integrity', () => {
  it.each(remediatedLevelOneChoices)('has optionDetails for $className $featureName', (target) => {
    const dndClass = srdClasses.find(cls => cls.name === target.className);
    expect(dndClass, `Class not found: ${target.className}`).toBeTruthy();

      const feature = dndClass?.features.find(f => f.name === target.featureName && f.levelAcquired === 1);
      expect(feature, `Feature not found: ${target.className} ${target.featureName}`).toBeTruthy();

      const choices = feature?.choices;
      expect(choices, `Missing choices for: ${target.className} ${target.featureName}`).toBeTruthy();
      expect(choices?.options.length).toBeGreaterThan(0);
      expect(choices?.optionDetails, `Missing optionDetails for: ${target.className} ${target.featureName}`).toBeTruthy();

      const optionDetails = choices?.optionDetails ?? {};

      for (const option of choices?.options ?? []) {
        expect(optionDetails[option], `Missing option detail for: ${target.className} ${target.featureName} -> ${option}`).toBeTruthy();
      }

      for (const optionWithDetail of Object.keys(optionDetails)) {
        expect(choices?.options.includes(optionWithDetail), `Unexpected option detail key: ${target.className} ${target.featureName} -> ${optionWithDetail}`).toBe(true);
      }
    }
  );
});
