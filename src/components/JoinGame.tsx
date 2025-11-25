import { useState, useEffect } from 'react';
import { gameManager, GameRoom } from '../gameManager';

interface JoinGameProps {
  onBack: () => void;
  onJoinGame: (hostName: string, hostColor: string, guestName: string, guestColor: string, gameId: string) => void;
}

function JoinGame({ onBack, onJoinGame }: JoinGameProps) {
  const [playerName, setPlayerName] = useState('Player 2');
  const [playerColor, setPlayerColor] = useState('#4ECDC4');
  const [showGames, setShowGames] = useState(false);
  const [availableGames, setAvailableGames] = useState<GameRoom[]>([]);

  const PRESET_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];

  useEffect(() => {
    if (showGames) {
      // Initial load
      setAvailableGames(gameManager.getAllGames());

      // Subscribe to changes
      const unsubscribe = gameManager.subscribe(() => {
        setAvailableGames(gameManager.getAllGames());
      });

      // Refresh every second to update timestamps
      const interval = setInterval(() => {
        setAvailableGames(gameManager.getAllGames());
      }, 1000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, [showGames]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const handleJoinGame = (game: GameRoom) => {
    if (playerName.trim()) {
      gameManager.joinGame(game.id, playerName.trim(), playerColor);
      onJoinGame(game.hostName, game.hostColor, playerName.trim(), playerColor, game.id);
    }
  };

  if (!showGames) {
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
            Join a Game
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
            onClick={() => setShowGames(true)}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#2196F3',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            Find Games
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
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 6vw, 32px)',
          marginBottom: '20px',
          color: '#333',
          textAlign: 'center'
        }}>
          Available Games
        </h2>

        {availableGames.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999',
            fontSize: 'clamp(16px, 4vw, 18px)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔍</div>
            No games available right now
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {availableGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleJoinGame(game)}
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2196F3';
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    fontSize: 'clamp(18px, 4.5vw, 22px)',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Game: {game.id}
                  </div>
                  <div style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: '#666'
                  }}>
                    {getTimeAgo(game.createdAt)}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}>
                  <span style={{ fontSize: '24px' }}>♘</span>
                  <span>Host: <strong style={{ color: game.hostColor }}>{game.hostName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowGames(false)}
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
          Back
        </button>
      </div>
    </div>
  );
}

export default JoinGame;
