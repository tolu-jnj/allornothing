// stores/gameStore.ts - Zustand game state management

import { create } from 'zustand';
import { BoardCell, checkWin } from '@/utils/ticTacToe';
import { DiceColor, countDiceOutcome } from '@/utils/diceRoll';

export interface Player {
  id: number;
  name: string;
  color: string;
  hearts: number;
  wins: number;
}

export interface GameState {
  // Setup
  gameStarted: boolean;
  players: Player[];
  numPlayers: number;
  currentPlayerIndex: number;

  // Game state
  boards: BoardCell[][]; // 6 boards of 9 cells each
  rollCount: number;
  diceState: { color: DiceColor; kept: boolean }[];
  rollHistory: DiceColor[][];
  selectedBoardIndices: number[];

  // UI state
  gamePhase:
    | 'setup'
    | 'playing'
    | 'placing'
    | 'checking-win'
    | 'round-end'
    | 'game-over'
    | 'wild-menu';
  lastWildColor: DiceColor | null;
  alternateMode: boolean;

  // Actions
  setNumPlayers: (num: number) => void;
  setPlayerName: (index: number, name: string) => void;
  startGame: () => void;
  rollDice: (colors: DiceColor[]) => void;
  toggleKeptDice: (index: number) => void;
  resetRoll: () => void;
  placeGreen: (playerIndex: number, cellIndex: number) => void;
  placeRed: (playerIndex: number, cellIndex: number) => void;
  removeRed: (playerIndex: number, cellIndex: number) => void;
  restoreRed: (playerIndex: number, cellIndex: number) => void;
  nextTurn: () => void;
  endTurn: () => void;
  checkWinCondition: () => boolean;
  resetBoard: () => void;
  toggleAlternateMode: () => void;
  setGamePhase: (phase: GameState['gamePhase']) => void;
  setLastWildColor: (color: DiceColor | null) => void;
}

const createEmptyBoards = (): BoardCell[][] => {
  return Array(6)
    .fill(null)
    .map(() => Array(9).fill('empty'));
};

const createEmptyPlayers = (num: number): Player[] => {
  const colors = [
    '#ff4444',
    '#00ff88',
    '#00ffff',
    '#ffdd00',
    '#ff88ff',
    '#ff9900',
  ];
  return Array(num)
    .fill(null)
    .map((_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      color: colors[i],
      hearts: 4,
      wins: 0,
    }));
};

