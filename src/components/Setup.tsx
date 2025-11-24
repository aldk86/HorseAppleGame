import { useState } from 'react';
import { Player } from '../App';

interface SetupProps {
  onStartGame: (player1: Player, player2: Player) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

function Setup({ onStartGame }: SetupProps) {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [player1Color, setPlayer1Color] = useState('#FF6B6B');
  const [player2Color, setPlayer2Color] = useState('#4ECDC4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (player1Name.trim() && player2Name.trim()) {
      onStartGame(
        { name: player1Name.trim(), color: player1Color },
        { name: player2Name.trim(), color: player2Color }
      );
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: 'clamp(20px, 5vw, 40px)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: 'clamp(24px, 6vw, 32px)',
        color: '#333'
      }}>
        🐴 Pferdeäpfel 🍎
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#555' }}>
            Player 1
          </h2>
          <input
            type="text"
            placeholder="Enter name"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              border: '2px solid #ddd',
              borderRadius: '6px',
              marginBottom: '10px',
              boxSizing: 'border-box',
              WebkitAppearance: 'none'
            }}
            required
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setPlayer1Color(color)}
                style={{
                  width: 'clamp(35px, 8vw, 44px)',
                  height: 'clamp(35px, 8vw, 44px)',
                  backgroundColor: color,
                  border: player1Color === color ? '3px solid #333' : '2px solid #ddd',
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

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 20px)', marginBottom: '15px', color: '#555' }}>
            Player 2
          </h2>
          <input
            type="text"
            placeholder="Enter name"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              border: '2px solid #ddd',
              borderRadius: '6px',
              marginBottom: '10px',
              boxSizing: 'border-box',
              WebkitAppearance: 'none'
            }}
            required
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setPlayer2Color(color)}
                style={{
                  width: 'clamp(35px, 8vw, 44px)',
                  height: 'clamp(35px, 8vw, 44px)',
                  backgroundColor: color,
                  border: player2Color === color ? '3px solid #333' : '2px solid #ddd',
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
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Start Game
        </button>
      </form>
    </div>
  );
}

export default Setup;
