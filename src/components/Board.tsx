import { useState, useEffect } from 'react';
import { Player, Position } from '../App';
import { getLegalMoves, coordEquals, hasLegalMoves } from '../gameLogic';
import { gameManager } from '../gameManager';
import { useTheme, KNIGHT_SYMBOLS } from '../themeContext';
import { soundManager } from '../sounds';

interface BoardProps {
  player1: Player;
  player2: Player;
  onGameEnd: (winnerName: string) => void;
  onOpponentLeft?: () => void;
  isNetworkGame?: boolean;
  gameId?: string;
  playerRole?: 1 | 2; // Which player am I in network game
}

function Board({ player1, player2, onGameEnd, onOpponentLeft, isNetworkGame = false, gameId, playerRole }: BoardProps) {
  const { isDarkMode, boardTheme, knightSymbol } = useTheme();
  const [player1Pos, setPlayer1Pos] = useState<Position>({ row: 0, col: 0 });
  const [player2Pos, setPlayer2Pos] = useState<Position>({ row: 7, col: 7 });
  const [apples, setApples] = useState<Position[]>([]);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [highlightedMoves, setHighlightedMoves] = useState<Position[]>([]);
  const [moveStartTime, setMoveStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [hasPlayedStartSound, setHasPlayedStartSound] = useState<boolean>(false);

  // Play game start sound in network mode
  useEffect(() => {
    if (isNetworkGame && !hasPlayedStartSound) {
      soundManager.playGameStart();
      setHasPlayedStartSound(true);
    }
  }, [isNetworkGame, hasPlayedStartSound]);

  useEffect(() => {
    if (currentTurn === 1) {
      if (!hasLegalMoves(player1Pos, apples, player1Pos, player2Pos)) {
        onGameEnd(player2.name);
      }
    } else {
      if (!hasLegalMoves(player2Pos, apples, player2Pos, player1Pos)) {
        onGameEnd(player1.name);
      }
    }
  }, [currentTurn, player1Pos, player2Pos, apples, player1, player2, onGameEnd]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - moveStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [moveStartTime]);

  // Network game: listen for opponent moves
  useEffect(() => {
    if (isNetworkGame && gameId) {
      const unsubscribeMove = gameManager.onOpponentMove((move) => {
        // Apply opponent's move
        if (move.player === 1) {
          setPlayer1Pos(move.newPos);
        } else {
          setPlayer2Pos(move.newPos);
        }
        setApples(move.apples);
        setCurrentTurn(move.nextTurn as 1 | 2);
        setMoveStartTime(Date.now());
        setElapsedTime(0);
        setSelectedPos(null);
        setHighlightedMoves([]);
        
        // Play turn notification if it's now my turn
        if (playerRole && move.nextTurn === playerRole) {
          soundManager.playTurnNotification();
        }
      });

      const unsubscribeEnd = gameManager.onGameEnded((winner) => {
        // Opponent won or lost
        onGameEnd(winner);
      });

      const unsubscribeLeft = gameManager.onOpponentLeft(() => {
        // Opponent left the game
        if (onOpponentLeft) {
          onOpponentLeft();
        }
      });

      return () => {
        unsubscribeMove();
        unsubscribeEnd();
        unsubscribeLeft();
      };
    }
  }, [isNetworkGame, gameId, onGameEnd, onOpponentLeft]);

  const handleCellClick = (row: number, col: number) => {
    // In network game, only allow moves on your turn and if it's your player
    if (isNetworkGame && playerRole && currentTurn !== playerRole) {
      return; // Not your turn
    }

    const clickedPos: Position = { row, col };
    const currentPos = currentTurn === 1 ? player1Pos : player2Pos;
    const opponentPos = currentTurn === 1 ? player2Pos : player1Pos;

    if (selectedPos && coordEquals(clickedPos, currentPos)) {
      setSelectedPos(null);
      setHighlightedMoves([]);
      return;
    }

    if (!selectedPos) {
      if (coordEquals(clickedPos, currentPos)) {
        setSelectedPos(clickedPos);
        const legalMoves = getLegalMoves(currentPos, apples, currentPos, opponentPos);
        setHighlightedMoves(legalMoves);
      }
      return;
    }

    const isLegalMove = highlightedMoves.some(move => coordEquals(move, clickedPos));
    if (isLegalMove) {
      const oldPos = { ...currentPos };
      
      if (coordEquals(clickedPos, opponentPos)) {
        const winnerName = currentTurn === 1 ? player1.name : player2.name;
        
        // Notify opponent in network game
        if (isNetworkGame && gameId) {
          gameManager.sendGameEnd(winnerName);
        }
        
        onGameEnd(winnerName);
        return;
      }

      const newApples = [...apples, oldPos];
      const nextTurn: 1 | 2 = currentTurn === 1 ? 2 : 1;

      if (currentTurn === 1) {
        setPlayer1Pos(clickedPos);
      } else {
        setPlayer2Pos(clickedPos);
      }

      setApples(newApples);
      setSelectedPos(null);
      setHighlightedMoves([]);
      setCurrentTurn(nextTurn as 1 | 2);
      setMoveStartTime(Date.now());
      setElapsedTime(0);

      // Send move to server in network game
      if (isNetworkGame && gameId) {
        gameManager.sendMove({
          player: currentTurn,
          oldPos,
          newPos: clickedPos,
          apples: newApples,
          nextTurn
        });
      }
    }
  };

  const renderCell = (row: number, col: number) => {
    const isLightSquare = (row + col) % 2 === 0;
    const isPlayer1 = coordEquals({ row, col }, player1Pos);
    const isPlayer2 = coordEquals({ row, col }, player2Pos);
    const hasApple = apples.some(apple => coordEquals(apple, { row, col }));
    const isHighlighted = highlightedMoves.some(move => coordEquals(move, { row, col }));
    const isSelected = selectedPos && coordEquals(selectedPos, { row, col });

    let backgroundColor = isLightSquare ? boardTheme.lightSquare : boardTheme.darkSquare;
    if (isHighlighted) {
      backgroundColor = boardTheme.highlight;
    }
    if (isSelected) {
      backgroundColor = boardTheme.selected;
    }

    const cellSize = typeof window !== 'undefined' && window.innerWidth < 480 ? 'min(10vw, 45px)' : 'min(60px, 10vw)';
    const fontSize = typeof window !== 'undefined' && window.innerWidth < 480 ? 'min(6vw, 28px)' : 'min(32px, 6vw)';

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: fontSize,
          cursor: 'pointer',
          border: isSelected ? '3px solid #000' : 'none',
          boxSizing: 'border-box',
          transition: 'background-color 0.2s',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {isPlayer1 && <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>{KNIGHT_SYMBOLS[knightSymbol].player1}</span>}
        {isPlayer2 && <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>{KNIGHT_SYMBOLS[knightSymbol].player2}</span>}
        {hasApple && !isPlayer1 && !isPlayer2 && '🍎'}
      </div>
    );
  };

  const currentPlayer = currentTurn === 1 ? player1 : player2;

  const cellSize = typeof window !== 'undefined' && window.innerWidth < 480 ? 'min(10vw, 45px)' : 'min(60px, 10vw)';

  const cardBg = isDarkMode ? '#2d2d2d' : 'white';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const modeLabelBg = isDarkMode 
    ? (isNetworkGame ? '#1a237e' : '#424242')
    : (isNetworkGame ? '#e3f2fd' : '#f5f5f5');
  const modeLabelColor = isDarkMode
    ? (isNetworkGame ? '#90caf9' : '#b0b0b0')
    : (isNetworkGame ? '#1976D2' : '#666');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      width: '100%',
      maxWidth: '600px',
      boxSizing: 'border-box'
    }}>
      {/* Play Mode Label */}
      <div style={{
        backgroundColor: modeLabelBg,
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: 'clamp(12px, 3vw, 14px)',
        color: modeLabelColor,
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>{isNetworkGame ? '🌐' : '📱'}</span>
        <span>{isNetworkGame ? 'Network Play' : 'Same Device'}</span>
        {isNetworkGame && playerRole && (
          <span style={{ 
            marginLeft: '8px', 
            padding: '2px 8px', 
            backgroundColor: isDarkMode ? '#404040' : 'white', 
            borderRadius: '10px',
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            color: textColor
          }}>
            You: {playerRole === 1 ? KNIGHT_SYMBOLS[knightSymbol].player1 + ' ' + player1.name : KNIGHT_SYMBOLS[knightSymbol].player2 + ' ' + player2.name}
          </span>
        )}
      </div>

      <div style={{
        backgroundColor: cardBg,
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: 'clamp(18px, 5vw, 24px)',
        fontWeight: 'bold',
        color: currentPlayer.color,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        animation: (isNetworkGame && playerRole === currentTurn) ? 'pulse 2s infinite' : 'none',
        border: (isNetworkGame && playerRole === currentTurn) ? `3px solid ${currentPlayer.color}` : 'none'
      }}>
        <div>
          {isNetworkGame && playerRole === currentTurn && '🔔 '}
          {currentPlayer.name}'s Turn
          {isNetworkGame && playerRole === currentTurn && ' 🔔'}
        </div>
        <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: isDarkMode ? '#b0b0b0' : '#666' }}>⏱️ {elapsedTime}s</div>
      </div>

      <div style={{
        display: 'inline-block',
        backgroundColor: cardBg,
        padding: '8px',
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(8, ${cellSize})`,
          gridTemplateRows: `repeat(8, ${cellSize})`,
          border: '2px solid #333'
        }}>
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => renderCell(row, col))
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: cardBg,
        padding: '15px',
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: 'clamp(15px, 5vw, 40px)',
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{KNIGHT_SYMBOLS[knightSymbol].player1}</span>
          <span style={{ fontWeight: 'bold', color: player1.color }}>{player1.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{KNIGHT_SYMBOLS[knightSymbol].player2}</span>
          <span style={{ fontWeight: 'bold', color: player2.color }}>{player2.name}</span>
        </div>
      </div>
    </div>
  );
}

export default Board;
