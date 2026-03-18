import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Step } from '../components/ui/stepper';
import Stepper from '../components/ui/stepper';
import { useCharacterBuilder } from '../contexts/CharacterBuilderContextTypes';
import AbilityScoresStep from './builder/steps/AbilityScoresStep';
import RaceBackgroundStep from './builder/steps/RaceBackgroundStep';

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
        // In the future, we would load the character here and dispatch LOAD_BASE_CHARACTER
      }
    }
  }, [mode, characterId, state.mode, state.baseCharacterId, dispatch]);

  const steps = useMemo<Step[]>(() => {
    if (mode === 'create') {
      return [
        { id: 'race', label: 'Race & Background', isValid: true },
        { id: 'abilities', label: 'Ability Scores', isValid: true },
        { id: 'class', label: 'Class', isValid: true },
        { id: 'proficiencies', label: 'Proficiencies', isValid: true },
        { id: 'equipment', label: 'Equipment & Feats', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];
    } else {
      return [
        { id: 'class', label: 'Class & Level', isValid: true },
        { id: 'proficiencies', label: 'Proficiencies', isValid: true },
        { id: 'feats', label: 'ASI & Feats', isValid: true },
        { id: 'review', label: 'Review', isValid: true },
      ];
    }
  }, [mode]);

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

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-8 min-h-100">
        {/* Render specific step content here based on state.currentStep */}
        {steps[state.currentStep]?.id === 'race' && <RaceBackgroundStep />}
        {steps[state.currentStep]?.id === 'abilities' && <AbilityScoresStep />}
        {steps[state.currentStep]?.id !== 'race' && steps[state.currentStep]?.id !== 'abilities' && (
          <div className="text-center text-slate-500">
            <p>Step Content for: {steps[state.currentStep]?.label}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
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
