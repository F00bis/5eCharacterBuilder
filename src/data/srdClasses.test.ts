import { describe, expect, it } from 'vitest';
import { srdClasses } from './srdClasses';

type ChoiceTarget = {
  className: string;
  featureName: string;
  levelAcquired: number;
};

const remediatedLevelOneChoices: ChoiceTarget[] = [
  { className: 'Cleric', featureName: 'Divine Domain', levelAcquired: 1 },
  { className: 'Fighter', featureName: 'Fighting Style', levelAcquired: 1 },
  { className: 'Ranger', featureName: 'Favored Enemy', levelAcquired: 1 },
  { className: 'Ranger', featureName: 'Natural Explorer', levelAcquired: 1 },
  { className: 'Rogue', featureName: 'Expertise', levelAcquired: 1 },
  { className: 'Sorcerer', featureName: 'Sorcerous Origin', levelAcquired: 1 },
  { className: 'Warlock', featureName: 'Otherworldly Patron', levelAcquired: 1 },
];

const remediatedNonLevelOneChoices: ChoiceTarget[] = [
  { className: 'Barbarian', featureName: 'Primal Path', levelAcquired: 3 },
  { className: 'Bard', featureName: 'Bard College', levelAcquired: 3 },
  { className: 'Druid', featureName: 'Druid Circle', levelAcquired: 2 },
  { className: 'Fighter', featureName: 'Martial Archetype', levelAcquired: 3 },
  { className: 'Monk', featureName: 'Monastic Tradition', levelAcquired: 3 },
  { className: 'Paladin', featureName: 'Fighting Style', levelAcquired: 2 },
  { className: 'Paladin', featureName: 'Sacred Oath', levelAcquired: 3 },
  { className: 'Ranger', featureName: 'Fighting Style', levelAcquired: 2 },
  { className: 'Ranger', featureName: 'Ranger Archetype', levelAcquired: 3 },
  { className: 'Rogue', featureName: 'Roguish Archetype', levelAcquired: 3 },
  { className: 'Warlock', featureName: 'Pact Boon', levelAcquired: 3 },
  { className: 'Wizard', featureName: 'Arcane Tradition', levelAcquired: 2 },
];

function assertChoiceIntegrity(target: ChoiceTarget): void {
  const dndClass = srdClasses.find(cls => cls.name === target.className);
  expect(dndClass, `Class not found: ${target.className}`).toBeTruthy();

  const feature = dndClass?.features.find(
    f => f.name === target.featureName && f.levelAcquired === target.levelAcquired
  );
  expect(
    feature,
    `Feature not found: ${target.className} ${target.featureName} (level ${target.levelAcquired})`
  ).toBeTruthy();

  const choices = feature?.choices;
  expect(
    choices,
    `Missing choices for: ${target.className} ${target.featureName} (level ${target.levelAcquired})`
  ).toBeTruthy();
  expect(choices?.options.length).toBeGreaterThan(0);
  expect(
    choices?.optionDetails,
    `Missing optionDetails for: ${target.className} ${target.featureName} (level ${target.levelAcquired})`
  ).toBeTruthy();

  const optionDetails = choices?.optionDetails ?? {};

  for (const option of choices?.options ?? []) {
    expect(
      optionDetails[option],
      `Missing option detail for: ${target.className} ${target.featureName} -> ${option}`
    ).toBeTruthy();
  }

  for (const optionWithDetail of Object.keys(optionDetails)) {
    expect(
      choices?.options.includes(optionWithDetail),
      `Unexpected option detail key: ${target.className} ${target.featureName} -> ${optionWithDetail}`
    ).toBe(true);
  }
}

describe('srdClasses remediated choices integrity', () => {
  it.each(remediatedLevelOneChoices)('keeps level 1 optionDetails for $className $featureName', (target) => {
    assertChoiceIntegrity(target);
  });

  it.each(remediatedNonLevelOneChoices)('has optionDetails for non-level-1 $className $featureName', (target) => {
    assertChoiceIntegrity(target);
  });
});
