import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { SetupScreen } from '@/components/map-picker/SetupScreen';
import { FinalScreenBo1 } from '@/components/map-picker/FinalScreenBo1';
import { FinalScreenBo3 } from '@/components/map-picker/FinalScreenBo3';
import { MapGrid } from '@/components/map-picker/MapGrid';
import { SideDialog } from '@/components/map-picker/SideDialog';
import { PickingSummary } from '@/components/map-picker/PickingSummary';
import { GameMode, Phase, Map, Side, MapState, Step } from '@/components/map-picker/types';

const Index = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('bo1');
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
  const [stepIndex, setStepIndex] = useState(0);
  const [showSideDialog, setShowSideDialog] = useState(false);
  const [pendingMapForSide, setPendingMapForSide] = useState<Map | null>(null);
  const [isProcessingLastMap, setIsProcessingLastMap] = useState(false);
  
  const [maps, setMaps] = useState<MapState[]>([
    { name: 'nuke', status: 'available' },
    { name: 'inferno', status: 'available' },
    { name: 'ancient', status: 'available' },
    { name: 'overpass', status: 'available' },
    { name: 'train', status: 'available' },
    { name: 'dust', status: 'available' },
    { name: 'mirage', status: 'available' },
  ]);

  const bo1Steps: Step[] = [
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
    { team: 'A', action: 'ban', count: 1 },
    { team: 'B', action: 'ban', count: 1 },
  ];

  const bo3Steps: Step[] = [
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
    
    if (isProcessingLastMap) {
      setMaps(prev => prev.map(m => 
        m.name === pendingMapForSide 
          ? { ...m, status: 'picked', pickedBy: 'A', pickOrder: 3, side: { team: currentTeam, side } } 
          : m
      ));
      setIsProcessingLastMap(false);
    } else {
      setMaps(prev => prev.map(m => 
        m.name === pendingMapForSide 
          ? { ...m, side: { team: currentTeam, side } } 
          : m
      ));
    }
    
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
    if (gameMode === 'bo3' && isFinished && !isProcessingLastMap) {
      const available = maps.filter(m => m.status === 'available');
      const picked = maps.filter(m => m.status === 'picked');
      
      if (available.length === 1 && picked.length === 2 && !showSideDialog && !pendingMapForSide) {
        setIsProcessingLastMap(true);
        const lastBanTeam = steps[steps.length - 1].team as 'A' | 'B';
        const sideChoosingTeam = lastBanTeam === 'A' ? 'B' : 'A';
        const lastMap = available[0];
        
        setPendingMapForSide(lastMap.name);
        setCurrentTeam(sideChoosingTeam);
        setShowSideDialog(true);
      }
    }
  }, [gameMode, isFinished, isProcessingLastMap, showSideDialog, pendingMapForSide, maps, steps]);

  if (phase === 'setup') {
    return (
      <SetupScreen
        teamAName={teamAName}
        teamBName={teamBName}
        gameMode={gameMode}
        onTeamAChange={setTeamAName}
        onTeamBChange={setTeamBName}
        onGameModeChange={setGameMode}
        onStart={handleStart}
      />
    );
  }

  if (isFinished && gameMode === 'bo1') {
    return <FinalScreenBo1 maps={maps} />;
  }

  const shouldShowFinalScreen = isFinished && gameMode === 'bo3' && pickedMaps.length === 3 && pickedMaps.every(map => map.side !== undefined) && !isProcessingLastMap;

  if (shouldShowFinalScreen) {
    return (
      <FinalScreenBo3 
        pickedMaps={pickedMaps}
        teamAName={teamAName}
        teamBName={teamBName}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className={`text-2xl font-bold ${currentTeam === 'A' && !isFinished ? 'text-teamA animate-pulse-glow' : 'text-foreground'}`}>
          {teamAName}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-lg text-muted-foreground">
            <Icon name="Ban" className="inline mr-2 text-destructive" size={20} />
            <span className="font-bold text-foreground">{bannedCount}</span>
          </div>
          <div className="text-lg text-muted-foreground">
            <Icon name="Check" className="inline mr-2 text-green-500" size={20} />
            <span className="font-bold text-foreground">{pickedCount}</span>
          </div>
          <div className="text-lg text-muted-foreground">
            <Icon name="Circle" className="inline mr-2" size={20} />
            <span className="font-bold text-foreground">{availableCount}</span>
          </div>
        </div>
        
        <div className={`text-2xl font-bold ${currentTeam === 'B' && !isFinished ? 'text-teamB animate-pulse-glow' : 'text-foreground'}`}>
          {teamBName}
        </div>
      </div>

      <MapGrid
        maps={maps}
        gameMode={gameMode}
        isFinished={isFinished}
        teamAName={teamAName}
        teamBName={teamBName}
        onMapClick={handleMapClick}
      />

      <PickingSummary
        isFinished={isFinished}
        gameMode={gameMode}
        pickedMaps={pickedMaps}
        teamAName={teamAName}
        teamBName={teamBName}
      />

      <SideDialog
        open={showSideDialog}
        teamName={currentTeam === 'A' ? teamAName : teamBName}
        mapName={pendingMapForSide || ''}
        onSideChoice={handleSideChoice}
      />
    </div>
  );
};

export default Index;
