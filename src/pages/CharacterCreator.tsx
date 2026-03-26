import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Step } from '../components/ui/stepper';
import Stepper from '../components/ui/stepper';
import { useCharacterBuilder } from '../contexts/CharacterBuilderContextTypes';
import { getCharacterById } from '../db/characters';
import AbilityScoresStep from './builder/steps/AbilityScoresStep';
import ClassSelectionStep from './builder/steps/ClassSelectionStep';
import EquipmentFeatsStep from './builder/steps/EquipmentFeatsStep';
import RaceBackgroundStep from './builder/steps/RaceBackgroundStep';
import ProficienciesStep from './builder/steps/ProficienciesStep';
import ReviewStep from './builder/steps/ReviewStep';

interface CharacterCreatorProps {
  mode: 'create' | 'levelup';
}

export default function CharacterCreator({ mode }: CharacterCreatorProps) {
  const { state, dispatch } = useCharacterBuilder();
  const { characterId } = useParams();

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
    if (mode === 'create') {
      return [
        { id: 'race', label: 'Race & Background', isValid: state.stepValidations['race'] ?? false },
        { id: 'abilities', label: 'Ability Scores', isValid: true },
        { id: 'class', label: 'Class', isValid: true },
        { id: 'proficiencies', label: 'Proficiencies', isValid: state.stepValidations['proficiencies'] ?? false },
        { id: 'equipment', label: 'Equipment', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];
    } else {
      return [
        { id: 'class', label: 'Class & Level', isValid: true },
        { id: 'proficiencies', label: 'Proficiencies', isValid: state.stepValidations['proficiencies'] ?? false },
        { id: 'equipment', label: 'Equipment', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];
    }
  }, [mode, state.stepValidations]);

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
      
      <div className="mb-8">
        <Stepper 
          steps={steps} 
          currentStep={state.currentStep} 
          onStepClick={handleStepClick} 
        />
      </div>

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-8 h-[600px]">
        {steps[state.currentStep]?.id === 'race' && <RaceBackgroundStep />}
        {steps[state.currentStep]?.id === 'abilities' && <AbilityScoresStep />}
        {steps[state.currentStep]?.id === 'class' && <ClassSelectionStep />}
        {steps[state.currentStep]?.id === 'proficiencies' && <ProficienciesStep />}
        {steps[state.currentStep]?.id === 'equipment' && <EquipmentFeatsStep />}
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
