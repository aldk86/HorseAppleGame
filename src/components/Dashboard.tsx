interface DashboardProps {
  onPlaySameDevice: () => void;
  onPlayNetwork: () => void;
}

function Dashboard({ onPlaySameDevice, onPlayNetwork }: DashboardProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 'clamp(30px, 6vw, 50px)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 48px)',
          marginBottom: '15px',
          color: '#333'
        }}>
          🐴 Pferdeäpfel 🍎
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 4vw, 20px)',
          color: '#666',
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
