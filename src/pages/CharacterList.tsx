import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { getAllCharacters, deleteCharacter } from '../db/characters';
import type { Character } from '../types';
import { DEFAULT_PORTRAIT } from '../utils/imageUtils';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function CharacterList() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [characterToDelete, setCharacterToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setIsLoading(true);
    try {
      const chars = await getAllCharacters();
      setCharacters(chars);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

const handleCreateNew = () => {
    navigate('/characters/new');
  };

  const confirmDelete = async () => {
    if (characterToDelete !== null) {
      await deleteCharacter(characterToDelete);
      setCharacterToDelete(null);
      await loadCharacters();
    }
  };

  const formatClasses = (character: Character) => {
    if (!character.classes || character.classes.length === 0) return 'No Class';
    return character.classes
      .map(c => `${c.className} ${c.level}`)
      .join(' / ');
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading characters...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your Characters</h1>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map(character => (
          <Card 
            key={character.id}
            className="cursor-pointer hover:border-purple-500 hover:shadow-md transition-all group"
            onClick={() => navigate(`/characters/${character.id}`)}
          >
            <CardContent className="p-4 flex gap-4 relative">
              <div className="shrink-0">
                <img 
                  src={character.portrait || DEFAULT_PORTRAIT} 
                  alt={character.name} 
                  className="w-16 h-16 rounded-md object-cover border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PORTRAIT;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="font-bold text-lg text-slate-900 truncate" title={character.name}>
                  {character.name}
                </h2>
                <p className="text-sm text-slate-500 truncate">
                  {character.race} • {formatClasses(character)}
                </p>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCharacterToDelete(character.id!);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {characters.length === 0 && (
          <Card 
            className="cursor-pointer hover:border-purple-500 hover:shadow-md transition-all border-dashed border-2 flex items-center justify-center min-h-[100px] bg-slate-50 hover:bg-white"
            onClick={handleCreateNew}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Plus className="w-8 h-8 text-purple-600" />
              <p className="font-medium text-slate-900">Create New Character</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={characterToDelete !== null} onOpenChange={(open) => !open && setCharacterToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Character</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this character? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCharacterToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
