interface NetworkLobbyProps {
  onBack: () => void;
  onCreateGame: () => void;
  onJoinGame: () => void;
}

function NetworkLobby({ onBack, onCreateGame, onJoinGame }: NetworkLobbyProps) {
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
          Network Play
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button
            onClick={onCreateGame}
            style={{
              padding: '18px 25px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#4CAF50',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🎮 Create New Game
          </button>

          <button
            onClick={onJoinGame}
            style={{
              padding: '18px 25px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#2196F3',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1976D2';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2196F3';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🔍 Join Existing Game
          </button>

          <button
            onClick={onBack}
            style={{
              padding: '15px 25px',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
              marginTop: '10px',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d0d0d0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default NetworkLobby;
