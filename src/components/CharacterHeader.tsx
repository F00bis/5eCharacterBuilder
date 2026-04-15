import { ArrowLeft, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { DEFAULT_PORTRAIT, fileToBase64 } from '../utils/imageUtils';
import { getXpForNextLevel, getXpProgress } from '../utils/xpThresholds';

interface CharacterHeaderProps {
  character?: import('../types').Character;
  onUpdate?: (updates: Partial<import('../types').Character>) => void;
  update?: (updates: Partial<import('../types').Character>) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const id = `info-${label.toLowerCase()}`;
  return (
    <div className="flex flex-col gap-0">
      <Label htmlFor={id}>{label}</Label>
      <span id={id} className="text-sm text-slate-700 font-medium">{value}</span>
    </div>
  );
}

export function CharacterHeader(_props: CharacterHeaderProps) {
  const context = useCharacter();
  const character = _props.character ?? context.character!;
  const update = _props.onUpdate ?? context.update;
  const navigate = useNavigate();
  
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
      update({ name: trimmed });
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
      update({ xp: xpValue });
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
        update({ portrait: base64 });
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (portraitUrl.trim()) {
      update({ portrait: portraitUrl.trim() });
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
      <Card className="w-full h-full p-2">
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 w-10 h-10 my-auto text-slate-500 hover:text-slate-900" 
            onClick={() => navigate('/')}
            title="Back to Characters"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div 
            className="shrink-0 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            title="Click to change portrait"
          >
            <img 
              src={portraitSrc} 
              alt="Character portrait" 
              className="w-20 h-20 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_PORTRAIT;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 h-full">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="name">Name</Label>
                {isEditingName ? (
                  <Input
                    ref={nameInputRef}
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleNameKeyDown}
                    className="font-bold"
                  />
                ) : (
                  <h2 
                    className="text-base font-bold text-slate-900 cursor-pointer hover:text-purple-700 truncate"
                    onClick={() => setIsEditingName(true)}
                    title="Click to edit name"
                  >
                    {character.name}
                  </h2>
                )}
              </div>

              <InfoRow label="Race" value={character.race} />
              <InfoRow label="Background" value={character.background} />

<div className="flex flex-col gap-0.5">
                <Label>Class</Label>
                <div className="text-sm text-slate-700 font-medium flex items-center gap-0.5">
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
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/characters/${character.id}/level-up`)}
                  className="gap-1"
                >
                  <ArrowUp className="w-3 h-3" />
                  Level Up
                </Button>
              </div>

              <InfoRow label="Alignment" value={character.alignment} />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <Label htmlFor="xp">XP</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span 
                        className="text-xs text-slate-500 cursor-pointer hover:text-purple-700"
                        onClick={() => setIsEditingXp(true)}
                      >
                        {xpToNextLevel.toLocaleString()} to next
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{xpToNextLevel.toLocaleString()} XP to next level</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {isEditingXp ? (
                  <Input
                    ref={xpInputRef}
                    type="number"
                    value={editedXp}
                    onChange={(e) => setEditedXp(e.target.value)}
                    onBlur={handleXpSave}
                    onKeyDown={handleXpKeyDown}
                    className="h-7"
                    min="0"
                  />
                ) : (
                  <div 
                    className="text-sm text-slate-700 cursor-pointer hover:text-purple-700"
                    onClick={() => setIsEditingXp(true)}
                  >
                    {character.xp?.toLocaleString() ?? 0} / {getXpForNextLevel(character.level).toLocaleString()}
                  </div>
                )}
                <Progress value={xpProgress.percentage} className="h-1" />
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
