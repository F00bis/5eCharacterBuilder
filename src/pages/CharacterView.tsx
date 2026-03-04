import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { getCharacterById } from '../db/characters';
import { AbilityScoresPanel } from '../components/AbilityScoresPanel';

export function CharacterView() {
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

  // useLiveQuery returns undefined while loading, null if not found
  if (result === undefined) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (result === null) {
    return <div className="p-4 text-red-500">Character not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{result.name}</h1>
      <AbilityScoresPanel character={result} />
    </div>
  );
}
