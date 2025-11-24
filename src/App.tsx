import { useState } from 'react';
import Setup from './components/Setup';
import Board from './components/Board';
import EndModal from './components/EndModal';

export interface Player {
  name: string;
  color: string;
}

export interface Position {
  row: number;
  col: number;
}

export type GameState = 'setup' | 'playing' | 'ended';

function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [player1, setPlayer1] = useState<Player>({ name: '', color: '#FF6B6B' });
  const [player2, setPlayer2] = useState<Player>({ name: '', color: '#4ECDC4' });
  const [winner, setWinner] = useState<string>('');

  const handleStartGame = (p1: Player, p2: Player) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setGameState('playing');
  };

  const handleGameEnd = (winnerName: string) => {
    setWinner(winnerName);
    setGameState('ended');
  };

  const handleRestart = () => {
    setGameState('playing');
  };

  const handleNewSetup = () => {
    setGameState('setup');
    setPlayer1({ name: '', color: '#FF6B6B' });
    setPlayer2({ name: '', color: '#4ECDC4' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      {gameState === 'setup' && (
        <Setup onStartGame={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <Board 
          player1={player1} 
          player2={player2} 
          onGameEnd={handleGameEnd}
        />
      )}

      {gameState === 'ended' && (
        <EndModal 
          winner={winner}
          onRestart={handleRestart}
          onNewSetup={handleNewSetup}
        />
      )}
    </div>
  );
}

export default App;
