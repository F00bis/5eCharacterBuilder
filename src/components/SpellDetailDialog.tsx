import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CharacterSpell } from '../types';
import { SpellTooltipDetail } from './SpellTooltipDetail';

interface SpellDetailDialogProps {
  spell: CharacterSpell | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpellDetailDialog({ spell, open, onOpenChange }: SpellDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        {spell && (
          <>
            <DialogHeader>
              <DialogTitle>{spell.name}</DialogTitle>
            </DialogHeader>
            <SpellTooltipDetail spell={spell} showName={false} className="w-full" />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
