import { useTheme } from '../themeContext';

interface RulesProps {
  onBack: () => void;
}

function Rules({ onBack }: RulesProps) {
  const { isDarkMode } = useTheme();

  const cardBg = isDarkMode ? '#2d2d2d' : 'white';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const subTextColor = isDarkMode ? '#b0b0b0' : '#666';
  const borderColor = isDarkMode ? '#404040' : '#ddd';

  // Mini board cell style
  const getCellStyle = (isLight: boolean, hasApple: boolean) => ({
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    backgroundColor: hasApple 
      ? (isDarkMode ? '#8B4513' : '#CD853F')
      : isLight 
        ? (isDarkMode ? '#404040' : '#f0d9b5')
        : (isDarkMode ? '#2d2d2d' : '#b58863'),
    border: `1px solid ${borderColor}`,
    position: 'relative' as const
  });

  // Knight movement pattern board
  const renderKnightMoves = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    const knightRow = 3;
    const knightCol = 3;
    
    // Knight position
    board[knightRow][knightCol] = '♞';
    
    // Valid knight moves (L-shaped)
    const moves = [
      [knightRow - 2, knightCol - 1],
      [knightRow - 2, knightCol + 1],
      [knightRow - 1, knightCol - 2],
      [knightRow - 1, knightCol + 2],
      [knightRow + 1, knightCol - 2],
      [knightRow + 1, knightCol + 2],
      [knightRow + 2, knightCol - 1],
      [knightRow + 2, knightCol + 1]
    ];
    
    moves.forEach(([r, c]) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        board[r][c] = '✓';
      }
    });

    return (
      <div style={{ display: 'inline-block' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              return (
                <div key={colIndex} style={getCellStyle(isLight, false)}>
                  {cell === '♞' && <span style={{ fontSize: '24px' }}>♞</span>}
                  {cell === '✓' && <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>●</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Winning move example: capture opponent
  const renderCaptureWin = () => {
    const board = Array(5).fill(null).map(() => Array(5).fill(null));
    board[1][1] = '♞'; // Your horse
    board[3][2] = '♘'; // Opponent horse (can be captured)
    board[0][0] = '🍎';
    board[2][2] = '🍎';
    board[1][3] = '🍎';

    return (
      <div style={{ display: 'inline-block' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isHighlighted = rowIndex === 3 && colIndex === 2; // Highlight capture square
              return (
                <div 
                  key={colIndex} 
                  style={{
                    ...getCellStyle(isLight, cell === '🍎'),
                    boxShadow: isHighlighted ? '0 0 0 3px #4CAF50 inset' : 'none',
                    backgroundColor: isHighlighted 
                      ? (isDarkMode ? '#2d4d2d' : '#c8e6c9')
                      : getCellStyle(isLight, cell === '🍎').backgroundColor
                  }}
                >
                  {cell && <span>{cell}</span>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: '10px', fontSize: '14px', textAlign: 'center', color: '#4CAF50' }}>
          ♞ → ♘ = Victory! 🎉
        </div>
      </div>
    );
  };

  // Blocking win example: opponent has no moves
  const renderBlockWin = () => {
    const board = Array(4).fill(null).map(() => Array(4).fill(null));
    board[0][0] = '♘'; // Opponent horse (surrounded)
    board[1][2] = '🍎';
    board[2][1] = '🍎';
    board[3][3] = '♞'; // Your horse

    return (
      <div style={{ display: 'inline-block' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              return (
                <div key={colIndex} style={getCellStyle(isLight, cell === '🍎')}>
                  {cell && <span>{cell}</span>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: '10px', fontSize: '14px', textAlign: 'center', color: '#4CAF50' }}>
          ♘ is blocked! ♞ wins! 🎉
        </div>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '700px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: cardBg,
        padding: 'clamp(20px, 4vw, 40px)',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 36px)',
          marginBottom: '10px',
          color: textColor,
          textAlign: 'center'
        }}>
          📖 Game Rules
        </h1>
        
        <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: textColor, lineHeight: '1.6' }}>
          
          {/* Basic Rules */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              🎯 Objective
            </h2>
            <p style={{ color: subTextColor, marginBottom: '10px' }}>
              Capture your opponent's horse or block them so they cannot make any legal moves.
            </p>
          </section>

          {/* Setup */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              ⚙️ Setup
            </h2>
            <ul style={{ color: subTextColor, paddingLeft: '20px' }}>
              <li>8×8 game board</li>
              <li>Two players with unique colors</li>
              <li>Horses start at opposite corners: (0,0) and (7,7)</li>
            </ul>
          </section>

          {/* How to Move */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              🐴 How Horses Move
            </h2>
            <p style={{ color: subTextColor, marginBottom: '15px' }}>
              Horses move like chess knights in an <strong>L-shape</strong>: 2 squares in one direction, then 1 square perpendicular.
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
              borderRadius: '8px',
              border: `1px solid ${borderColor}`
            }}>
              {renderKnightMoves()}
            </div>
            <p style={{ color: subTextColor, fontSize: '14px', textAlign: 'center', fontStyle: 'italic' }}>
              Green dots (●) show all possible moves from the knight's position
            </p>
          </section>

          {/* Apple Mechanics */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              🍎 Apple Mechanics
            </h2>
            <ul style={{ color: subTextColor, paddingLeft: '20px' }}>
              <li>When a horse moves, it leaves an <strong>apple (🍎)</strong> on its previous square</li>
              <li>Apples act as obstacles - horses <strong>cannot</strong> move onto squares with apples</li>
              <li>Apples remain on the board for the entire game</li>
              <li>Strategic apple placement is key to blocking your opponent!</li>
            </ul>
          </section>

          {/* Winning Conditions */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              🏆 How to Win
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: textColor, fontSize: '18px', marginBottom: '10px' }}>
                1️⃣ Capture the Opponent's Horse
              </h3>
              <p style={{ color: subTextColor, marginBottom: '10px' }}>
                Land directly on your opponent's horse to win immediately!
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                padding: '15px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`
              }}>
                {renderCaptureWin()}
              </div>
            </div>

            <div>
              <h3 style={{ color: textColor, fontSize: '18px', marginBottom: '10px' }}>
                2️⃣ Block Your Opponent
              </h3>
              <p style={{ color: subTextColor, marginBottom: '10px' }}>
                If your opponent has no legal moves (blocked by apples), you win!
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                padding: '15px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`
              }}>
                {renderBlockWin()}
              </div>
            </div>
          </section>

          {/* Tips */}
          <section style={{ marginBottom: '25px' }}>
            <h2 style={{ color: textColor, fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '12px' }}>
              💡 Strategy Tips
            </h2>
            <ul style={{ color: subTextColor, paddingLeft: '20px' }}>
              <li>Think ahead - your apples can trap your opponent!</li>
              <li>Control the center of the board early</li>
              <li>Watch out for being cornered or blocked</li>
              <li>Sometimes defensive moves are better than aggressive ones</li>
              <li>Plan your escape routes before making moves</li>
            </ul>
          </section>

        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#757575',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '20px',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#616161';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#757575';
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Rules;
