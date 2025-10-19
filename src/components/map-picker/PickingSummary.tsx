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
  if (!isFinished) return null;

  return (
    <div className="px-8 py-4 border-t border-border bg-card animate-fade-in">
      {gameMode === 'bo1' ? (
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold uppercase text-green-500">
            {pickedMaps.find(m => m.status === 'picked')?.name || pickedMaps.find(m => m.status === 'available')?.name}
          </span>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Итоговые карты:</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {pickedMaps.map((map, idx) => (
              <div key={map.name} className="relative overflow-hidden rounded-lg border border-border">
                <div 
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${mapImages[map.name]})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">
                      Карта {idx + 1}
                    </div>
                    <div className="text-2xl font-bold uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {map.name}
                    </div>
                    {map.side && (
                      <div className="text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {map.side.team === 'A' ? teamAName : teamBName} - {map.side.side}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{teamAName}:</span>
              <span className="text-muted-foreground">
                {pickedMaps
                  .filter(m => m.side?.team === 'A')
                  .map(m => m.side?.side)
                  .join(', ') || 'Нет данных'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{teamBName}:</span>
              <span className="text-muted-foreground">
                {pickedMaps
                  .filter(m => m.side?.team === 'B')
                  .map(m => m.side?.side)
                  .join(', ') || 'Нет данных'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
