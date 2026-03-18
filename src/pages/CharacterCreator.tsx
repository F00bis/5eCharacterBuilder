import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCharacterBuilder } from '../contexts/CharacterBuilderContextTypes';

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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'create' ? 'Create a Character' : 'Level Up Character'}
      </h1>
      
      {/* Stepper will be added here in Phase 3 */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
        <p>Character builder steps will appear here.</p>
        <p className="text-sm mt-2">Current Step: {state.currentStep}</p>
      </div>
    </div>
  );
}
