// components/Board3x3.tsx - 3x3 game board with interactive cells

import React from 'react';
import { motion } from 'framer-motion';
import { BoardCell } from '@/utils/ticTacToe';

interface Board3x3Props {
  board: BoardCell[];
  canPlace: boolean;
  onCellPress: (index: number) => void;
  isCurrentPlayer: boolean;
}

const Board3x3: React.FC<Board3x3Props> = ({
  board,
  canPlace,
  onCellPress,
  isCurrentPlayer,
}) => {
  const getCellColor = (cell: BoardCell): string => {
    if (cell === 'green') return '#00ff88';
    if (cell === 'red') return '#ff4444';
    return 'transparent';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card w-full max-w-xs p-2 sm:p-3"
    >
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {board.map((cell, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: canPlace && isCurrentPlayer ? 1.05 : 1 }}
            whileTap={{ scale: canPlace && isCurrentPlayer ? 0.95 : 1 }}
            onClick={() => canPlace && onCellPress(idx)}
            className={`aspect-square rounded-lg transition-all duration-200 ${
              cell === 'empty'
                ? 'bg-white/5 border border-white/20 hover:bg-white/10'
                : 'border-2'
            } ${
              canPlace && isCurrentPlayer
                ? 'cursor-pointer'
                : 'cursor-default opacity-75'
            }`}
            style={{
              backgroundColor:
                cell !== 'empty'
                  ? getCellColor(cell)
                  : 'rgba(255, 255, 255, 0.05)',
              borderColor: cell !== 'empty' ? getCellColor(cell) : 'rgba(255, 255, 255, 0.2)',
              boxShadow:
                cell !== 'empty'
                  ? `0 0 15px ${getCellColor(cell)}80`
                  : 'none',
            }}
          >
            {cell !== 'empty' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                }}
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: getCellColor(cell),
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Board3x3;
