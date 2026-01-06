// components/GameSetup.tsx - Player setup screen

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

const GameSetup: React.FC = () => {
  const { numPlayers, setNumPlayers, players, setPlayerName, startGame } =
    useGameStore();

  const handleStartGame = () => {
    startGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6"
      style={{
        background:
          'linear-gradient(135deg, #0a0a0a, #1a0033, #0d0d1a, #1a0033, #0a0a0a)',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="neon-title text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-center"
      >
        ALL OR NOTHING
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-white/70 text-sm sm:text-base mb-8 max-w-md"
      >
        Let 'em roll. 2-6 players. One winner. 💎
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 sm:p-8 w-full max-w-md"
      >
        {/* Player Count Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-white/80">
            Number of Players: {numPlayers}
          </label>
          <div className="flex gap-2 justify-between">
            {[2, 3, 4, 5, 6].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNumPlayers(num)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all duration-200 ${
                  numPlayers === num
                    ? 'ring-2 ring-offset-2 ring-offset-black'
                    : 'opacity-60'
                }`}
                style={{
                  backgroundColor:
                    numPlayers === num
                      ? 'rgba(0, 255, 136, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: numPlayers === num ? '#00ff88' : '#fff',
                  borderColor: numPlayers === num ? '#00ff88' : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid',
                }}
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Player Names */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-white/80">
            Player Names
          </label>
          <div className="space-y-2">
            {players.slice(0, numPlayers).map((player, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => setPlayerName(idx, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all"
                  style={{
                    borderColor: player.color,
                    boxShadow: `0 0 10px ${player.color}30`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          className="w-full py-3 rounded-xl font-bold text-lg mt-6 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #00ff88, #00cc66)',
            color: '#000',
          }}
        >
          🎲 LET 'EM ROLL
        </motion.button>
      </motion.div>

      {/* Rules Preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-sm p-4 w-full max-w-md mt-6 text-xs text-white/60"
      >
        <p className="font-semibold mb-2">⚡ Quick Rules:</p>
        <ul className="space-y-1 text-left">
          <li>• Roll 3 dice (up to 3 times)</li>
          <li>• Get 3 of same color = place chip</li>
          <li>• First to 3-in-a-row wins round</li>
          <li>• Others lose 1 heart</li>
          <li>• Last with hearts = game winner</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default GameSetup;
