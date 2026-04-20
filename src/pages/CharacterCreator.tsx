import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Step } from '../components/ui/stepper';
import Stepper from '../components/ui/stepper';
import { useCharacterBuilder } from '../contexts/CharacterBuilderContextTypes';
import { getCharacterById } from '../db/characters';
import { calculateFeatEntitlements, hasEntitlements } from '../utils/featEntitlements';
import { hasProgressionEntitlements } from '../utils/progressionEntitlements';
import { calculateProficiencyEntitlement } from '../utils/proficiencyEntitlements';
import { calculateSpellEntitlements } from '../utils/spellCalculations';
import { useAsiLevelsByClass } from '../utils/useAsiLevelsByClass';
import AbilityScoresStep from './builder/steps/AbilityScoresStep';
import BackgroundStep from './builder/steps/BackgroundStep';
import ClassSelectionStep from './builder/steps/ClassSelectionStep';
import EquipmentStep from './builder/steps/EquipmentStep';
import FeatsAsiStep from './builder/steps/FeatsAsiStep';
import ProficienciesStep from './builder/steps/ProficienciesStep';
import ProgressionChoicesStep from './builder/steps/ProgressionChoicesStep';
import RaceStep from './builder/steps/RaceStep';
import ReviewStep from './builder/steps/ReviewStep';
import SpellSelectionStep from './builder/steps/SpellSelectionStep';

interface CharacterCreatorProps {
  mode: 'create' | 'levelup';
}

