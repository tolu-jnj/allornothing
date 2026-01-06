// components/RollControls.tsx - Dice roll UI and controls

import React from 'react';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { DiceColor, countDiceOutcome } from '@/utils/diceRoll';
import { playDiceClatter } from '@/utils/audio';

interface RollControlsProps {
  onRoll: () => void;
  isRolling: boolean;
  currentPlayerName: string;
}

const RollControls: React.FC<RollControlsProps> = ({
  onRoll,
  isRolling,
  currentPlayerName,
}) => {
  const { diceState, rollCount } = useGameStore();

  const getDiceColor = (color: DiceColor): string => {
    if (color === 'green') return '#00ff88';
    if (color === 'red') return '#ff4444';
    return '#ffd700';
  };

  const getDiceLabel = (color: DiceColor): string => {
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  const outcome = diceState.length > 0 ? countDiceOutcome(diceState.map((d) => d.color)) : null;
  const isTriple = outcome?.type === 'triple';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 sm:p-6 w-full max-w-2xl"
    >
      <h2 className="text-center text-lg sm:text-2xl font-bold mb-4 neon-title">
        {currentPlayerName}'s Turn
      </h2>

      {/* Dice Display */}
      {diceState.length > 0 && (
        <div className="mb-6">
          <div className="text-center text-sm text-white/70 mb-2">
            Roll {rollCount} of 3
            {isTriple && ' - TRIPLE DETECTED!'}
          </div>
          <div className="flex gap-2 sm:gap-4 justify-center mb-4">
            {diceState.map((die, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newDiceState = useGameStore.getState().diceState.map((d, i) =>
                    i === idx ? { ...d, kept: !d.kept } : d
                  );
                  useGameStore.setState({ diceState: newDiceState });
                }}
                className={`w-16 sm:w-20 h-16 sm:h-20 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 ${
                  die.kept
                    ? 'ring-2 ring-offset-2 ring-offset-black opacity-100'
                    : 'opacity-75'
                }`}
                style={{
                  backgroundColor: getDiceColor(die.color),
                  color: '#000',
                  borderColor: getDiceColor(die.color),
                  boxShadow: `0 0 15px ${getDiceColor(die.color)}60`,
                }}
              >
                {getDiceLabel(die.color)}
              </motion.button>
            ))}
          </div>
          {rollCount < 3 && !isTriple && (
            <p className="text-center text-xs text-white/60">
              Tap dice to keep them for next roll
            </p>
          )}
        </div>
      )}

      {/* Roll Button */}
      {rollCount < 3 && !isTriple && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onRoll();
            playDiceClatter();
          }}
          disabled={isRolling}
          className="w-full py-3 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl flex items-center justify-center gap-2 transition-all duration-200 mb-3"
          style={{
            background: isRolling
              ? 'rgba(0, 255, 136, 0.2)'
              : 'linear-gradient(135deg, #00ff88, #00cc66)',
            opacity: isRolling ? 0.7 : 1,
            cursor: isRolling ? 'not-allowed' : 'pointer',
          }}
        >
          <Dices size={24} />
          {isRolling ? 'Rolling...' : `Roll Dice (${rollCount}/3)`}
        </motion.button>
      )}

      {/* Triple outcome message */}
      {isTriple && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center p-3 rounded-xl mb-3"
          style={{
            backgroundColor: `${getDiceColor(outcome?.color || 'green')}30`,
            border: `2px solid ${getDiceColor(outcome?.color || 'green')}`,
          }}
        >
          <p className="font-bold text-base sm:text-lg" style={{ color: getDiceColor(outcome?.color || 'green') }}>
            🎲 TRIPLE {outcome?.color?.toUpperCase()} 🎲
          </p>
          <p className="text-xs text-white/70">
            {rollCount === 1 ? 'FREE ROLL + Place!' : 'Free placement!'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RollControls;
