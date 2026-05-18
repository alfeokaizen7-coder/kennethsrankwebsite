import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Award, Zap, User, Target, ChevronRight, Bell } from 'lucide-react';

interface SystemUIProps {
  ownerName: string;
  achievements: string;
}

export default function SystemUI({ ownerName, achievements }: SystemUIProps) {
  const [level, setLevel] = useState<string | number>("∞");
  const [message, setMessage] = useState("System initialization complete.");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch('/api/system/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: "Infinite", achievements })
        });
        const data = await res.json();
        if (data.message) setMessage(data.message);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchMessage();
    
    const interval = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col p-6 font-mono">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 bg-blue-500/10 border-l-4 border-blue-500 px-4 py-2 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold tracking-tighter uppercase text-lg">SSS RANK PLAYER</span>
          </div>
          <div className="flex flex-col ml-4">
            <div className="text-xs text-blue-300/60 font-bold">{ownerName.toUpperCase()}</div>
            <div className="text-[10px] text-blue-400/80 font-mono font-bold mt-0.5 animate-pulse">[ ∞ ] INFINITE LEVEL</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-amber-500/10 border-r-4 border-amber-500 px-4 py-2 backdrop-blur-sm text-right"
        >
          <div className="text-amber-400 flex items-center justify-end gap-2 text-sm uppercase font-bold">
            Achievements <Award className="w-4 h-4" />
          </div>
          <div className="text-amber-200 text-xl font-bold tracking-tighter">{achievements}</div>
        </motion.div>
      </div>

      {/* Level / HP Stats */}
      <div className="mt-8 flex flex-col gap-4 max-w-xs pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-blue-500/20 shadow-xl overflow-hidden relative"
        >
          <div className="flex justify-between items-end mb-2">
            <span className="text-blue-400 uppercase text-xs font-bold tracking-widest">Level</span>
            <span className="text-4xl text-white font-bold leading-none select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{level}</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white shadow-[0_0_15px_#3b82f6]"
            />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-blue-300/50 uppercase font-bold">
            <span>LIMIT</span>
            <span>UNBOUNDED</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'STR', val: '999', icon: Zap },
            { label: 'AGI', val: '999', icon: Target },
            { label: 'INT', val: '999', icon: User },
            { label: 'VIT', val: '999', icon: Shield },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-black/40 backdrop-blur-md p-2 rounded-md border border-white/5 flex items-center gap-2 group hover:border-blue-500/50 transition-colors"
            >
              <stat.icon className="w-3 h-3 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[8px] text-white/40 leading-none">{stat.label}</span>
                <span className="text-sm text-white font-bold">{stat.val}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main System Message */}
      <div className="mt-auto flex justify-center mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-lg border-y border-blue-500/50 px-12 py-6 max-w-2xl text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="text-blue-500 text-[10px] uppercase tracking-[0.5em] mb-2 font-bold">System Directive</div>
          <p className="text-white text-lg font-medium leading-relaxed italic">
            "{message}"
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Side HUD */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {['QUEST', 'INVENTORY', 'SKILLS', 'GUILD'].map((item, i) => (
          <motion.button
            key={item}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2 text-right group pointer-events-auto"
          >
            <span className="text-[10px] text-white/30 group-hover:text-blue-400 uppercase tracking-widest transition-colors font-bold">{item}</span>
            <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-blue-500 flex items-center justify-center bg-black/20 text-white/20 group-hover:text-blue-400 transition-all">
               <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-0 left-1/2 bg-blue-600/90 backdrop-blur-md px-6 py-3 rounded-full text-white shadow-2xl flex items-center gap-3 border border-white/20 z-50 pointer-events-auto"
          >
            <div className="bg-white/20 rounded-full p-2">
              <Bell className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">New Hidden Quest</span>
              <span className="text-sm font-bold">Solve the Infinite Cube</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mt-4 text-[9px] text-white/20 tracking-tighter">
        <span>DOMAIN STATUS: STABLE</span>
        <span>AUTH: {ownerName}</span>
      </div>
    </div>
  );
}
