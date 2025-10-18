import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type GameMode = 'bo1' | 'bo3';
type Phase = 'setup' | 'picking';
type Map = 'nuke' | 'inferno' | 'ancient' | 'overpass' | 'train' | 'dust' | 'mirage';
type Side = 'T' | 'CT';

interface MapState {
  name: Map;
  status: 'available' | 'banned' | 'picked';
  pickedBy?: 'A' | 'B';
  side?: { team: 'A' | 'B'; side: Side };
}

const mapImages: Record<Map, string> = {
  nuke: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/0a0d48ff-4281-495e-ba49-801f0deb791c.jpg',
  inferno: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/d06fd099-3cfb-4115-bfcc-80a0463f7b2e.jpg',
  ancient: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/01be0018-c4b7-4f31-a450-9ce333b09a78.jpg',
  overpass: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/6d89b204-a494-43b5-b5ba-97f49d6ea70e.jpg',
  train: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/80dc5c89-a8ad-489d-b666-5ebe9df3e2c6.jpg',
  dust: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/9c8de4fb-f947-4000-af36-e14459216a31.jpg',
  mirage: 'https://cdn.poehali.dev/projects/c1f1be23-1b98-486b-93de-c5794789927b/files/17b724b2-8692-4418-a712-9ff5a640bf1f.jpg',
};

