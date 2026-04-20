import { srdClasses } from '../data/srdClasses';
import type { ClassEntry } from '../types';

type BuilderMode = 'create' | 'levelup';

export interface ProficiencyEntitlementInput {
  mode: BuilderMode;
  draftClasses: ClassEntry[];
  baseClassesSnapshot: ClassEntry[];
  currentPassClassName: string | null;
}

export interface ProficiencyEntitlement {
  showProficienciesStep: boolean;
  className: string | null;
  skillChoicesCount: number;
}

function sumLevelsByClass(classes: ClassEntry[]): Map<string, number> {
  return classes.reduce((acc, entry) => {
    const current = acc.get(entry.className) ?? 0;
    acc.set(entry.className, current + entry.level);
    return acc;
  }, new Map<string, number>());
}

function getMulticlassSkillChoiceCount(className: string): number {
  const classData = srdClasses.find(c => c.name === className);
  return classData?.multiclassing?.proficienciesGained.skills ?? 0;
}

export function calculateProficiencyEntitlement(
  input: ProficiencyEntitlementInput
): ProficiencyEntitlement {
  const { mode, draftClasses, baseClassesSnapshot, currentPassClassName } = input;

  if (mode === 'create') {
    const className = draftClasses[0]?.className ?? null;
    const classData = className ? srdClasses.find(c => c.name === className) : undefined;

    return {
      showProficienciesStep: true,
      className,
      skillChoicesCount: classData?.skillProficienciesChoices ?? 0,
    };
  }

  if (!currentPassClassName) {
    return {
      showProficienciesStep: false,
      className: null,
      skillChoicesCount: 0,
    };
  }

  const baseLevelsByClass = sumLevelsByClass(baseClassesSnapshot);
  const draftLevelsByClass = sumLevelsByClass(draftClasses);
  const baseLevel = baseLevelsByClass.get(currentPassClassName) ?? 0;
  const currentLevel = draftLevelsByClass.get(currentPassClassName) ?? 0;
  const isNewClassThisPass = baseLevel === 0 && currentLevel > 0;
  const skillChoicesCount = isNewClassThisPass
    ? getMulticlassSkillChoiceCount(currentPassClassName)
    : 0;

  return {
    showProficienciesStep: isNewClassThisPass && skillChoicesCount > 0,
    className: currentPassClassName,
    skillChoicesCount,
  };
}
