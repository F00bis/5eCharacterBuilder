import { useReducer, useEffect } from 'react';
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
        return JSON.parse(localData);
      }
    } catch (e) {
      console.error('Failed to parse builder draft from localStorage', e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('builderDraft_v1', JSON.stringify(state));
  }, [state]);

  return (
    <CharacterBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterBuilderContext.Provider>
  );
}
