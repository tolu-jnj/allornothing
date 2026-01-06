// App.tsx - Main game app with complete game flow

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { countDiceOutcome, rollThreeDice } from '@/utils/diceRoll';
import { checkWin } from '@/utils/ticTacToe';
import { enableHaptic, playWinFanfare } from '@/utils/audio';

// Components
import GameSetup from '@/components/GameSetup';
import Board3x3 from '@/components/Board3x3';
import PlayerPanel from '@/components/PlayerPanel';
import RollControls from '@/components/RollControls';
import WinModal from '@/components/WinModal';
import WildMenu from '@/components/WildMenu';

// Styles
import '@/styles/globals.css';

const GameUI: React.FC = () => {
  const {
    gamePhase,
    currentPlayerIndex,
    players,
    boards,
    rollCount,
    diceState,
    lastWildColor,
    numPlayers,
    rollDice,
    placeGreen,
    placeRed,
    removeRed,
    restoreRed,
    nextTurn,
    resetBoard,
    setGamePhase,
  } = useGameStore();

  const [isRolling, setIsRolling] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [roundWinner, setRoundWinner] = useState<number | null>(null);

  const currentPlayer = players[currentPlayerIndex];

  // Handle roll button click
  const handleRoll = () => {
    if (rollCount >= 3 || isRolling) return;

    setIsRolling(true);
    enableHaptic();

    // Simulate roll time
    setTimeout(() => {
      const newDice = rollThreeDice();
      rollDice(newDice);
      setIsRolling(false);
    }, 2500);
  };

  // Handle cell placement
  const handleCellPress = (cellIndex: number) => {
    if (gamePhase === 'placing') {
      const outcome = countDiceOutcome(diceState.map((d) => d.color));

      if (outcome.color === 'green') {
        placeGreen(currentPlayerIndex, cellIndex);

        // Check if this creates a win
        if (checkWin(boards[currentPlayerIndex])) {
          setRoundWinner(currentPlayerIndex);
          setShowWinModal(true);

          // All other players lose a heart
          players.forEach((_, idx) => {
            if (idx !== currentPlayerIndex) {
              players[idx].hearts = Math.max(0, players[idx].hearts - 1);
            }
          });

          if (
            players.every((p, idx) =>
              idx === currentPlayerIndex ? true : p.hearts === 0
            )
          ) {
            setGamePhase('game-over');
          } else {
            setGamePhase('round-end');
          }

          playWinFanfare();
        } else {
          setGamePhase('round-end');
        }
      }
    } else if (gamePhase === 'wild-menu') {
      const color = lastWildColor;
      if (selectedAction === 'place-green' && color === 'yellow') {
        placeGreen(currentPlayerIndex, cellIndex);
      } else if (selectedAction === 'place-red' && color === 'yellow') {
        // Find opponent index (for now, next player)
        const opponentIdx = (currentPlayerIndex + 1) % numPlayers;
        placeRed(opponentIdx, cellIndex);
      } else if (selectedAction === 'remove-red' && color === 'yellow') {
        removeRed(currentPlayerIndex, cellIndex);
      } else if (selectedAction === 'restore-red' && color === 'yellow') {
        restoreRed(currentPlayerIndex, cellIndex);
      }
      setSelectedAction(null);
      setGamePhase('round-end');
    }
  };

  // Handle wild menu action
  const handleWildAction = (action: string) => {
    setSelectedAction(action);
    setGamePhase('playing');
  };

  // Handle continue after win
  const handleWinContinue = () => {
    setShowWinModal(false);
    if (gamePhase === 'game-over') {
      resetBoard();
      setGamePhase('setup');
    } else {
      nextTurn();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a0a, #1a0033, #0d0d1a, #1a0033, #0a0a0a)',
    }}>
      {/* Cosmic background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      <AnimatePresence>
        {gamePhase === 'setup' && <GameSetup key="setup" />}

        {gamePhase !== 'setup' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col"
          >
            {/* Header */}
            <motion.div
              className="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 p-3 sm:p-4 text-center"
            >
              <h1 className="neon-title text-2xl sm:text-3xl font-black">
                ALL OR NOTHING
              </h1>
            </motion.div>

            {/* Main game content - scrollable */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4">
              {/* Current player and roll controls */}
              <RollControls
                onRoll={handleRoll}
                isRolling={isRolling}
                currentPlayerName={currentPlayer?.name || 'Player'}
              />

              {/* Current player's board */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-sm text-white/70">Your Board</p>
                <Board3x3
                  board={boards[currentPlayerIndex]}
                  canPlace={gamePhase === 'placing' || gamePhase === 'wild-menu'}
                  onCellPress={handleCellPress}
                  isCurrentPlayer={true}
                />
              </motion.div>

              {/* Player standings */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2"
              >
                {players.map((player, idx) => (
                  <PlayerPanel
                    key={player.id}
                    player={player}
                    isCurrentPlayer={idx === currentPlayerIndex}
                    isBefore={idx < currentPlayerIndex}
                  />
                ))}
              </motion.div>

              {/* Opponent boards (if needed for testing) */}
              {numPlayers > 1 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-6"
                >
                  <p className="text-sm text-white/70 text-center mb-2">
                    Opponent Boards
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {players.map((player, idx) => {
                      if (idx === currentPlayerIndex) return null;
                      return (
                        <motion.div key={idx} className="flex flex-col items-center">
                          <p className="text-xs text-white/60 mb-1">
                            {player.name}
                          </p>
                          <Board3x3
                            board={boards[idx]}

                            canPlace={false}
                            onCellPress={() => {}}
                            isCurrentPlayer={false}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Wild menu overlay */}
        {gamePhase === 'wild-menu' && (
          <WildMenu
            key="wild"
            currentPlayerIndex={currentPlayerIndex}
            onActionSelect={handleWildAction}
          />
        )}

        {/* Win modal */}
        {showWinModal && roundWinner !== null && (
          <WinModal
            key="win"
            winner={players[roundWinner]}
            allPlayers={players}
            onContinue={handleWinContinue}
            isGameOver={gamePhase === 'game-over'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Root component with PWA support
const App: React.FC = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker not available, app still works
      });
    }
  }, []);

  return <GameUI />;
};

export default App;
