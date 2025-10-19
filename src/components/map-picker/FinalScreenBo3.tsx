import { MapState, mapImages } from './types';

interface FinalScreenBo3Props {
  pickedMaps: MapState[];
  teamAName: string;
  teamBName: string;
}

export const FinalScreenBo3 = ({ pickedMaps, teamAName, teamBName }: FinalScreenBo3Props) => {
  const sortedMaps = [...pickedMaps].sort((a, b) => {
    const aOrder = a.pickOrder || 999;
    const bOrder = b.pickOrder || 999;
    return aOrder - bOrder;
  });
  
  return (
    <div className="h-screen w-screen flex items-center justify-center gap-4 p-4 bg-background animate-slide-in">
      {sortedMaps.map((map, index) => {
        const teamASide = map.side?.team === 'A' ? map.side.side : (map.side?.team === 'B' ? (map.side.side === 'T' ? 'CT' : 'T') : 'N/A');
        const teamBSide = map.side?.team === 'B' ? map.side.side : (map.side?.team === 'A' ? (map.side.side === 'T' ? 'CT' : 'T') : 'N/A');
        const isThirdMap = map.pickOrder === 3;
        
        return (
          <div
            key={map.name}
            style={{
              backgroundImage: `url(${mapImages[map.name]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="flex-1 h-full relative overflow-hidden rounded-lg border-4 border-primary"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            
            <div className={`h-full flex flex-col items-center p-8 relative z-10 ${isThirdMap ? 'justify-center' : 'justify-between'}`}>
              {!isThirdMap && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {teamAName}
                  </div>
                  <div className="text-5xl font-bold text-orange-500 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mt-2">
                    {teamASide}
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
                  Карта {map.pickOrder}
                </div>
                <div className="text-6xl font-bold uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                  {map.name}
                </div>
              </div>
              
              {!isThirdMap && (
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-500 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {teamBSide}
                  </div>
                  <div className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mt-2">
                    {teamBName}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};