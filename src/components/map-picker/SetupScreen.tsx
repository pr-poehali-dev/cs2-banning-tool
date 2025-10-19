import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GameMode } from './types';

interface SetupScreenProps {
  teamAName: string;
  teamBName: string;
  gameMode: GameMode;
  onTeamAChange: (value: string) => void;
  onTeamBChange: (value: string) => void;
  onGameModeChange: (mode: GameMode) => void;
  onStart: () => void;
}

export const SetupScreen = ({
  teamAName,
  teamBName,
  gameMode,
  onTeamAChange,
  onTeamBChange,
  onGameModeChange,
  onStart,
}: SetupScreenProps) => {
  return (
    <div 
      className="h-screen w-screen flex items-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://cdn.poehali.dev/files/761b2da9-f23a-4178-a08e-1f2bde7cd254.png)',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a1a1a'
      }}
    >
      <div className="w-full max-w-xl ml-[12.5%] space-y-6">
        <div className="flex items-center justify-around gap-8 p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20">
          <img 
            src="https://cdn.poehali.dev/files/85d66b6b-1cfe-4982-83bb-98a653bf6bd6.png" 
            alt="Лого" 
            className="h-16 object-contain"
          />
          <img 
            src="https://cdn.poehali.dev/files/cb97be14-4858-4b8c-a87a-5ce23c4a4432.png" 
            alt="Community" 
            className="h-24 object-contain"
          />
        </div>
        
        <div className="space-y-8 p-12 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 animate-fade-in">
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
              onChange={(e) => onTeamAChange(e.target.value)}
              className="bg-background text-lg h-12"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="teamB" className="text-lg">Команда B</Label>
            <Input
              id="teamB"
              placeholder="Введите название команды B"
              value={teamBName}
              onChange={(e) => onTeamBChange(e.target.value)}
              className="bg-background text-lg h-12"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg">Формат матча</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onGameModeChange('bo1')}
                className={`px-6 py-4 rounded-lg font-medium text-lg transition-colors ${
                  gameMode === 'bo1' 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                BO1
              </button>
              <button
                type="button"
                onClick={() => onGameModeChange('bo3')}
                className={`px-6 py-4 rounded-lg font-medium text-lg transition-colors ${
                  gameMode === 'bo3' 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                BO3
              </button>
            </div>
          </div>
          
          <Button 
            onClick={onStart}
            disabled={!teamAName.trim() || !teamBName.trim()}
            className="w-full h-14 text-xl"
            size="lg"
          >
            Начать выбор карт
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
