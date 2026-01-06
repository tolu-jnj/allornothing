// components/PlayerPanel.tsx - Player info display with hearts and name

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Player } from '@/stores/gameStore';

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  isBefore: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  isCurrentPlayer,
  isBefore,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isBefore ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-sm p-3 sm:p-4 rounded-2xl w-full sm:w-48 transition-all duration-300 ${
        isCurrentPlayer
          ? 'ring-2 ring-offset-2 ring-offset-black'
          : 'opacity-60'
      }`}
      style={{
        borderColor: isCurrentPlayer ? player.color : 'rgba(255, 255, 255, 0.2)',
        boxShadow: isCurrentPlayer
          ? `0 0 20px ${player.color}60`
          : 'none',
      }}
    >
      <div className="text-center mb-2">
        <motion.h3
          className="text-lg sm:text-xl font-bold truncate"
          style={{ color: player.color }}
        >
          {player.name}
        </motion.h3>
        <p className="text-xs sm:text-sm text-white/60">
          {isCurrentPlayer ? '→ TURN' : ''}
        </p>
      </div>

      {/* Hearts Display */}
      <div className="flex gap-1 sm:gap-2 justify-center mb-2">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i < player.hearts ? 1 : 0.5,
                opacity: i < player.hearts ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={24}
                className="sm:w-6 sm:h-6"
                fill={i < player.hearts ? player.color : 'transparent'}
                color={player.color}
              />
            </motion.div>
          ))}
      </div>

      {/* Wins Counter */}
      {player.wins > 0 && (
        <motion.div
          className="text-center text-xs sm:text-sm font-semibold"
          style={{ color: player.color }}
        >
          {player.wins} Wins
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlayerPanel;
