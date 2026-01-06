// components/WinModal.tsx - Win and game over screens

import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/stores/gameStore';
import { playWinFanfare } from '@/utils/audio';

interface WinModalProps {
  winner: Player;
  allPlayers: Player[];
  onContinue: () => void;
  isGameOver: boolean;
}

const WinModal: React.FC<WinModalProps> = ({
  winner,
  allPlayers,
  onContinue,
  isGameOver,
}) => {
  React.useEffect(() => {
    playWinFanfare();
  }, []);

  const Confetti = () => {
    const confetti = Array(30).fill(null);
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute w-3 h-3 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: -10,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: 0,
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: idx * 0.05,
              ease: 'easeIn',
            }}
            style={{
              backgroundColor: [
                '#00ff88',
                '#ff4444',
                '#ffd700',
                '#00ffff',
                '#ff88ff',
              ][idx % 5],
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="glass-card p-6 sm:p-8 w-full max-w-md text-center"
        >
          {isGameOver ? (
            <>
              <motion.h1
                className="neon-title text-3xl sm:text-4xl font-black mb-2"
              >
                🏆 GAME OVER 🏆
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 mb-6"
              >
                All players eliminated!
              </motion.p>
            </>
          ) : (
            <>
              <motion.h1
                className="neon-title text-3xl sm:text-4xl font-black mb-2"
              >
                🎉 ROUND WIN! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 mb-4"
              >
                Got 3-in-a-row!
              </motion.p>
            </>
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-6 p-4 rounded-xl"
            style={{
              backgroundColor: `${winner.color}30`,
              border: `3px solid ${winner.color}`,
            }}
          >
            <p className="text-base text-white/70 mb-2">
              {isGameOver ? 'Last Standing:' : 'Round Winner:'}
            </p>
            <p
              className="text-2xl sm:text-3xl font-black"
              style={{ color: winner.color }}
            >
              {winner.name}
            </p>
          </motion.div>

          {/* Standings */}
          <div className="mb-6 space-y-2 text-sm">
            {allPlayers
              .sort((a, b) => b.hearts - a.hearts)
              .map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex justify-between items-center p-2 rounded-lg"
                  style={{
                    backgroundColor: `${player.color}20`,
                  }}
                >
                  <span style={{ color: player.color }}>
                    {idx + 1}. {player.name}
                  </span>
                  <span className="text-white/60">
                    ❤️ {player.hearts} | 🏅 {player.wins}
                  </span>
                </motion.div>
              ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #00ff88, #00cc66)',
              color: '#000',
            }}
          >
            {isGameOver ? '🏠 Main Menu' : '➡️ Next Round'}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default WinModal;