const Index = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('bo1');
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
  const [stepIndex, setStepIndex] = useState(0);
  const [showSideDialog, setShowSideDialog] = useState(false);
  const [pendingMapForSide, setPendingMapForSide] = useState<Map | null>(null);
  
  const [maps, setMaps] = useState<MapState[]>([
    { name: 'nuke', status: 'available' },
    { name: 'inferno', status: 'available' },
    { name: 'ancient', status: 'available' },
    { name: 'overpass', status: 'available' },
    { name: 'train', status: 'available' },
    { name: 'dust', status: 'available' },
    { name: 'mirage', status: 'available' },
  ]);

  const bo1Steps = [
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
  ];

  const bo3Steps = [
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'pick', count: 1 },
    { team: 'B', action: 'pick', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'ban', count: 1 },
  ];

  const steps = gameMode === 'bo1' ? bo1Steps : bo3Steps;
  const currentStep = steps[stepIndex];

  const handleStart = () => {
    if (!teamAName.trim() || !teamBName.trim()) return;
    const randomStart = Math.random() > 0.5 ? 'A' : 'B';
    setCurrentTeam(randomStart);
    setPhase('picking');
  };

  const handleMapClick = (mapName: Map) => {
    if (!currentStep) return;
    
    const map = maps.find(m => m.name === mapName);
    if (!map || map.status !== 'available') return;

    if (currentStep.action === 'ban') {
      setMaps(prev => prev.map(m => 
        m.name === mapName ? { ...m, status: 'banned' } : m
      ));
      moveToNextStep();
    } else if (currentStep.action === 'pick') {
      setMaps(prev => prev.map(m => 
        m.name === mapName ? { ...m, status: 'picked', pickedBy: currentTeam } : m
      ));
      moveToNextStep();
    }
  };



  const moveToNextStep = () => {
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentTeam(steps[nextIndex].team as 'A' | 'B');
    } else {
      if (gameMode === 'bo1') {
        setMaps(prev => prev.map(m => 
          m.status === 'available' ? { ...m, status: 'picked', pickedBy: 'A' } : m
        ));
      }
    }
  };

  const getCurrentInstruction = () => {
    if (!currentStep) return 'Выбор завершен';
    const teamName = currentStep.team === 'A' ? teamAName : teamBName;
    if (currentStep.action === 'ban') return `${teamName} вычеркивает ${currentStep.count} карт${currentStep.count > 1 ? 'ы' : 'у'}`;
    if (currentStep.action === 'pick') return `${teamName} выбирает карту`;
    return '';
  };

  const pickedMaps = maps.filter(m => m.status === 'picked');
  const isFinished = stepIndex >= steps.length;

  if (phase === 'setup') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-lg border border-border animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">CS2 Map Veto</h1>
            <p className="text-muted-foreground">Профессиональная система банов карт</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamA">Команда A</Label>
              <Input
                id="teamA"
                placeholder="Введите название команды A"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamB">Команда B</Label>
              <Input
                id="teamB"
                placeholder="Введите название команды B"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Формат матча</Label>
              <RadioGroup value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bo1" id="bo1" />
                  <Label htmlFor="bo1" className="cursor-pointer">Best of 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bo3" id="bo3" />
                  <Label htmlFor="bo3" className="cursor-pointer">Best of 3</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full" 
              onClick={handleStart}
              disabled={!teamAName.trim() || !teamBName.trim()}
            >
              Начать банить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className={`text-2xl font-bold ${currentTeam === 'A' && !isFinished ? 'text-teamA animate-pulse-glow' : 'text-foreground'}`}>
          {teamAName}
        </div>
        
        <div className="text-center flex-1 px-4">
          <div className="text-sm text-muted-foreground mb-1">
            {gameMode === 'bo1' ? 'Best of 1' : 'Best of 3'}
          </div>
          <div className="text-foreground font-medium">
            {isFinished ? 'Выбор завершен' : getCurrentInstruction()}
          </div>
        </div>
        
        <div className={`text-2xl font-bold ${currentTeam === 'B' && !isFinished ? 'text-teamB animate-pulse-glow' : 'text-foreground'}`}>
          {teamBName}
        </div>
      </div>

      <div className="flex-1 flex gap-2 p-2">
        {maps.map((map) => {
          const isLastMap = isFinished && map.status === 'picked' && gameMode === 'bo1';
          return (
          <button
            key={map.name}
            onClick={() => handleMapClick(map.name)}
            disabled={map.status !== 'available' || isFinished}
            style={{
              backgroundImage: `url(${mapImages[map.name]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className={`
              flex-1 relative overflow-hidden rounded-lg border-2 transition-all
              ${map.status === 'available' 
                ? 'border-border hover:border-primary cursor-pointer hover:scale-[1.02]' 
                : 'border-border cursor-not-allowed'
              }
              ${map.status === 'picked' && map.pickedBy === 'A' ? 'border-teamA' : ''}
              ${map.status === 'picked' && map.pickedBy === 'B' ? 'border-teamB' : ''}
              ${map.status === 'banned' ? 'border-destructive' : ''}
              ${isLastMap ? 'border-green-500 scale-105 border-4' : ''}
            `}
          >
            <div className={`absolute inset-0 ${
              map.status === 'banned' ? 'bg-black/80' :
              map.status === 'picked' && map.pickedBy === 'A' ? 'bg-teamA/30' :
              map.status === 'picked' && map.pickedBy === 'B' ? 'bg-teamB/30' :
              isLastMap ? 'bg-green-500/40' :
              'bg-black/30 hover:bg-black/20'
            }`} />
            
            <div className="h-full flex flex-col items-center justify-center p-4 relative z-10">
              <div className="text-2xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {map.name}
              </div>
              
              {map.status === 'banned' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-destructive rotate-12" />
                  <div className="absolute text-destructive font-bold text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">BANNED</div>
                </div>
              )}
              
              {map.status === 'picked' && (
                <div className="text-sm font-bold mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {map.pickedBy === 'A' ? teamAName : teamBName}
                </div>
              )}
              
              {isLastMap && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-green-400 font-bold text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">ВЫБРАНА</div>
                </div>
              )}
            </div>
          </button>
        );
        })}
      </div>

      {isFinished && (
        <div className="px-8 py-4 border-t border-border bg-card animate-fade-in">
          <h2 className="text-xl font-bold mb-3">Итоговые карты:</h2>
          <div className="space-y-2">
            {gameMode === 'bo1' ? (
              <div className="flex items-center justify-between text-foreground">
                <span className="font-medium">
                  Финальная карта: <span className="uppercase text-green-500">{maps.find(m => m.status === 'available')?.name}</span>
                </span>
              </div>
            ) : (
              pickedMaps.map((map, idx) => (
                <div key={map.name} className="flex items-center justify-between text-foreground">
                  <span className="font-medium">
                    Карта {idx + 1}: <span className="uppercase">{map.name}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default Index;