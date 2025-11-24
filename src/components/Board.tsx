import { useState, useEffect } from 'react';
import { Player, Position } from '../App';
import { getLegalMoves, coordEquals, hasLegalMoves } from '../gameLogic';

interface BoardProps {
  player1: Player;
  player2: Player;
  onGameEnd: (winnerName: string) => void;
}

function Board({ player1, player2, onGameEnd }: BoardProps) {
  const [player1Pos, setPlayer1Pos] = useState<Position>({ row: 0, col: 0 });
  const [player2Pos, setPlayer2Pos] = useState<Position>({ row: 7, col: 7 });
  const [apples, setApples] = useState<Position[]>([]);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [highlightedMoves, setHighlightedMoves] = useState<Position[]>([]);
  const [moveStartTime, setMoveStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);

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

  const handleCellClick = (row: number, col: number) => {
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
        onGameEnd(winnerName);
        return;
      }

      if (currentTurn === 1) {
        setPlayer1Pos(clickedPos);
      } else {
        setPlayer2Pos(clickedPos);
      }

      setApples([...apples, oldPos]);
      setSelectedPos(null);
      setHighlightedMoves([]);
      setCurrentTurn(currentTurn === 1 ? 2 : 1);
      setMoveStartTime(Date.now());
      setElapsedTime(0);
    }
  };

  const renderCell = (row: number, col: number) => {
    const isLightSquare = (row + col) % 2 === 0;
    const isPlayer1 = coordEquals({ row, col }, player1Pos);
    const isPlayer2 = coordEquals({ row, col }, player2Pos);
    const hasApple = apples.some(apple => coordEquals(apple, { row, col }));
    const isHighlighted = highlightedMoves.some(move => coordEquals(move, { row, col }));
    const isSelected = selectedPos && coordEquals(selectedPos, { row, col });

    let backgroundColor = isLightSquare ? '#f0d9b5' : '#b58863';
    if (isHighlighted) {
      backgroundColor = '#90EE90';
    }
    if (isSelected) {
      backgroundColor = '#FFD700';
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
        {isPlayer1 && <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>♘</span>}
        {isPlayer2 && <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>♞</span>}
        {hasApple && !isPlayer1 && !isPlayer2 && '🍎'}
      </div>
    );
  };

  const currentPlayer = currentTurn === 1 ? player1 : player2;

  const cellSize = typeof window !== 'undefined' && window.innerWidth < 480 ? 'min(10vw, 45px)' : 'min(60px, 10vw)';

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
      <div style={{
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: 'clamp(18px, 5vw, 24px)',
        fontWeight: 'bold',
        color: currentPlayer.color,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div>{currentPlayer.name}'s Turn</div>
        <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#666' }}>⏱️ {elapsedTime}s</div>
      </div>

      <div style={{
        display: 'inline-block',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: 'clamp(15px, 5vw, 40px)',
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>♘</span>
          <span style={{ fontWeight: 'bold', color: player1.color }}>{player1.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>♞</span>
          <span style={{ fontWeight: 'bold', color: player2.color }}>{player2.name}</span>
        </div>
      </div>
    </div>
  );
}

export default Board;
