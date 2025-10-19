import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Side } from './types';

interface SideDialogProps {
  open: boolean;
  teamName: string;
  mapName: string;
  onSideChoice: (side: Side) => void;
}

export const SideDialog = ({ open, teamName, mapName, onSideChoice }: SideDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Выбор стороны</h2>
            <p className="text-muted-foreground">
              {teamName}, выберите сторону для карты{' '}
              <span className="uppercase font-bold">{mapName}</span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => onSideChoice('T')}
              className="flex-1 h-24 text-2xl font-bold bg-orange-600 hover:bg-orange-700"
            >
              T (Террористы)
            </Button>
            <Button
              onClick={() => onSideChoice('CT')}
              className="flex-1 h-24 text-2xl font-bold bg-blue-600 hover:bg-blue-700"
            >
              CT (Спецназ)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
