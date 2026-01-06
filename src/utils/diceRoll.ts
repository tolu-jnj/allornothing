// utils/diceRoll.ts - Cryptographically fair dice RNG

export const generateFairRandom = (): number => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 0xffffffff;
};

export type DiceColor = 'green' | 'red' | 'yellow';

export const rollDice = (): DiceColor => {
  const rand = generateFairRandom();
  if (rand < 1 / 3) return 'green';
  if (rand < 2 / 3) return 'red';
  return 'yellow';
};

export const rollThreeDice = (): DiceColor[] => {
  return [rollDice(), rollDice(), rollDice()];
};

export const countDiceOutcome = (
  dice: DiceColor[]
): { type: 'triple' | 'none'; color?: DiceColor } => {
  const counts = { green: 0, red: 0, yellow: 0 };
  dice.forEach((color) => counts[color]++);

  if (counts.green === 3) return { type: 'triple', color: 'green' };
  if (counts.red === 3) return { type: 'triple', color: 'red' };
  if (counts.yellow === 3) return { type: 'triple', color: 'yellow' };

  return { type: 'none' };
};

export const getPhysicsImpulse = (
  seed: number
): { x: number; y: number; z: number; torque: [number, number, number] } => {
  const rand1 = (seed * 9.2103) % 1;
  const rand2 = (seed * 73.156) % 1;
  const rand3 = (seed * 41.721) % 1;

  return {
    x: (rand1 - 0.5) * 30,
    y: 20 + rand2 * 20,
    z: (rand3 - 0.5) * 30,
    torque: [
      (rand1 - 0.5) * 50,
      (rand2 - 0.5) * 50,
      (rand3 - 0.5) * 50,
    ] as [number, number, number],
  };
};
