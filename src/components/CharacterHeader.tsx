import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import type { Character } from '../types';
import { DEFAULT_PORTRAIT, fileToBase64 } from '../utils/imageUtils';
import { getXpForNextLevel, getXpProgress } from '../utils/xpThresholds';

interface CharacterHeaderProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700 font-medium">{value}</span>
    </div>
  );
}

export function CharacterHeader({ character, onUpdate }: CharacterHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingXp, setIsEditingXp] = useState(false);
  const [editedName, setEditedName] = useState(character.name);
  const [editedXp, setEditedXp] = useState(String(character.xp ?? 0));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const xpInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const xpProgress = getXpProgress(character.xp, character.level);

  const xpToNextLevel = getXpForNextLevel(character.level) - character.xp;

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingXp && xpInputRef.current) {
      xpInputRef.current.focus();
      xpInputRef.current.select();
    }
  }, [isEditingXp]);

  const handleNameSave = () => {
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== character.name) {
      onUpdate({ name: trimmed });
    } else {
      setEditedName(character.name);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditedName(character.name);
      setIsEditingName(false);
    }
  };

  const handleXpSave = () => {
    const xpValue = parseInt(editedXp, 10);
    if (!isNaN(xpValue) && xpValue >= 0 && xpValue !== character.xp) {
      onUpdate({ xp: xpValue });
    } else {
      setEditedXp(character.xp.toString());
    }
    setIsEditingXp(false);
  };

  const handleXpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleXpSave();
    } else if (e.key === 'Escape') {
      setEditedXp(character.xp.toString());
      setIsEditingXp(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onUpdate({ portrait: base64 });
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (portraitUrl.trim()) {
      onUpdate({ portrait: portraitUrl.trim() });
      setPortraitUrl('');
      setIsModalOpen(false);
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const formatClasses = () => {
    return character.classes
      .map(c => `${c.className} ${c.level}`)
      .join(' / ');
  };

  const getPrimaryClass = () => {
    if (character.classes.length === 0) return '';
    const sorted = [...character.classes].sort((a, b) => b.level - a.level);
    return sorted[0].className;
  };

  const getMulticlassCount = () => {
    return Math.max(0, character.classes.length - 1);
  };

  const portraitSrc = character.portrait || DEFAULT_PORTRAIT;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-480 p-3">
        <div className="flex gap-3">
          <div 
            className="shrink-0 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            title="Click to change portrait"
          >
            <img 
              src={portraitSrc} 
              alt="Character portrait" 
              className="w-12 h-12 rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_PORTRAIT;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <Input
                ref={nameInputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className="text-lg font-bold border-0 border-b-2 border-purple-700 px-0 focus-visible:ring-0 h-7"
              />
            ) : (
              <h2 
                className="text-lg font-bold text-slate-900 cursor-pointer hover:text-purple-700 truncate"
                onClick={() => setIsEditingName(true)}
                title="Click to edit name"
              >
                {character.name}
              </h2>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              <div className="text-xs text-slate-600 font-medium truncate flex items-center gap-1">
                <span>Level {character.level} {getPrimaryClass()}</span>
                {getMulticlassCount() > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-purple-700 font-bold cursor-help hover:text-purple-800">
                        +{getMulticlassCount()}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{formatClasses()}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <InfoRow label="Race" value={character.race} />
              <InfoRow label="Background" value={character.background} />
              <InfoRow label="Alignment" value={character.alignment} />
              
              <div className="col-span-2 flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="text-xs text-slate-700 cursor-pointer hover:text-purple-700"
                      onClick={() => setIsEditingXp(true)}
                    >
                      XP: {(character.xp ?? 0).toLocaleString()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{xpToNextLevel.toLocaleString()} to next level</p>
                  </TooltipContent>
                </Tooltip>
                {isEditingXp && (
                  <Input
                    ref={xpInputRef}
                    type="number"
                    value={editedXp}
                    onChange={(e) => setEditedXp(e.target.value)}
                    onBlur={handleXpSave}
                    onKeyDown={handleXpKeyDown}
                    className="h-5 text-xs w-20"
                    min="0"
                  />
                )}
              </div>
              
              <div className="col-span-2">
                <Progress value={xpProgress.percentage} className="h-1.5" />
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {xpProgress.current.toLocaleString()} / {xpProgress.needed.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-325">
          <DialogHeader>
            <DialogTitle>Change Portrait</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={portraitUrl}
                onChange={(e) => setPortraitUrl(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                placeholder="Paste image URL"
              />
              <Button
                onClick={handleUrlSubmit}
                variant="secondary"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
