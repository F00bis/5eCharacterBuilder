import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { AbilityScoresPanel } from '../components/AbilityScoresPanel';
import { CharacterHeader } from '../components/CharacterHeader';
import { CombatStatsPanel } from '../components/CombatStatsPanel';
import { PassivesPanel } from '../components/PassivesPanel';
import { SavingThrowsPanel } from '../components/SavingThrowsPanel';
import { SkillsPanel } from '../components/SkillsPanel';
import { StatusEffectsPanel } from '../components/StatusEffectsPanel';
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
    <div className='p-1 h-full'>
      <div className="flex flex-col gap-2 h-full">
        <CharacterHeader character={result} onUpdate={handleUpdate} />
        <div className="flex flex-row gap-1 h-4/5 w-full">
          <div className="w-1/12 h-full">
            <AbilityScoresPanel character={result} />
          </div>
          <div className="flex-3 h-full flex flex-col gap-1">
            <div className="h-[25%]">
              <SavingThrowsPanel character={result} />
            </div>
            <div className="h-[62%]">
              <SkillsPanel character={result} />
            </div>
            <div className="h-[13%]">
              <PassivesPanel character={result} />
            </div>
          </div>
          <div className='w-5/12 flex flex-col gap-1'>
            <div className="w-full h-fit flex flex-row gap-1">
              <div className="w-1/2 h-full">
                <CombatStatsPanel character={result} onUpdate={handleUpdate} />
              </div>
              <div className="w-1/2 h-fit">
                <StatusEffectsPanel character={result} onUpdate={handleUpdate} />
              </div>
            </div>
          </div>
          <div className="w-[29.17%] h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">Inventory (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
