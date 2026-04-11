"use client";

import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import { useMemo } from 'react';

const PROVERBS = [
  {
    id: 1,
    che: "Гиллакх — дешин маӀа ю",
    rus: "Благородство — это золотая корона",
    context: "Этикет и культура поведения важнее силы"
  },
  {
    id: 2,
    che: "Къонахчуьн дош — цуьн намыс",
    rus: "Слово мужчины — его честь",
    context: "Верность данному слову — основа вайнахского общества"
  },
  {
    id: 3,
    che: "Массо а стаг — шен хӀуьнан эла",
    rus: "Каждый человек — хозяин своей судьбы",
    context: "Об ответственности за свои поступки и достоинство"
  },
  {
    id: 4,
    che: "Къинхетам боцуш верг — адамаллех воьхна",
    rus: "Кто не знает милосердия, тот потерял человечность",
    context: "О важности доброты и сострадания (Белхи)"
  }
];

export default function WisdomCard() {
  const wisdom = useMemo(() => {
    // Pick based on day of year to keep it consistent for all users on the same day
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return PROVERBS[dayOfYear % PROVERBS.length];
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-kherch-dark to-[#1a1c1e] p-6 rounded-[2.5rem] shadow-2xl border border-white/5 group mb-8"
    >
      {/* Background Micro-Decoration */}
      <div className="absolute top-[-10%] right-[-5%] opacity-5 transition-transform group-hover:scale-110 duration-1000">
        <Quote size={120} />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-chechen-blue rounded-xl flex items-center justify-center shadow-lg shadow-chechen-blue/20">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chechen-blue">
          Мудрость дня / Нохчалла
        </span>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-white leading-tight tracking-tight">
          «{wisdom.che}»
        </h2>
        
        <div className="space-y-1">
          <p className="text-sm font-bold text-vainakh-stone/60 leading-relaxed italic">
            — {wisdom.rus}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
            {wisdom.context}
          </p>
        </div>
      </div>

      {/* Actionable Hint */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">
           Храните достоинство во всем
         </span>
         <div className="flex gap-1">
            <div className="w-1 h-1 bg-chechen-blue rounded-full"></div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
         </div>
      </div>
    </motion.div>
  );
}
