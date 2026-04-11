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
    rus: "Кто не знает милосерdia, тот потерял человечность",
    context: "О важности доброты и сострадания (Белхи)"
  }
];

export default function WisdomCard() {
  const wisdom = useMemo(() => {
    // Pick based on day of year to keep it consistent
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return PROVERBS[dayOfYear % PROVERBS.length];
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white p-6 rounded-[2.5rem] shadow-xl border border-black/[0.05] group mb-8"
    >
      {/* Background Micro-Decoration */}
      <div className="absolute top-[-10%] right-[-5%] text-black/[0.02] transition-transform group-hover:scale-110 duration-1000">
        <Quote size={120} />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">
          Мудрость дня / Нохчалла
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        <h2 className="text-2xl font-black text-text-primary leading-tight tracking-tight uppercase italic">
          «{wisdom.che}»
        </h2>
        
        <div className="space-y-2">
          <p className="text-[15px] font-bold text-text-secondary leading-relaxed">
            — {wisdom.rus}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-amber">
            {wisdom.context}
          </p>
        </div>
      </div>

      {/* Actionable Hint */}
      <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center justify-between">
         <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">
           Храните достоинство во всем
         </span>
         <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-black/10 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-black/10 rounded-full"></div>
         </div>
      </div>
    </motion.div>
  );
}
