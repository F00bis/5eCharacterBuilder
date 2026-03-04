import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

  console.log(character.xp);

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

  const portraitSrc = character.portrait || DEFAULT_PORTRAIT;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="fixed top-4 right-4 w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex gap-3">
          <div 
            className="flex-shrink-0 cursor-pointer"
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
            <input
              ref={nameInputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="text-xl font-bold text-gray-900 w-full outline-none border-b-2 border-purple-700"
            />
          ) : (
            <h2 
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-purple-700 truncate"
              onClick={() => setIsEditingName(true)}
              title="Click to edit name"
            >
              {character.name}
            </h2>
          )}
          
          <p className="text-sm text-gray-500">{character.race}</p>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-600 font-medium cursor-help">
                Level {character.level} {getPrimaryClass()}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{formatClasses()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="text-sm text-gray-700 cursor-pointer hover:text-purple-700 inline-block"
              onClick={() => setIsEditingXp(true)}
            >
              {(character.xp ?? 0).toLocaleString()} XP
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>XP to next level: {xpToNextLevel.toLocaleString()}</p>
          </TooltipContent>
        </Tooltip>
        
        {isEditingXp ? (
          <input
            ref={xpInputRef}
            type="number"
            value={editedXp}
            onChange={(e) => setEditedXp(e.target.value)}
            onBlur={handleXpSave}
            onKeyDown={handleXpKeyDown}
            className="text-sm text-gray-700 ml-2 w-24 outline-none border-b-2 border-purple-700"
            min="0"
          />
        ) : null}
        
        <Progress value={xpProgress.percentage} className="mt-1" />
        
        <div className="text-xs text-gray-500 mt-1">
          {xpProgress.current.toLocaleString()} / {xpProgress.needed.toLocaleString()} to next level
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[325px]">
          <DialogHeader>
            <DialogTitle>Change Portrait</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <input
                type="text"
                value={portraitUrl}
                onChange={(e) => setPortraitUrl(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                placeholder="Paste image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  );
}
