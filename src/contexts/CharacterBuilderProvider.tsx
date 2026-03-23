import { useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  CharacterBuilderContext,
  characterBuilderReducer,
  defaultState
} from './CharacterBuilderContextTypes';

export function CharacterBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterBuilderReducer, defaultState, (initial) => {
    try {
      const localData = localStorage.getItem('builderDraft_v1');
      if (localData) {
        const parsed = JSON.parse(localData);
        return { ...initial, ...parsed, stepValidations: parsed.stepValidations || {}, useTashasRules: parsed.useTashasRules ?? true };
      }
    } catch (e) {
      console.error('Failed to parse builder draft from localStorage', e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('builderDraft_v1', JSON.stringify(state));
  }, [state]);

  const isComplete = useMemo(() => 
    Object.values(state.stepValidations).every(v => v), 
    [state.stepValidations]
  );

  return (
    <CharacterBuilderContext.Provider value={{ state, dispatch, isComplete }}>
      {children}
    </CharacterBuilderContext.Provider>
  );
}