export const useGameStore = create<GameState>((set, get) => ({
  gameStarted: false,
  players: createEmptyPlayers(2),
  numPlayers: 2,
  currentPlayerIndex: 0,
  boards: createEmptyBoards(),
  rollCount: 0,
  diceState: [],
  rollHistory: [],
  selectedBoardIndices: [],
  gamePhase: 'setup',
  lastWildColor: null,
  alternateMode: false,

  setNumPlayers: (num: number) => {
    const clampedNum = Math.max(2, Math.min(6, num));
    set({
      numPlayers: clampedNum,
      players: createEmptyPlayers(clampedNum),
    });
  },

  setPlayerName: (index: number, name: string) => {
    set((state) => ({
      players: state.players.map((p, i) =>
        i === index ? { ...p, name } : p
      ),
    }));
  },

  startGame: () => {
    set((state) => {
      const firstPlayerIndex = Math.floor(Math.random() * state.numPlayers);
      return {
        currentPlayerIndex: firstPlayerIndex,
        gameStarted: true,
        gamePhase: 'playing' as const,
        boards: createEmptyBoards(),
        rollCount: 0,
        diceState: [],
        rollHistory: [],
      };
    });
  },

  rollDice: (colors: DiceColor[]) => {
    set((state) => {
      const newRollCount = state.rollCount + 1;
      const newDiceState = colors.map((color) => ({
        color,
        kept: false,
      }));
      const outcome = countDiceOutcome(colors);
      let newPhase: GameState['gamePhase'] = state.gamePhase;

      if (outcome.type === 'triple') {
        newPhase = outcome.color === 'yellow' ? 'wild-menu' : 'placing';
      } else if (newRollCount >= 3) {
        const newPlayers = state.players.map((p) => p);
        newPlayers[state.currentPlayerIndex].hearts = Math.max(
          0,
          newPlayers[state.currentPlayerIndex].hearts - 1
        );
        newPhase = newPlayers[state.currentPlayerIndex].hearts === 0
          ? newPlayers.filter((p) => p.hearts > 0).length === 1
            ? 'game-over'
            : 'round-end'
          : 'round-end';
        return {
          rollCount: newRollCount,
          diceState: newDiceState,
          rollHistory: [...state.rollHistory, colors],
          gamePhase: newPhase,
          players: newPlayers,
        };
      }

      return {
        rollCount: newRollCount,
        diceState: newDiceState,
        rollHistory: [...state.rollHistory, colors],
        gamePhase: newPhase,
        lastWildColor: outcome.color || null,
      };
    });
  },

  toggleKeptDice: (index: number) => {
    set((state) => ({
      diceState: state.diceState.map((d, i) =>
        i === index ? { ...d, kept: !d.kept } : d
      ),
    }));
  },

  resetRoll: () => {
    set({
      rollCount: 0,
      diceState: [],
      selectedBoardIndices: [],
      gamePhase: 'playing',
    });
  },

  placeGreen: (playerIndex: number, cellIndex: number) => {
    set((state) => {
      const newBoards = state.boards.map((b) => [...b]);
      if (newBoards[playerIndex][cellIndex] === 'empty') {
        newBoards[playerIndex][cellIndex] = 'green';
      }
      return { boards: newBoards, gamePhase: 'checking-win' };
    });
  },

  placeRed: (playerIndex: number, cellIndex: number) => {
    set((state) => {
      const newBoards = state.boards.map((b) => [...b]);
      if (newBoards[playerIndex][cellIndex] !== 'red') {
        newBoards[playerIndex][cellIndex] = 'red';
      }
      return { boards: newBoards, gamePhase: 'round-end' };
    });
  },

  removeRed: (playerIndex: number, cellIndex: number) => {
    set((state) => {
      const newBoards = state.boards.map((b) => [...b]);
      if (newBoards[playerIndex][cellIndex] === 'red') {
        newBoards[playerIndex][cellIndex] = 'empty';
      }
      return { boards: newBoards, gamePhase: 'round-end' };
    });
  },

  restoreRed: (playerIndex: number, cellIndex: number) => {
    set((state) => {
      const newBoards = state.boards.map((b) => [...b]);
      if (newBoards[playerIndex][cellIndex] === 'empty') {
        newBoards[playerIndex][cellIndex] = 'red';
      }
      return { boards: newBoards, gamePhase: 'round-end' };
    });
  },

  checkWinCondition: () => {
    const state = get();
    return checkWin(state.boards[state.currentPlayerIndex]);
  },

  nextTurn: () => {
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.numPlayers,
      rollCount: 0,
      diceState: [],
      selectedBoardIndices: [],
      gamePhase: 'playing',
    }));
  },

  endTurn: () => {
    set({
      rollCount: 0,
      diceState: [],
      selectedBoardIndices: [],
      gamePhase: 'round-end',
    });
  },

  resetBoard: () => {
    set((state) => ({
      gameStarted: false,
      gamePhase: 'setup',
      boards: createEmptyBoards(),
      rollCount: 0,
      diceState: [],
      rollHistory: [],
      selectedBoardIndices: [],
      currentPlayerIndex: 0,
      players: state.players.map((p) => ({
        ...p,
        hearts: 4,
        wins: 0,
      })),
    }));
  },

  toggleAlternateMode: () => {
    set((state) => ({
      alternateMode: !state.alternateMode,
    }));
  },

  setGamePhase: (phase) => {
    set({ gamePhase: phase });
  },

  setLastWildColor: (color) => {
    set({ lastWildColor: color });
  },
}));
