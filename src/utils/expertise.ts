import type { ExpertiseChoiceStore, Skill, SkillProficiency } from '../types';

const PROFICIENCY_RANK = {
  none: 0,
  proficient: 1,
  expertise: 2,
} as const;

export function applyExpertiseChoices(
  skills: SkillProficiency[],
  choices: ExpertiseChoiceStore
): SkillProficiency[] {
  const selectedSkills = new Set<Skill>(Object.values(choices).flat());
  const normalized = new Map<Skill, SkillProficiency>();

  for (const proficiency of skills) {
    const existing = normalized.get(proficiency.skill);
    if (!existing) {
      normalized.set(proficiency.skill, { ...proficiency });
      continue;
    }

    if (PROFICIENCY_RANK[proficiency.level] > PROFICIENCY_RANK[existing.level]) {
      normalized.set(proficiency.skill, { ...existing, level: proficiency.level });
    }
  }

  return [...normalized.values()].map(proficiency => {
    if (proficiency.level === 'none' || !selectedSkills.has(proficiency.skill)) {
      return proficiency;
    }

    return { ...proficiency, level: 'expertise' };
  });
}
