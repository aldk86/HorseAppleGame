interface EndModalProps {
  winner: string;
  onRestart: () => void;
  onNewSetup: () => void;
}

function EndModal({ winner, onRestart, onNewSetup }: EndModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 'clamp(20px, 5vw, 40px)',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 7vw, 36px)',
          marginBottom: '20px',
          color: '#4CAF50'
        }}>
          🎉 Game Over! 🎉
        </h1>
        
        <p style={{
          fontSize: 'clamp(18px, 5vw, 24px)',
          marginBottom: '30px',
          color: '#333'
        }}>
          <strong>{winner}</strong> wins!
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button
            onClick={onRestart}
            style={{
              padding: '15px 30px',
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
            Restart Game
          </button>

          <button
            onClick={onNewSetup}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d0d0d0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          >
            New Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndModal;
