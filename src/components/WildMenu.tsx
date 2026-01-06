// components/WildMenu.tsx - Yellow wild card action menu

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { playChipClink } from '@/utils/audio';

interface WildMenuProps {
  currentPlayerIndex: number;
  onActionSelect: (action: string) => void;
}

const WildMenu: React.FC<WildMenuProps> = ({
  currentPlayerIndex,
  onActionSelect,
}) => {
  const { boards, players } = useGameStore();

  const canRemoveRed =
    boards[currentPlayerIndex].filter((c) => c === 'red').length > 0;
  const canRestoreRed =
    boards[currentPlayerIndex].filter((c) => c === 'empty').length > 0 &&
    boards[currentPlayerIndex].filter((c) => c === 'red').length <
      boards[currentPlayerIndex].length;

  const actions = [
    {
      id: 'place-green',
      label: 'Place Green',
      icon: '🟢',
      desc: 'Add to your board',
      available: true,
    },
    {
      id: 'place-red',
      label: 'Place Red',
      icon: '🔴',
      desc: 'Block opponent',
      available: true,
    },
    {
      id: 'remove-red',
      label: 'Remove Red',
      icon: '❌',
      desc: 'Clear your board',
      available: canRemoveRed,
    },
    {
      id: 'restore-red',
      label: 'Restore Red',
      icon: '♻️',
      desc: 'Add red to empty spot',
      available: canRestoreRed,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="glass-card p-6 sm:p-8 w-full max-w-md"
      >
        <h2 className="neon-title text-2xl sm:text-3xl font-black text-center mb-2">
          ✨ WILD CARD ✨
        </h2>
        <p className="text-center text-white/70 mb-6">
          {players[currentPlayerIndex]?.name}'s Choice
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {actions.map((action, idx) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: action.available ? 1.05 : 1 }}
              whileTap={{ scale: action.available ? 0.95 : 1 }}
              onClick={() => {
                if (action.available) {
                  playChipClink();
                  onActionSelect(action.id);
                }
              }}
              disabled={!action.available}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                action.available
                  ? 'cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              style={{
                background: action.available
                  ? 'rgba(0, 255, 136, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${
                  action.available
                    ? 'rgba(0, 255, 136, 0.5)'
                    : 'rgba(255, 255, 255, 0.1)'
                }`,
              }}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <p className="font-bold text-xs sm:text-sm">{action.label}</p>
              <p className="text-xs text-white/60 leading-tight">
                {action.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WildMenu;
