import { createContext, useContext } from 'react';
import type { Character } from '../types';

export interface CharacterContextValue {
  character: Character | null;
  isLoading: boolean;
  isNotFound: boolean;
  update: (updates: Partial<Character>) => Promise<void>;
}

export const CharacterContext = createContext<CharacterContextValue | null>(null);

export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
}

export function useCharacter() {
  const { character, isLoading, isNotFound, update } = useCharacterContext();
  return { character, isLoading, isNotFound, update };
}
