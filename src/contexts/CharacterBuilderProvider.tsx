import { useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  CharacterBuilderContext,
  characterBuilderReducer,
  defaultState
} from './CharacterBuilderContextTypes';

export function CharacterBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterBuilderReducer, defaultState);

  useEffect(() => {
    localStorage.removeItem('builderDraft_v1');
  }, []);

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
