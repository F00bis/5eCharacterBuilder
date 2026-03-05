import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { AbilityScoresPanel } from '../components/AbilityScoresPanel';
import { CharacterHeader } from '../components/CharacterHeader';
import { SkillsPanel } from '../components/SkillsPanel';
import { getCharacterById, updateCharacter } from '../db/characters';

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

  const handleUpdate = async (updates: Partial<typeof result>) => {
    if (result.id) {
      await updateCharacter(result.id, updates);
    }
  };

  return (
    <div className='p-2 h-full'>
      <div className="flex flex-col gap-2 h-full">
        <CharacterHeader character={result} onUpdate={handleUpdate} />
        <div className="flex flex-row gap-2 h-full">
          <AbilityScoresPanel character={result} />
          <SkillsPanel character={result} />
        </div>
      </div>
    </div>
  );
}