export default function CharacterCreator({ mode }: CharacterCreatorProps) {
  const { state, dispatch } = useCharacterBuilder();
  const { characterId } = useParams();
  const asiLevelsByClass = useAsiLevelsByClass();

  const showSpellSelection = useMemo(() => {
    const classes = state.draft.classes || [];
    const subclass = state.draft.subclass;
    
    if (classes.length === 0) return false;
    
    const entitlements = calculateSpellEntitlements(classes, subclass);
    return entitlements !== null;
  }, [state.draft.classes, state.draft.subclass]);

  const showFeatsAsi = useMemo(() => {
    const entitlements = calculateFeatEntitlements(state.draft, mode, asiLevelsByClass);
    return hasEntitlements(entitlements);
  }, [state.draft, mode, asiLevelsByClass]);

  const showProgressionChoices = useMemo(() => {
    const classes = state.draft.classes || [];
    return hasProgressionEntitlements(classes);
  }, [state.draft.classes]);

  const proficiencyEntitlement = useMemo(() => {
    return calculateProficiencyEntitlement({
      mode,
      draftClasses: state.draft.classes || [],
      baseClassesSnapshot: state.baseClassesSnapshot,
      currentPassClassName: state.currentPassClassName,
    });
  }, [mode, state.draft.classes, state.baseClassesSnapshot, state.currentPassClassName]);

  useEffect(() => {
    if (mode === 'create') {
      if (state.mode !== 'create') {
        dispatch({ type: 'CLEAR_DRAFT' });
        dispatch({ type: 'SET_MODE', mode: 'create' });
      }
    } else if (mode === 'levelup') {
      const id = characterId ? parseInt(characterId, 10) : null;
      if (state.mode !== 'levelup' || state.baseCharacterId !== id) {
        dispatch({ type: 'CLEAR_DRAFT' });
        dispatch({ type: 'SET_MODE', mode: 'levelup', baseCharacterId: id });
        if (id) {
          getCharacterById(id).then(character => {
            if (character) {
              dispatch({ type: 'LOAD_BASE_CHARACTER', character });
            }
          });
        }
      }
    }
  }, [mode, characterId, state.mode, state.baseCharacterId, dispatch]);

  const steps = useMemo<Step[]>(() => {
    const insertAfterFirstFound = (
      stepsToUpdate: Step[],
      candidateIds: string[],
      newStep: Step
    ) => {
      for (const stepId of candidateIds) {
        const index = stepsToUpdate.findIndex(s => s.id === stepId);
        if (index >= 0) {
          stepsToUpdate.splice(index + 1, 0, newStep);
          return;
        }
      }

      stepsToUpdate.push(newStep);
    };

    if (mode === 'create') {
      const baseSteps: Step[] = [
        { id: 'race', label: 'Race', isValid: state.stepValidations['race'] ?? false },
        { id: 'background', label: 'Background', isValid: state.stepValidations['background'] ?? false },
        { id: 'abilities', label: 'Ability Scores', isValid: true },
        { id: 'class', label: 'Class', isValid: true },
        { id: 'equipment', label: 'Equipment', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];

      const stepsToReturn = [...baseSteps];
      if (showSpellSelection) {
        const classIdx = stepsToReturn.findIndex(s => s.id === 'class');
        stepsToReturn.splice(classIdx + 1, 0, { id: 'spells', label: 'Spells', isValid: true });
      }
      if (proficiencyEntitlement.showProficienciesStep) {
        insertAfterFirstFound(stepsToReturn, ['spells', 'class'], {
          id: 'proficiencies',
          label: 'Proficiencies',
          isValid: state.stepValidations['proficiencies'] ?? false,
        });
      }
      if (showFeatsAsi) {
        insertAfterFirstFound(stepsToReturn, ['proficiencies', 'spells', 'class'], {
          id: 'feats-asi',
          label: 'Feats & ASI',
          isValid: state.stepValidations['feats-asi'] ?? false,
        });
      }
      if (showProgressionChoices) {
        insertAfterFirstFound(stepsToReturn, ['feats-asi', 'proficiencies', 'spells', 'class'], {
          id: 'progression-choices',
          label: 'Progression Choices',
          isValid: state.stepValidations['progression-choices'] ?? false,
        });
      }

      return stepsToReturn;
    } else {
      const baseSteps: Step[] = [
        { id: 'class', label: 'Class & Level', isValid: true },
        { id: 'equipment', label: 'Equipment', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];

      const stepsToReturn = [...baseSteps];
      if (showSpellSelection) {
        const classIdx = stepsToReturn.findIndex(s => s.id === 'class');
        stepsToReturn.splice(classIdx + 1, 0, { id: 'spells', label: 'Spells', isValid: true });
      }
      if (proficiencyEntitlement.showProficienciesStep) {
        insertAfterFirstFound(stepsToReturn, ['spells', 'class'], {
          id: 'proficiencies',
          label: 'Proficiencies',
          isValid: state.stepValidations['proficiencies'] ?? false,
        });
      }
      if (showFeatsAsi) {
        insertAfterFirstFound(stepsToReturn, ['proficiencies', 'spells', 'class'], {
          id: 'feats-asi',
          label: 'Feats & ASI',
          isValid: state.stepValidations['feats-asi'] ?? false,
        });
      }
      if (showProgressionChoices) {
        insertAfterFirstFound(stepsToReturn, ['feats-asi', 'proficiencies', 'spells', 'class'], {
          id: 'progression-choices',
          label: 'Progression Choices',
          isValid: state.stepValidations['progression-choices'] ?? false,
        });
      }

      return stepsToReturn;
    }
  }, [
    mode,
    state.stepValidations,
    showSpellSelection,
    showFeatsAsi,
    showProgressionChoices,
    proficiencyEntitlement.showProficienciesStep,
  ]);

  const handleNext = () => {
    if (state.currentStep < steps.length - 1) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    dispatch({ type: 'SET_STEP', step: stepIndex });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'create' ? 'Create a Character' : 'Level Up Character'}
      </h1>
      
      <div className="mb-6">
        <Stepper 
          steps={steps} 
          currentStep={state.currentStep} 
          onStepClick={handleStepClick} 
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 h-140 overflow-hidden">
        {steps[state.currentStep]?.id === 'race' && <RaceStep />}
        {steps[state.currentStep]?.id === 'background' && <BackgroundStep />}
        {steps[state.currentStep]?.id === 'abilities' && <AbilityScoresStep />}
        {steps[state.currentStep]?.id === 'class' && <ClassSelectionStep />}
        {steps[state.currentStep]?.id === 'spells' && <SpellSelectionStep isVisible={showSpellSelection} />}
        {steps[state.currentStep]?.id === 'proficiencies' && <ProficienciesStep />}
        {steps[state.currentStep]?.id === 'feats-asi' && showFeatsAsi && <FeatsAsiStep />}
        {steps[state.currentStep]?.id === 'progression-choices' && showProgressionChoices && (
          <ProgressionChoicesStep />
        )}
        {steps[state.currentStep]?.id === 'equipment' && <EquipmentStep />}
        {steps[state.currentStep]?.id === 'review' && <ReviewStep />}
      </div>

      <div className="sticky bottom-0 pt-4 bg-slate-50 flex justify-between">
        <button
          onClick={handleBack}
          disabled={state.currentStep === 0}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!steps[state.currentStep]?.isValid || state.currentStep === steps.length - 1}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
