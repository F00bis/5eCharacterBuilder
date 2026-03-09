import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Character } from '../types';
import { getCharacterById, updateCharacter } from '../db/characters';
import { CharacterContext } from './CharacterContext';

interface CharacterProviderProps {
  children: ReactNode;
}

export function CharacterProvider({ children }: CharacterProviderProps) {
  const { characterId } = useParams<{ characterId: string }>();
  const id = Number(characterId);

  const result = useLiveQuery(
    async () => {
      if (isNaN(id)) return null;
      const character = await getCharacterById(id);
      return character ?? null;
    },
    [id]
  );

  const isLoading = result === undefined;
  const isNotFound = result === null;
  const character = result ?? null;

  const update = async (updates: Partial<Character>) => {
    if (character?.id) {
      await updateCharacter(character.id, updates);
    }
  };

  return (
    <CharacterContext.Provider value={{ character, isLoading, isNotFound, update }}>
      {children}
    </CharacterContext.Provider>
  );
}
