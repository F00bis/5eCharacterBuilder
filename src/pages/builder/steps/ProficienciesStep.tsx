import { useEffect, useMemo, useState } from 'react';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { srdClasses } from '../../../data/srdClasses';
import type { Skill, SkillProficiency } from '../../../types';
import type { DndClass } from '../../../types/classes';
import { SKILL_ABILITY_MAP, SKILL_DISPLAY_NAMES } from '../../../utils/skills';

interface FreeChoice {
  id: number;
  skill: Skill | null;
}

export default function ProficienciesStep() {
  const { state, dispatch } = useCharacterBuilder();
  const [pendingClass, setPendingClass] = useState<string | null>(null);

  const currentTotalLevel = (state.draft.classes || []).reduce((acc, c) => acc + c.level, 0);
  const isLevel1 = currentTotalLevel === 0;
  const isMulticlass = state.mode === 'levelup';

  const draftClassName = state.draft.classes?.[0]?.className || '';
  const effectiveClassName = pendingClass || draftClassName;

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
    if (isMulticlass && !isLevel1) {
      return classData.multiclassing?.proficienciesGained.skills || classData.skillProficienciesChoices;
    }
    return classData.skillProficienciesChoices;
  }, [classData, isMulticlass, isLevel1]);

  const hasExpertise = useMemo(() => {
    if (!classData) return false;
    if (classData.name === 'Rogue') return true;
    if (classData.name === 'Bard') return true;
    return false;
  }, [classData]);

  const expertiseChoicesCount = useMemo(() => {
    if (!classData) return 0;
    if (classData.name === 'Rogue') return 2;
    if (classData.name === 'Bard') return 2;
    return 0;
  }, [classData]);

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

  const freeChoiceSkills = useMemo(() => {
    return draftSkills.filter(
      (s): s is SkillProficiency => 
        s !== undefined && 
        s.source === `Class: ${effectiveClassName}: Free Choice`
    );
  }, [draftSkills, effectiveClassName]);

  const effectiveClassNameSkills = useMemo(() => {
    return currentClassSkills
      .filter(s => s.source === `Class: ${effectiveClassName}` && s.level !== 'expertise')
      .map(s => s.skill);
  }, [currentClassSkills, effectiveClassName]);

  const expertiseSelections = useMemo(() => {
    return currentClassSkills
      .filter(s => s.source === `Class: ${effectiveClassName}` && s.level === 'expertise')
      .map(s => s.skill);
  }, [currentClassSkills, effectiveClassName]);

  const userSelectedClassSkills = useMemo(() => {
    return effectiveClassNameSkills.filter(skill => !lockedSkills.has(skill));
  }, [effectiveClassNameSkills, lockedSkills]);

  const remainingChoices = skillChoicesCount;

  const freeChoices = useMemo<FreeChoice[]>(() => {
    const choices: FreeChoice[] = [];
    for (let i = 0; i < remainingChoices; i++) {
      const existingSkill = freeChoiceSkills[i];
      choices.push({
        id: i,
        skill: existingSkill?.skill || null
      });
    }
    return choices;
  }, [remainingChoices, freeChoiceSkills]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setPendingClass(null);

    if (newClass) {
      const cls = srdClasses.find(c => c.name === newClass);
      if (cls && isLevel1) {
        setPendingClass(cls.name);
      }
    }
  };

  const handleSkillToggle = (skill: Skill) => {
    if (lockedSkills.has(skill)) return;

    if (effectiveClassNameSkills.includes(skill)) {
      dispatch({
        type: 'REMOVE_ITEMS_BY_SOURCE',
        listName: 'skills',
        source: `Class: ${effectiveClassName}`,
      });
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

  const handleFreeChoiceChange = (index: number, skill: Skill | null) => {
    const existingChoice = freeChoiceSkills[index];
    
    if (existingChoice) {
      dispatch({
        type: 'REMOVE_ITEMS_BY_SOURCE',
        listName: 'skills',
        source: `Class: ${effectiveClassName}: Free Choice`,
      });
    }

    if (skill) {
      dispatch({
        type: 'ADD_ITEM_WITH_SOURCE',
        listName: 'skills',
        item: {
          skill,
          ability: SKILL_ABILITY_MAP[skill],
          level: 'proficient',
          source: `Class: ${effectiveClassName}: Free Choice`,
        },
      });
    }
  };

  const handleExpertiseToggle = (skill: Skill) => {
    const skills = draftSkills;
    if (expertiseSelections.includes(skill)) {
      const updatedSkills = skills.map(s => {
        if (s.skill === skill && s.source === `Class: ${effectiveClassName}`) {
          return { ...s, level: 'proficient' as const };
        }
        return s;
      });
      dispatch({ type: 'UPDATE_DRAFT', updates: { skills: updatedSkills } });
    } else {
      if (expertiseSelections.length >= expertiseChoicesCount) return;
      const updatedSkills = skills.map(s => {
        if (s.skill === skill && s.source === `Class: ${effectiveClassName}`) {
          return { ...s, level: 'expertise' as const };
        }
        return s;
      });
      dispatch({ type: 'UPDATE_DRAFT', updates: { skills: updatedSkills } });
    }
  };

  const allSkills: Skill[] = [
    'athletics', 'acrobatics', 'sleightOfHand', 'stealth',
    'arcana', 'history', 'investigation', 'medicine', 'nature', 'religion',
    'animalHandling', 'insight', 'perception', 'survival',
    'deception', 'intimidation', 'performance', 'persuasion'
  ];

  const availableFreeChoiceSkills = allSkills.filter(skill => 
    !effectiveClassNameSkills.includes(skill)
  );

  const isValid = useMemo(() => {
    if (!classData) return false;
    
    if (userSelectedClassSkills.length < skillChoicesCount) return false;
    
    const freeChoicesFilled = freeChoices.every(choice => choice.skill !== null);
    if (freeChoices.length > 0 && !freeChoicesFilled) return false;
    
    if (hasExpertise) {
      if (expertiseSelections.length < expertiseChoicesCount) return false;
    }
    
    return true;
  }, [
    classData, 
    userSelectedClassSkills.length, 
    skillChoicesCount, 
    freeChoices, 
    hasExpertise, 
    expertiseSelections.length, 
    expertiseChoicesCount
  ]);

  // Set step validation
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

  if (!effectiveClassName && !pendingClass) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-500 py-8">
          Loading class selections...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold">Proficiencies & Skills</h2>
        <select 
          className="border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
          value={effectiveClassName}
          onChange={handleClassChange}
        >
          <option value="" disabled>-- Change Class --</option>
          {srdClasses.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
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

      {pendingClass && (
        <button
          onClick={() => setPendingClass(null)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add {pendingClass}
        </button>
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
                const isLocked = lockedSkills.has(skill);
                const isUserSelected = userSelectedClassSkills.includes(skill);
                
                return (
                  <button
                    key={skill}
                    data-state={isLocked ? 'locked' : isUserSelected ? 'selected' : 'available'}
                    onClick={() => handleSkillToggle(skill)}
                    disabled={isLocked}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isLocked 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isUserSelected 
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{SKILL_DISPLAY_NAMES[skill]}</span>
                      {isLocked && <span className="text-xs opacity-50">Known</span>}
                      {isUserSelected && !isLocked && <span className="text-xs">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="text-sm text-slate-600">
              {effectiveClassNameSkills.length}/{remainingChoices} selected
            </div>
          </div>

          {remainingChoices > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">
                Free Choice{remainingChoices > 1 ? 's' : ''} ({remainingChoices})
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                You already know {remainingChoices} class skill{remainingChoices > 1 ? 's' : ''} from your background. Choose any skill{remainingChoices > 1 ? 's' : ''}.
              </p>
              
              <div className="space-y-3">
                {freeChoices.map((choice, index) => (
                  <div key={choice.id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">Choice {index + 1}:</span>
                    <select
                      value={choice.skill || ''}
                      onChange={(e) => handleFreeChoiceChange(index, e.target.value as Skill || null)}
                      className="flex-1 border-slate-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                    >
                      <option value="">-- Select a Skill --</option>
                      {availableFreeChoiceSkills.map(skill => (
                        <option key={skill} value={skill}>
                          {SKILL_DISPLAY_NAMES[skill]}
                        </option>
                      ))}
                    </select>
                    {choice.skill && (
                      <span className="text-green-600 text-sm">✓ Selected</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasExpertise && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">
                Expertise
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Choose {expertiseChoicesCount} of your class skills to gain Expertise (double proficiency bonus).
              </p>
              
              <div className="expertise-grid grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {[...effectiveClassNameSkills, ...freeChoices.filter(c => c.skill).map(c => c.skill as Skill)].map(skill => {
                  const hasExpertiseOnSkill = expertiseSelections.includes(skill);
                  
                  return (
                    <button
                      key={`exp-${skill}`}
                      onClick={() => handleExpertiseToggle(skill)}
                      disabled={!hasExpertiseOnSkill && expertiseSelections.length >= expertiseChoicesCount}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        hasExpertiseOnSkill
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{SKILL_DISPLAY_NAMES[skill]}</span>
                        {hasExpertiseOnSkill && <span className="text-xs">★</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="text-sm text-slate-600">
                {expertiseSelections.length}/{expertiseChoicesCount} selected for Expertise
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">Selection Summary</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>Class Skills: {userSelectedClassSkills.length}/{remainingChoices}</li>
          {remainingChoices > 0 && (
            <li>Free Choices: {freeChoices.filter(c => c.skill).length}/{remainingChoices}</li>
          )}
          {hasExpertise && (
            <li>Expertise: {expertiseSelections.length}/{expertiseChoicesCount}</li>
          )}
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
