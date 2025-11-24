export interface Position {
  row: number;
  col: number;
}

const KNIGHT_MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
];

export const isInsideBoard = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const coordEquals = (pos1: Position, pos2: Position): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

export const getLegalMoves = (
  position: Position,
  apples: Position[],
  ownPos: Position,
  oppPos: Position
): Position[] => {
  const legalMoves: Position[] = [];

  for (const [dRow, dCol] of KNIGHT_MOVES) {
    const newRow = position.row + dRow;
    const newCol = position.col + dCol;

    if (!isInsideBoard(newRow, newCol)) {
      continue;
    }

    const newPos: Position = { row: newRow, col: newCol };

    const hasApple = apples.some(apple => coordEquals(apple, newPos));
    if (hasApple) {
      continue;
    }

    const isOwnPosition = coordEquals(newPos, ownPos);
    if (isOwnPosition) {
      continue;
    }

    legalMoves.push(newPos);
  }

  return legalMoves;
};

export const hasLegalMoves = (
  position: Position,
  apples: Position[],
  ownPos: Position,
  oppPos: Position
): boolean => {
  return getLegalMoves(position, apples, ownPos, oppPos).length > 0;
};
