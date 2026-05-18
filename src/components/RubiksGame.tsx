import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, useCursor, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';

const CUBE_SIZE = 1;
const SPACING = 0.05;

interface CubieProps {
  position: [number, number, number];
  color: string;
}

function Cubie({ position, color }: CubieProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh 
      position={position} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial 
        color={hovered ? '#4facfe' : color} 
        metalness={0.5} 
        roughness={0.2}
        emissive={hovered ? '#4facfe' : '#000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
}

function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create a 3x3x3 grid of cubies
  const cubies = useMemo(() => {
    const items = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Only outer cubies (if we want a hollow one for performance, but small enough here)
          if (x === 0 && y === 0 && z === 0) continue;
          
          items.push({
            position: [
              x * (CUBE_SIZE + SPACING),
              y * (CUBE_SIZE + SPACING),
              z * (CUBE_SIZE + SPACING)
            ] as [number, number, number],
            color: '#1a1a1a', // Sleek dark cubies
          });
        }
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {cubies.map((cubie, i) => (
        <Cubie key={i} {...cubie} />
      ))}
      
      {/* Decorative inner glow */}
      <pointLight intensity={2} color="#4facfe" distance={5} />
    </group>
  );
}

export default function RubiksGame() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" /> {/* Warm cozy light */}
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4facfe" /> {/* Tech blue light */}
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <RubiksCube />
        </Float>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5} 
        />
        
        {/* Background Atmosphere */}
        <mesh position={[0, 0, -10]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial transparent opacity={0.05} color="#000" />
        </mesh>
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-blue-500/30 px-6 py-2 rounded-full text-blue-400 font-mono text-sm tracking-widest uppercase animate-pulse">
          3D Endless Interface Active
        </div>
      </div>
    </div>
  );
}
