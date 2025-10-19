import Icon from '@/components/ui/icon';
import { MapState, GameMode, mapImages } from './types';

interface PickingSummaryProps {
  isFinished: boolean;
  gameMode: GameMode;
  pickedMaps: MapState[];
  teamAName: string;
  teamBName: string;
}

export const PickingSummary = ({ isFinished, gameMode, pickedMaps, teamAName, teamBName }: PickingSummaryProps) => {
  if (!isFinished || gameMode === 'bo3') return null;

  return (
    <div className="px-8 py-4 border-t border-border bg-card animate-fade-in">
      <div className="flex items-center justify-center">
        <span className="text-4xl font-bold uppercase text-green-500">
          {pickedMaps.find(m => m.status === 'picked')?.name || pickedMaps.find(m => m.status === 'available')?.name}
        </span>
      </div>
    </div>
  );
};