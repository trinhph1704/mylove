import { useState } from 'react';
import { Prize } from './data';
import { sendGameResult } from './utils/sheets';
import NameStep from './components/NameStep';
import TeaseStep from './components/TeaseStep';
import LoverStep from './components/LoverStep';
import WishStep from './components/WishStep';
import SelectPrizesStep from './components/SelectPrizesStep';
import SpinWheel from './components/SpinWheel';
import ResultScreen from './components/ResultScreen';
import MusicPlayer from './components/MusicPlayer';
import DancingCats from './components/DancingCats';

type GameStep = 'name' | 'tease' | 'lover' | 'wish' | 'prizes' | 'spin' | 'result';

const STEP_ORDER: GameStep[] = ['name', 'tease', 'lover', 'wish', 'prizes', 'spin', 'result'];

const PROGRESS_STEPS: GameStep[] = ['lover', 'wish', 'prizes'];

function App() {
  const [step, setStep] = useState<GameStep>('name');
  const [playerName, setPlayerName] = useState('');
  const [loverName, setLoverName] = useState('');
  const [wishes, setWishes] = useState('');
  const [selectedPrizes, setSelectedPrizes] = useState<Prize[]>([]);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const progressIndex = PROGRESS_STEPS.indexOf(step);
  const showProgress = progressIndex >= 0;

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setStep('tease');
  };

  const handleTeaseContinue = () => {
    setStep('lover');
  };

  const handleLoverSubmit = (name: string) => {
    setLoverName(name);
    setStep('wish');
  };

  const handleWishSubmit = (wish: string) => {
    setWishes(wish);
    setStep('prizes');
  };

  const handlePrizesSelected = (prizes: Prize[]) => {
    setSelectedPrizes(prizes);
    setStep('spin');
  };

  const handleWin = (prize: Prize) => {
    setWonPrize(prize);
    setStep('result');

    sendGameResult({
      playerName,
      loverChoice: loverName,
      wishes,
      selectedPrizes: selectedPrizes.map((p) => p.name),
      wonPrize: prize.name,
    });
  };

  const handleSpinAgain = () => {
    setWonPrize(null);
    setStep('spin');
  };

  const goBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) {
      setStep(STEP_ORDER[idx - 1]);
    }
  };

  return (
    <div className="app">
      <DancingCats />
      <MusicPlayer />
      <div className="container">
        {showProgress && (
          <div className="progress-bar">
            {progressIndex > 0 && (
              <button className="btn-back" onClick={goBack} aria-label="Quay lại">
                ←
              </button>
            )}
            <div className="progress-dots">
              {PROGRESS_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`progress-dot ${i <= progressIndex ? 'active' : ''} ${i === progressIndex ? 'current' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'name' && <NameStep onSubmit={handleNameSubmit} />}
        {step === 'tease' && (
          <TeaseStep playerName={playerName} onContinue={handleTeaseContinue} />
        )}
        {step === 'lover' && (
          <LoverStep playerName={playerName} onSubmit={handleLoverSubmit} />
        )}
        {step === 'wish' && (
          <WishStep
            playerName={playerName}
            loverName={loverName}
            onSubmit={handleWishSubmit}
          />
        )}
        {step === 'prizes' && (
          <SelectPrizesStep onSubmit={handlePrizesSelected} />
        )}
        {step === 'spin' && (
          <SpinWheel
            prizes={selectedPrizes}
            playerName={playerName}
            onWin={handleWin}
            onBack={goBack}
          />
        )}
        {step === 'result' && wonPrize && (
          <ResultScreen
            prize={wonPrize}
            playerName={playerName}
            loverName={loverName}
            onSpinAgain={handleSpinAgain}
          />
        )}
      </div>
    </div>
  );
}

export default App;
