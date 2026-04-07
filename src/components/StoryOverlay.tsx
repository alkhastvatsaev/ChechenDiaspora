"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StoryOverlayProps {
  member: any;
  onClose: () => void;
  onOpenProfile: () => void;
}

export default function StoryOverlay({ member, onClose, onOpenProfile }: StoryOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onClose();
          return 100;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onClose]);

  const storyTypeColor = member.storyContent?.type === 'berkat' ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-indigo-600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl"
    >
      <div className="relative w-full h-full max-w-lg overflow-hidden flex flex-col">
        {/* Progress Bar */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+10px)] left-4 right-4 h-1 flex gap-1 z-50">
          <div className="h-full bg-white/20 flex-1 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-white`}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.03 }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+24px)] left-4 right-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vainakh-stone rounded-full flex items-center justify-center font-black text-kherch-dark shadow-lg">
              {member.prenom?.[0]}{member.nom?.[0]}
            </div>
            <div>
              <p className="text-white font-black text-sm">{member.prenom} {member.nom}</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{member.storyContent?.date || 'Только что'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center space-y-6">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className={`w-20 h-20 bg-gradient-to-br ${storyTypeColor} rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20`}
          >
             <span className="text-3xl">✨</span>
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-3xl font-black tracking-tighter"
          >
            {member.storyContent?.title || 'Важный Аманат'}
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-xl font-medium leading-relaxed max-w-sm"
          >
            {member.storyContent?.text || 'Здесь будет текст вашей истории или объявления для диаспоры.'}
          </motion.p>
        </div>

        {/* Footer Link */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-10"
        >
          <button 
            onClick={onOpenProfile}
            className="w-full h-16 bg-white/10 border border-white/20 rounded-[2rem] flex items-center justify-between px-6 backdrop-blur-xl group hover:bg-white/20 transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-white/60" />
              <span className="text-white font-black text-sm uppercase tracking-widest">Профиль</span>
            </div>
            <ChevronRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
