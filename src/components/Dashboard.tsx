import { useTheme } from '../themeContext';

interface DashboardProps {
  onPlaySameDevice: () => void;
  onPlayNetwork: () => void;
  onOpenSettings: () => void;
  onShowRules: () => void;
}

function Dashboard({ onPlaySameDevice, onPlayNetwork, onOpenSettings, onShowRules }: DashboardProps) {
  const { isDarkMode } = useTheme();

  const cardBg = isDarkMode ? '#2d2d2d' : 'white';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const subTextColor = isDarkMode ? '#b0b0b0' : '#666';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Settings Button */}
      <button
        onClick={onOpenSettings}
        style={{
          position: 'absolute',
          top: '-10px',
          right: '10px',
          backgroundColor: isDarkMode ? '#404040' : 'white',
          border: `2px solid ${isDarkMode ? '#505050' : '#ddd'}`,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
        }}
      >
        ⚙️
      </button>

      <div style={{
        backgroundColor: cardBg,
        padding: 'clamp(30px, 6vw, 50px)',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 48px)',
          marginBottom: '15px',
          color: textColor
        }}>
          🐴 Pferdeäpfel 🍎
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 4vw, 20px)',
          color: subTextColor,
          marginBottom: '40px'
        }}>
          Horse Apples Chess Game
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <button
            onClick={onPlaySameDevice}
            style={{
              padding: '20px 30px',
              fontSize: 'clamp(18px, 4.5vw, 22px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#4CAF50',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '28px' }}>📱</span>
            Play on Same Device
          </button>

          <button
            onClick={onPlayNetwork}
            style={{
              padding: '20px 30px',
              fontSize: 'clamp(18px, 4.5vw, 22px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#2196F3',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1976D2';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2196F3';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '28px' }}>🌐</span>
            Play on Same Network
          </button>

          <button
            onClick={onShowRules}
            style={{
              padding: '20px 30px',
              fontSize: 'clamp(18px, 4.5vw, 22px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#FF9800',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F57C00';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9800';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '28px' }}>📖</span>
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
