import { useState } from 'react';
import Dashboard from './components/Dashboard';
import NetworkLobby from './components/NetworkLobby';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Setup from './components/Setup';
import Board from './components/Board';
import EndModal from './components/EndModal';
import Settings from './components/Settings';
import Rules from './components/Rules';
import { useTheme } from './themeContext';

export interface Player {
  name: string;
  color: string;
}

export interface Position {
  row: number;
  col: number;
}

export type GameState = 'dashboard' | 'networkLobby' | 'createGame' | 'joinGame' | 'setup' | 'playing' | 'ended' | 'settings' | 'rules';

function App() {
  const { isDarkMode } = useTheme();
  const [gameState, setGameState] = useState<GameState>('dashboard');
  const [player1, setPlayer1] = useState<Player>({ name: '', color: '#FF6B6B' });
  const [player2, setPlayer2] = useState<Player>({ name: '', color: '#4ECDC4' });
  const [winner, setWinner] = useState<string>('');
  const [isNetworkGame, setIsNetworkGame] = useState<boolean>(false);
  const [networkGameId, setNetworkGameId] = useState<string>('');
  const [playerRole, setPlayerRole] = useState<1 | 2>(1);

  const handleStartGame = (p1: Player, p2: Player) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setIsNetworkGame(false);
    setGameState('playing');
  };

  const handleGameEnd = (winnerName: string) => {
    setWinner(winnerName);
    setGameState('ended');
  };

  const handleGoHome = () => {
    setGameState('dashboard');
    setPlayer1({ name: '', color: '#FF6B6B' });
    setPlayer2({ name: '', color: '#4ECDC4' });
    setIsNetworkGame(false);
    setNetworkGameId('');
  };

  const handleOpponentLeft = () => {
    alert('Your opponent has left the game. Returning to dashboard...');
    setGameState('dashboard');
    setIsNetworkGame(false);
    setNetworkGameId('');
  };

  const handlePlaySameDevice = () => {
    setGameState('setup');
  };

  const handlePlayNetwork = () => {
    setGameState('networkLobby');
  };

  const handleBackToDashboard = () => {
    setGameState('dashboard');
  };

  const handleCreateGame = () => {
    // Generate a temporary game ID for tracking
    setNetworkGameId('TEMP_' + Date.now());
    setGameState('createGame');
  };

  const handleJoinGame = () => {
    setGameState('joinGame');
  };

  const handleNetworkGameJoined = (hostName: string, hostColor: string, guestName: string, guestColor: string, gameId: string, role: 1 | 2 = 2) => {
    setPlayer1({ name: hostName, color: hostColor });
    setPlayer2({ name: guestName, color: guestColor });
    setIsNetworkGame(true);
    setNetworkGameId(gameId);
    setPlayerRole(role);
    setGameState('playing');
  };

  const handleCreateGameTimeout = () => {
    setGameState('dashboard');
  };

  const handleOpenSettings = () => {
    setGameState('settings');
  };

  const handleShowRules = () => {
    setGameState('rules');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      {gameState === 'dashboard' && (
        <Dashboard 
          onPlaySameDevice={handlePlaySameDevice}
          onPlayNetwork={handlePlayNetwork}
          onOpenSettings={handleOpenSettings}
          onShowRules={handleShowRules}
        />
      )}

      {gameState === 'networkLobby' && (
        <NetworkLobby
          onBack={handleBackToDashboard}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      )}

      {gameState === 'createGame' && (
        <CreateGame
          onBack={handleBackToDashboard}
          onTimeout={handleCreateGameTimeout}
          onGameMatched={(host, hColor, guest, gColor) => {
            // Host is always player 1
            handleNetworkGameJoined(host, hColor, guest, gColor, networkGameId, 1);
          }}
        />
      )}

      {gameState === 'joinGame' && (
        <JoinGame
          onBack={handleBackToDashboard}
          onJoinGame={(host, hColor, guest, gColor, gameId) => {
            // Guest is always player 2
            handleNetworkGameJoined(host, hColor, guest, gColor, gameId, 2);
          }}
        />
      )}

      {gameState === 'setup' && (
        <Setup onStartGame={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <Board 
          player1={player1} 
          player2={player2} 
          onGameEnd={handleGameEnd}
          onOpponentLeft={handleOpponentLeft}
          isNetworkGame={isNetworkGame}
          gameId={networkGameId}
          playerRole={playerRole}
        />
      )}

      {gameState === 'ended' && (
        <EndModal 
          winner={winner}
          onGoHome={handleGoHome}
        />
      )}

      {gameState === 'settings' && (
        <Settings onBack={handleBackToDashboard} />
      )}

      {gameState === 'rules' && (
        <Rules onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
