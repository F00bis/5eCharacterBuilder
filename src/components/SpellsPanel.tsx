import { Card } from '@/components/ui/card';
import { useCharacter } from '../contexts/CharacterContext';

export function SpellsPanel() {
  const { character } = useCharacter();

  if (!character) return null;

  return (
    <Card className="w-full h-full p-2 flex flex-col">
      <div className="text-xs font-bold text-slate-700 mb-2 px-1">
        Spellbook
      </div>
      <div className="flex-1 overflow-y-auto">
        {character.spells.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-4">
            No spells known
          </div>
        ) : (
          <div className="space-y-1">
            {character.spells.map((spell) => (
              <div
                key={spell.name}
                className="px-2 py-1 bg-slate-50 rounded text-xs"
              >
                <span className="font-medium text-slate-700">{spell.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
