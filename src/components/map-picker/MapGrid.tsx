import { MapState, Map, mapImages, GameMode } from './types';

interface MapGridProps {
  maps: MapState[];
  gameMode: GameMode;
  isFinished: boolean;
  teamAName: string;
  teamBName: string;
  onMapClick: (mapName: Map) => void;
}

export const MapGrid = ({ maps, gameMode, isFinished, teamAName, teamBName, onMapClick }: MapGridProps) => {
  return (
    <div className="flex-1 flex gap-2 p-2">
      {[...maps].sort((a, b) => {
        if (gameMode === 'bo3' && isFinished) {
          const aOrder = a.pickOrder || 999;
          const bOrder = b.pickOrder || 999;
          return aOrder - bOrder;
        }
        return 0;
      }).map((map) => {
        const isLastMap = isFinished && gameMode === 'bo1' && map.status === 'picked';
        return (
        <button
          key={map.name}
          onClick={() => onMapClick(map.name)}
          disabled={map.status !== 'available' || isFinished}
          style={{
            backgroundImage: `url(${mapImages[map.name]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className={`
            flex-1 relative overflow-hidden rounded-lg border-4 transition-all
            ${map.status === 'available' 
              ? 'border-border hover:border-primary cursor-pointer hover:scale-[1.02]' 
              : 'border-border cursor-not-allowed'
            }
            ${isLastMap ? 'border-[#00ff00]' : ''}
            ${!isLastMap && map.status === 'picked' && map.pickedBy === 'A' ? 'border-teamA' : ''}
            ${!isLastMap && map.status === 'picked' && map.pickedBy === 'B' ? 'border-teamB' : ''}
            ${map.status === 'banned' ? 'border-destructive' : ''}
          `}
        >
          <div className={`absolute inset-0 ${
            isLastMap ? 'bg-black/30' :
            map.status === 'banned' ? 'bg-black/80' :
            map.status === 'picked' && map.pickedBy === 'A' ? 'bg-teamA/30' :
            map.status === 'picked' && map.pickedBy === 'B' ? 'bg-teamB/30' :
            'bg-black/30 hover:bg-black/20'
          }`} />
          
          <div className="h-full flex flex-col items-center justify-center p-4 relative z-10">
            {map.status === 'banned' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="text-red-500 font-bold text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">BANNED</div>
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 transform -translate-y-1/2" />
                </div>
              </div>
            )}
            
            {map.status === 'picked' && gameMode === 'bo3' && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Карта {map.pickOrder}
                </div>
                <div className="text-2xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {map.name}
                </div>
                <div className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {map.pickOrder === 3 ? 'Аутсайдер' : (map.pickedBy === 'A' ? teamAName : teamBName)}
                </div>
              </div>
            )}
            
            {map.status !== 'banned' && (gameMode === 'bo1' || map.status !== 'picked') && (
              <div className="text-2xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {map.name}
              </div>
            )}
          </div>
        </button>
      );
      })}
    </div>
  );
};
