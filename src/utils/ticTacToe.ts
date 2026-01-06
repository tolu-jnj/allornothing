// utils/ticTacToe.ts - Win detection logic

export type BoardCell = 'empty' | 'green' | 'red';
export type Board = BoardCell[];

export const checkWin = (board: Board): boolean => {
  const winConditions = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];

  return winConditions.some((condition) =>
    condition.every((index) => board[index] === 'green')
  );
};

export const getEmptyCells = (board: Board): number[] => {
  return board
    .map((cell, index) => (cell === 'empty' ? index : -1))
    .filter((index) => index !== -1);
};

export const getAvailableOpponentCells = (board: Board): number[] => {
  return board
    .map((cell, index) => (cell !== 'red' ? index : -1))
    .filter((index) => index !== -1);
};
