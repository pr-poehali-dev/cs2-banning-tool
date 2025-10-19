import { MapState } from './types';

interface FinalScreenBo1Props {
  maps: MapState[];
}

export const FinalScreenBo1 = ({ maps }: FinalScreenBo1Props) => {
  const finalMap = maps.find(m => m.status === 'picked')?.name || maps.find(m => m.status === 'available')?.name;
  
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="text-9xl font-bold uppercase text-[#00ff00] animate-fade-in">
        {finalMap}
      </div>
    </div>
  );
};
