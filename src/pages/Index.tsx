import { useState, useEffect } from 'react';
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
  pickOrder?: number;
}

const mapImages: Record<Map, string> = {
  nuke: 'https://cdn.poehali.dev/files/c54f9b6c-d9e9-447d-90fb-72ba490168e3.png',
  inferno: 'https://cdn.poehali.dev/files/b56a4409-13e1-4101-85c8-94dd4f614d22.png',
  ancient: 'https://cdn.poehali.dev/files/0ab9aab4-cd14-46e9-9f98-59337fb4e904.png',
  overpass: 'https://cdn.poehali.dev/files/c82e2b2c-f48c-4443-b113-d9830fcf0e21.png',
  train: 'https://cdn.poehali.dev/files/4f68fbe3-de30-439e-a4ae-ef71a5436ebd.png',
  dust: 'https://cdn.poehali.dev/files/8ac11166-e9a7-42c2-b0d4-00ddcd5f2764.png',
  mirage: 'https://cdn.poehali.dev/files/0f163a71-c0f4-46a7-a0bd-bb87c5dd6c8c.png',
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
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
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
      const pickOrder = maps.filter(m => m.status === 'picked').length + 1;
      setMaps(prev => prev.map(m => 
        m.name === mapName ? { ...m, status: 'picked', pickedBy: currentTeam, pickOrder } : m
      ));
      
      if (gameMode === 'bo3') {
        const oppositeTeam = currentTeam === 'A' ? 'B' : 'A';
        setPendingMapForSide(mapName);
        setCurrentTeam(oppositeTeam);
        setShowSideDialog(true);
      } else {
        moveToNextStep();
      }
    }
  };



  const handleSideChoice = (side: Side) => {
    if (!pendingMapForSide) return;
    
    setMaps(prev => prev.map(m => 
      m.name === pendingMapForSide 
        ? { ...m, side: { team: currentTeam, side } } 
        : m
    ));
    
    setPendingMapForSide(null);
    setShowSideDialog(false);
    
    if (stepIndex < steps.length) {
      moveToNextStep();
    }
  };

  const moveToNextStep = () => {
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentTeam(steps[nextIndex].team as 'A' | 'B');
    } else {
      setStepIndex(steps.length);
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
  const availableCount = maps.filter(m => m.status === 'available').length;
  const pickedCount = maps.filter(m => m.status === 'picked').length;
  const bannedCount = maps.filter(m => m.status === 'banned').length;

  useEffect(() => {
    if (gameMode === 'bo3' && isFinished && availableCount === 1 && pickedCount === 2 && !showSideDialog && !pendingMapForSide) {
      const available = maps.filter(m => m.status === 'available');
      if (available.length === 1) {
        const lastBanTeam = steps[steps.length - 1].team as 'A' | 'B';
        const sideChoosingTeam = lastBanTeam === 'A' ? 'B' : 'A';
        const lastMap = available[0];
        
        setMaps(prev => prev.map(m => 
          m.status === 'available' ? { ...m, status: 'picked', pickedBy: 'A', pickOrder: 3 } : m
        ));
        
        setTimeout(() => {
          setPendingMapForSide(lastMap.name);
          setCurrentTeam(sideChoosingTeam);
          setShowSideDialog(true);
        }, 300);
      }
    }
  }, [gameMode, isFinished, availableCount, pickedCount, showSideDialog, pendingMapForSide, maps, steps]);



  if (phase === 'setup') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl space-y-8 p-12 bg-card rounded-lg border border-border animate-fade-in">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Турнир Республики Адыгея</h1>
            <p className="text-2xl text-foreground">по Counter Strike 2</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="teamA" className="text-lg">Команда A</Label>
              <Input
                id="teamA"
                placeholder="Введите название команды A"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="bg-background text-lg h-12"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="teamB" className="text-lg">Команда B</Label>
              <Input
                id="teamB"
                placeholder="Введите название команды B"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="bg-background text-lg h-12"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg">Формат матча</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGameMode('bo1')}
                  className={`px-6 py-4 rounded-lg font-medium text-lg transition-colors ${
                    gameMode === 'bo1' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  Best of 1
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('bo3')}
                  className={`px-6 py-4 rounded-lg font-medium text-lg transition-colors ${
                    gameMode === 'bo3' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  Best of 3
                </button>
              </div>
            </div>

            <Button 
              className="w-full text-lg h-12" 
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

  if (isFinished && gameMode === 'bo1') {
    const finalMap = maps.find(m => m.status === 'picked')?.name || maps.find(m => m.status === 'available')?.name;
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-9xl font-bold uppercase text-[#00ff00] animate-fade-in">
          {finalMap}
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
          const isLastMap = isFinished && gameMode === 'bo1' && map.status === 'picked';
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
                  <div className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {map.pickOrder === 3 ? 'Аутсайдер' : (map.pickedBy === 'A' ? teamAName : teamBName)}
                  </div>
                  <div className="text-2xl font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {map.name}
                  </div>
                  <div className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Карта {map.pickOrder}
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

      {isFinished && (
        <div className="px-8 py-4 border-t border-border bg-card animate-fade-in">
          {gameMode === 'bo1' ? (
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold uppercase text-green-500">
                {maps.find(m => m.status === 'picked')?.name || maps.find(m => m.status === 'available')?.name}
              </span>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-3">Итоговые карты:</h2>
              <div className="space-y-2 mb-4">
                {pickedMaps.map((map, idx) => (
                  <div key={map.name} className="flex items-center justify-between text-foreground">
                    <span className="font-medium">
                      Карта {idx + 1}: <span className="uppercase">{map.name}</span>
                    </span>
                    {map.side && (
                      <span className="text-sm text-muted-foreground">
                        {map.side.team === 'A' ? teamAName : teamBName} - {map.side.side}
                      </span>
                    )}
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
      )}

      <Dialog open={showSideDialog} onOpenChange={setShowSideDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Выбор стороны</h2>
              <p className="text-muted-foreground">
                {currentTeam === 'A' ? teamAName : teamBName}, выберите сторону для карты{' '}
                <span className="uppercase font-bold">{pendingMapForSide}</span>
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => handleSideChoice('T')}
                className="flex-1 h-24 text-2xl font-bold bg-orange-600 hover:bg-orange-700"
              >
                T (Террористы)
              </Button>
              <Button
                onClick={() => handleSideChoice('CT')}
                className="flex-1 h-24 text-2xl font-bold bg-blue-600 hover:bg-blue-700"
              >
                CT (Спецназ)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Index;