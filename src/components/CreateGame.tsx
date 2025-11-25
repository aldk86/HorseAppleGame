import { useState, useEffect } from 'react';
import { gameManager } from '../gameManager';

interface CreateGameProps {
  onBack: () => void;
  onTimeout: () => void;
  onGameMatched: (hostName: string, hostColor: string, guestName: string, guestColor: string) => void;
}

function CreateGame({ onBack, onTimeout, onGameMatched }: CreateGameProps) {
  const [playerName, setPlayerName] = useState('Player 1');
  const [playerColor, setPlayerColor] = useState('#FF6B6B');
  const [gameCreated, setGameCreated] = useState(false);
  const [gameId, setGameId] = useState<string>('');
  const [countdown, setCountdown] = useState(30);

  const PRESET_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];

  useEffect(() => {
    if (gameCreated) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (gameId) {
              gameManager.removeGame(gameId);
            }
            onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Listen for game start event
      const unsubscribe = gameManager.onGameStarted((data) => {
        if (data.gameId === gameId) {
          clearInterval(timer);
          onGameMatched(data.hostName, data.hostColor, data.guestName, data.guestColor);
        }
      });

      return () => {
        clearInterval(timer);
        unsubscribe();
        if (gameId) {
          gameManager.removeGame(gameId);
        }
      };
    }
  }, [gameCreated, gameId, onTimeout, onGameMatched]);

  const handleCreateGame = () => {
    if (playerName.trim()) {
      const game = gameManager.createGame(playerName.trim(), playerColor);
      setGameId(game.id);
      setGameCreated(true);
    }
  };

  const handleCancel = () => {
    if (gameId) {
      gameManager.removeGame(gameId);
    }
    setGameCreated(false);
    setCountdown(30);
    onBack();
  };

  if (!gameCreated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '500px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: 'clamp(20px, 5vw, 40px)',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            marginBottom: '20px',
            color: '#333',
            textAlign: 'center'
          }}>
            Create New Game
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: 'clamp(16px, 4vw, 18px)',
              marginBottom: '10px',
              color: '#555',
              fontWeight: 'bold'
            }}>
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                border: '2px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
                WebkitAppearance: 'none'
              }}
              placeholder="Enter your name"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: 'clamp(16px, 4vw, 18px)',
              marginBottom: '10px',
              color: '#555',
              fontWeight: 'bold'
            }}>
              Your Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPlayerColor(color)}
                  style={{
                    width: 'clamp(35px, 8vw, 44px)',
                    height: 'clamp(35px, 8vw, 44px)',
                    backgroundColor: color,
                    border: playerColor === color ? '3px solid #333' : '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateGame}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#4CAF50',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            Create Game
          </button>

          <button
            onClick={onBack}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d0d0d0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 'clamp(20px, 5vw, 40px)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          ⏳
        </div>

        <h2 style={{
          fontSize: 'clamp(24px, 6vw, 32px)',
          marginBottom: '15px',
          color: '#333'
        }}>
          Waiting for Opponent...
        </h2>

        <div style={{
          fontSize: 'clamp(18px, 4.5vw, 24px)',
          color: '#666',
          marginBottom: '20px'
        }}>
          Game Code: <strong style={{ color: '#4CAF50' }}>{gameId}</strong>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: '#555',
            marginBottom: '10px'
          }}>
            Your Details
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            fontSize: 'clamp(16px, 4vw, 18px)'
          }}>
            <span style={{ fontSize: '28px' }}>♘</span>
            <span style={{ fontWeight: 'bold', color: playerColor }}>{playerName}</span>
          </div>
        </div>

        <div style={{
          fontSize: 'clamp(48px, 12vw, 72px)',
          fontWeight: 'bold',
          color: countdown <= 10 ? '#f44336' : '#2196F3',
          marginBottom: '20px'
        }}>
          {countdown}s
        </div>

        <button
          onClick={handleCancel}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#f44336',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateGame;
