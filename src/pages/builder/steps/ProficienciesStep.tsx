import { useEffect, useMemo } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdClasses } from '../../../data/srdClasses';
import type { Skill, SkillProficiency } from '../../../types';
import type { DndClass } from '../../../types/classes';
import { calculateProficiencyEntitlement } from '../../../utils/proficiencyEntitlements';
import { SKILL_ABILITY_MAP, SKILL_DISPLAY_NAMES } from '../../../utils/skills';

export default function ProficienciesStep() {
  const { state, dispatch } = useCharacterBuilder();

  const proficiencyEntitlement = useMemo(() => {
    return calculateProficiencyEntitlement({
      mode: state.mode,
      draftClasses: state.draft.classes || [],
      baseClassesSnapshot: state.baseClassesSnapshot,
      currentPassClassName: state.currentPassClassName,
    });
  }, [state.mode, state.draft.classes, state.baseClassesSnapshot, state.currentPassClassName]);

  const effectiveClassName =
    state.mode === 'create'
      ? proficiencyEntitlement.className || state.draft.classes?.[0]?.className || ''
      : proficiencyEntitlement.className || '';

  const classData = useMemo<DndClass | undefined>(() => {
    return srdClasses.find(c => c.name === effectiveClassName);
  }, [effectiveClassName]);

  const draftSkills = useMemo(() => state.draft.skills || [], [state.draft.skills]);

  const backgroundSkills = useMemo(() => {
    return draftSkills.filter(
      (s): s is SkillProficiency => s !== undefined && s.source === 'Background'
    );
  }, [draftSkills]);

  const raceSkills = useMemo(() => {
    return draftSkills.filter(
      (s): s is SkillProficiency => 
        s !== undefined && 
        s.source !== undefined && 
        (s.source === 'Race' || s.source.startsWith('Race:'))
    );
  }, [draftSkills]);

  const nonClassSkills = useMemo(() => {
    const all: Skill[] = [
      ...backgroundSkills.map(s => s.skill),
      ...raceSkills.map(s => s.skill),
    ];
    return [...new Set(all)];
  }, [backgroundSkills, raceSkills]);

  const skillChoicesCount = useMemo(() => {
    if (!classData) return 0;
    if (state.mode === 'levelup') {
      return proficiencyEntitlement.skillChoicesCount;
    }
    return classData.skillProficienciesChoices;
  }, [classData, state.mode, proficiencyEntitlement.skillChoicesCount]);

  const availableSkillsForClass = useMemo(() => {
    if (!classData) return [];
    return classData.skillOptions as Skill[];
  }, [classData]);

  const lockedSkills = useMemo(() => {
    const locked = new Set<Skill>();
    availableSkillsForClass.forEach(skill => {
      if (nonClassSkills.includes(skill)) {
        locked.add(skill);
      }
    });
    return locked;
  }, [availableSkillsForClass, nonClassSkills]);

  const currentClassSkills = useMemo(() => {
    return draftSkills.filter(
      (s): s is SkillProficiency => 
        s !== undefined && 
        s.source !== undefined && 
        s.source.startsWith('Class:')
    );
  }, [draftSkills]);

  const effectiveClassNameSkills = useMemo(() => {
    return currentClassSkills
      .filter(s => s.source === `Class: ${effectiveClassName}`)
      .map(s => s.skill);
  }, [currentClassSkills, effectiveClassName]);

  const userSelectedClassSkills = useMemo(() => {
    const selected = currentClassSkills
      .filter(s => s.source === `Class: ${effectiveClassName}` && s.level !== 'none')
      .map(s => s.skill)
      .filter(skill => !lockedSkills.has(skill));
    return [...new Set(selected)];
  }, [currentClassSkills, effectiveClassName, lockedSkills]);

  const allProficientSkills = useMemo(() => {
    const classProficient = currentClassSkills
      .filter(s => s.source === `Class: ${effectiveClassName}` && s.level !== 'none')
      .map(s => s.skill);
    const bgProficient = backgroundSkills.map(s => s.skill);
    const raceProficient = raceSkills.map(s => s.skill);
    return [...new Set([...classProficient, ...bgProficient, ...raceProficient])];
  }, [currentClassSkills, effectiveClassName, backgroundSkills, raceSkills]);

  const remainingChoices = skillChoicesCount;

  const handleSkillToggle = (skill: Skill) => {
    if (lockedSkills.has(skill)) return;

    if (effectiveClassNameSkills.includes(skill)) {
      const updatedSkills = draftSkills.filter(s => 
        !(s.skill === skill && s.source === `Class: ${effectiveClassName}`)
      );
      dispatch({ type: 'UPDATE_DRAFT', updates: { skills: updatedSkills } });
    } else {
      if (userSelectedClassSkills.length >= skillChoicesCount) return;
      dispatch({
        type: 'ADD_ITEM_WITH_SOURCE',
        listName: 'skills',
        item: {
          skill,
          ability: SKILL_ABILITY_MAP[skill],
          level: 'proficient',
          source: `Class: ${effectiveClassName}`,
        },
      });
    }
  };

  const isValid = useMemo(() => {
    if (!classData) return false;
    
    if (userSelectedClassSkills.length !== skillChoicesCount) return false;
    
    return true;
  }, [
    classData, 
    userSelectedClassSkills.length, 
    skillChoicesCount
  ]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP_VALIDATION', stepId: 'proficiencies', isValid });
  }, [isValid, dispatch]);

  const hasClassInDraft = state.draft.classes && state.draft.classes.length > 0;

  if (!hasClassInDraft) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-500 py-8">
          Please complete the Class step first to configure proficiencies.
        </div>
      </div>
    );
  }

  if (!effectiveClassName) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-500 py-8">
          Please complete the Class step first to configure proficiencies.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold">Proficiencies & Skills</h2>
        <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700">
          Class: <span className="font-semibold">{effectiveClassName}</span>
        </div>
      </div>

      {(backgroundSkills.length > 0 || raceSkills.length > 0) && (
        <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Already Known Skills</h3>
          <div className="flex flex-wrap gap-2">
            {raceSkills.map(skill => (
              <span 
                key={`race-${skill.skill}`}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1"
              >
                <span className="opacity-50">R:</span>
                {SKILL_DISPLAY_NAMES[skill.skill]}
              </span>
            ))}
            {backgroundSkills.map(skill => (
              <span 
                key={`bg-${skill.skill}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
              >
                <span className="opacity-50">BG:</span>
                {SKILL_DISPLAY_NAMES[skill.skill]}
              </span>
            ))}
          </div>
        </div>
      )}

      {classData && (
        <>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">
              Choose {remainingChoices} skill{remainingChoices !== 1 ? 's' : ''} from:
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {availableSkillsForClass.map(s => SKILL_DISPLAY_NAMES[s]).join(', ')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {availableSkillsForClass.map(skill => {
                const isUserSelected = allProficientSkills.includes(skill);
                const isLocked = lockedSkills.has(skill);
                const isFromBackground = backgroundSkills.some(s => s.skill === skill);
                const isFromRace = raceSkills.some(s => s.skill === skill);
                const isLockedForSelection = isLocked || isFromBackground || isFromRace;
                
                return (
                  <button
                    key={skill}
                    data-state={isUserSelected ? 'selected' : 'available'}
                    onClick={() => handleSkillToggle(skill)}
                    disabled={isLockedForSelection && !isUserSelected}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isLockedForSelection
                        ? isUserSelected
                          ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isUserSelected
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{SKILL_DISPLAY_NAMES[skill]}</span>
                      {isUserSelected && (
                        <span className="text-xs">
                          {isFromBackground ? 'BG' : isFromRace ? 'R' : '✓'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="text-sm text-slate-600">
              {userSelectedClassSkills.length}/{remainingChoices} selected
            </div>
          </div>

        </>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">Selection Summary</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>Class Skills: {userSelectedClassSkills.length}/{remainingChoices}</li>
        </ul>
        {isValid ? (
          <p className="text-green-800 font-medium mt-2">All selections complete!</p>
        ) : (
          <p className="text-amber-700 font-medium mt-2">Please complete all selections.</p>
        )}
      </div>
    </div>
  );
}
