// components/Dice3D.tsx - 3D dice with Rapier physics

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Physics,
  RigidBody,
  CuboidCollider,
} from '@react-three/rapier';
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { getPhysicsImpulse, DiceColor } from '@/utils/diceRoll';
import { playDiceClatter } from '@/utils/audio';

interface DiceProps {
  onRollComplete: (colors: DiceColor[]) => void;
  rolling: boolean;
}

const SingleDice = ({
  position,
  impulse,
}: {
  position: [number, number, number];
  impulse: { x: number; y: number; z: number; torque: [number, number, number] };
}) => {
  const rigidBodyRef = useRef<any>(null);
  const [settled, setSettled] = useState(false);
  const settleCooldown = useRef(0);

  useFrame(() => {
    if (rigidBodyRef.current && !settled) {
      const vel = rigidBodyRef.current.linvel();
      const angVel = rigidBodyRef.current.angvel();
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
      const angSpeed = Math.sqrt(
        angVel.x * angVel.x + angVel.y * angVel.y + angVel.z * angVel.z
      );

      if (speed < 0.1 && angSpeed < 0.1) {
        settleCooldown.current++;
        if (settleCooldown.current > 30) {
          setSettled(true);
        }
      } else {
        settleCooldown.current = 0;
      }
    }
  });

  const getDiceFaceColor = (faceIndex: number): string => {
    // Faces: 0=green, 1=green, 2=red, 3=red, 4=yellow, 5=yellow
    const colors = ['#00ff88', '#00ff88', '#ff4444', '#ff4444', '#ffd700', '#ffd700'];
    return colors[faceIndex % 6];
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      linearVelocity={[impulse.x, impulse.y, impulse.z]}
      angularVelocity={impulse.torque}
      colliders={false}
      mass={1}
    >
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        {[0, 1, 2, 3, 4, 5].map((faceIndex) => (
          <meshStandardMaterial
            key={faceIndex}
            color={getDiceFaceColor(faceIndex)}
            emissive={getDiceFaceColor(faceIndex)}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
            attach={`material-${faceIndex}`}
          />
        ))}
      </mesh>
    </RigidBody>
  );
};

const DiceTable = () => {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <CuboidCollider position={[0, -2, 0]} args={[10, 0.1, 10]} />
    </RigidBody>
  );
};

const DiceCanvas: React.FC<DiceProps> = ({ rolling }) => {
  const rollTriggered = useRef(false);

  useEffect(() => {
    if (rolling && !rollTriggered.current) {
      rollTriggered.current = true;
      playDiceClatter();
    }
  }, [rolling]);

  return (
    <Canvas
      camera={{
        position: [5, 8, 5],
        fov: 60,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[5, 8, 5]} fov={60} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      <Physics gravity={[0, -30, 0]}>
        <DiceTable />
        {rolling && [0, 1, 2].map((i) => {
          const seed = Math.random();
          const impulse = getPhysicsImpulse(seed);
          return (
            <SingleDice
              key={i}
              position={[-2 + i * 2, 5, 0]}
              impulse={impulse}
            />
          );
        })}
      </Physics>

      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
};

export default DiceCanvas;
