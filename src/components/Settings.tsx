import { useTheme, BOARD_THEMES, KNIGHT_SYMBOLS } from '../themeContext';

interface SettingsProps {
  onBack: () => void;
}

function Settings({ onBack }: SettingsProps) {
  const { isDarkMode, toggleDarkMode, boardTheme, setBoardTheme, knightSymbol, setKnightSymbol } = useTheme();

  const cardBg = isDarkMode ? '#2d2d2d' : 'white';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const borderColor = isDarkMode ? '#404040' : '#ddd';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      maxWidth: '600px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: cardBg,
        padding: 'clamp(20px, 5vw, 40px)',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '15px'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 'clamp(24px, 6vw, 32px)',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              color: textColor,
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            margin: 0,
            color: textColor
          }}>
            ⚙️ Settings
          </h1>
        </div>

        {/* Dark Mode */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            marginBottom: '15px',
            color: textColor
          }}>
            🌓 Appearance
          </h2>
          <button
            onClick={toggleDarkMode}
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: isDarkMode ? '#ffa726' : '#424242',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '24px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Board Theme */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            marginBottom: '15px',
            color: textColor
          }}>
            🎨 Board Theme
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '15px'
          }}>
            {BOARD_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setBoardTheme(theme)}
                style={{
                  padding: '15px',
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
                  border: boardTheme.id === theme.id
                    ? `3px solid ${isDarkMode ? '#4CAF50' : '#2196F3'}`
                    : `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (boardTheme.id !== theme.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(4, 1fr)',
                  gap: '2px',
                  marginBottom: '10px',
                  height: '60px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  {Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: (Math.floor(i / 4) + i) % 2 === 0
                          ? theme.lightSquare
                          : theme.darkSquare
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: boardTheme.id === theme.id ? 'bold' : 'normal',
                  color: textColor,
                  textAlign: 'center'
                }}>
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Knight Symbol */}
        <div>
          <h2 style={{
            fontSize: 'clamp(18px, 4.5vw, 22px)',
            marginBottom: '15px',
            color: textColor
          }}>
            ♞ Knight Symbols
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px'
          }}>
            {(Object.keys(KNIGHT_SYMBOLS) as Array<keyof typeof KNIGHT_SYMBOLS>).map(symbol => (
              <button
                key={symbol}
                onClick={() => setKnightSymbol(symbol)}
                style={{
                  padding: '15px',
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
                  border: knightSymbol === symbol
                    ? `3px solid ${isDarkMode ? '#4CAF50' : '#2196F3'}`
                    : `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  WebkitTapHighlightColor: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (knightSymbol !== symbol) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: 'clamp(32px, 8vw, 40px)',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <span>{KNIGHT_SYMBOLS[symbol].player1}</span>
                  <span>{KNIGHT_SYMBOLS[symbol].player2}</span>
                </div>
                <div style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  fontWeight: knightSymbol === symbol ? 'bold' : 'normal',
                  color: textColor,
                  textAlign: 'center'
                }}>
                  {KNIGHT_SYMBOLS[symbol].name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
