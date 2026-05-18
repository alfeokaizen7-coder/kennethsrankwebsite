/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import RubiksGame from './components/RubiksGame.tsx';
import SystemUI from './components/SystemUI.tsx';
import { motion } from 'motion/react';

const OWNER_NAME = "Kenneth Jay Guban Mapalad";
const ACHIEVEMENTS = "532M+";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#111] overflow-hidden">
      {/* Background Atmosphere - Cozy Lofi Vibe */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layered Gradients from Design Recipe 7 */}
        <div 
          className="absolute inset-0 opacity-40 blur-[100px]"
          style={{
            background: `
              radial-gradient(circle at 10% 20%, rgba(251, 191, 36, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, #000 100%)
            `
          }}
        />
        
        {/* Animated Dust Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-200/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0
              }}
              animate={{ 
                y: [null, "-10%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-1 w-full h-full">
        <RubiksGame />
      </div>

      {/* System Interface Layer */}
      <SystemUI 
        ownerName={OWNER_NAME} 
        achievements={ACHIEVEMENTS} 
      />

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] select-none">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

