"use client";

import { motion } from 'framer-motion';
import { 
  Flame, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Globe, 
  Briefcase, 
  Gavel, 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Timer,
  ArrowRight,
  Code2,
  Database
} from 'lucide-react';
import Link from 'next/link';

const PILLARS = [
  {
    id: "trust",
    title: "Система Поручительства (Vouching)",
    status: "Логика подключена",
    progress: 60,
    icon: <ShieldCheck className="text-amber-500" size={24} />,
    tasks: [
      "Архитектура данных (массив vouchedBy) — ЗАВЕРШЕНО",
      "Логика голосования (handleVouch) — ЗАВЕРШЕНО",
      "Интерфейс профиля с кнопкой — ЗАВЕРШЕНО",
      "Знак почета для подтвержденных участников"
    ]
  },
  {
    id: "ancestral",
    title: "Связь Поколений",
    status: "Фильтры активны",
    progress: 50,
    icon: <Globe className="text-blue-500" size={24} />,
    tasks: [
      "Фильтр по Тейпу (Клану) — ЗАВЕРШЕНО",
      "Фильтр по родному селу — ЗАВЕРШЕНО",
      "Сельские хабы (мини-сообщества земляков)",
      "Интеграция на интерактивную карту"
    ]
  },
  {
    id: "legal",
    title: "Юридический Щит",
    status: "Контекст добавлен",
    progress: 25,
    icon: <Gavel className="text-rose-500" size={24} />,
    tasks: [
      "Справочник адвокатов (Убежище / Интерпол)",
      "Кнопка экстренной помощи",
      "База знаний (практические советы по странам)",
      "Проверенные присяжные переводчики"
    ]
  },
  {
    id: "mentorship",
    title: "Наставничество и Успех",
    status: "Кнопка активирована",
    progress: 20,
    icon: <Database className="text-emerald-500" size={24} />,
    tasks: [
      "Профиль ментора (навыки, доступность)",
      "Безопасная система связи",
      "Отслеживание достижений молодежи",
      "Внутренние карьерные вебинары"
    ]
  },
  {
    id: "economy",
    title: "Экономическая Солидарность",
    status: "Частично оперативно",
    progress: 40,
    icon: <Briefcase className="text-indigo-500" size={24} />,
    tasks: [
      "Реестр предприятий диаспоры",
      "Эксклюзивные вакансии для своих",
      "Система поручительства (Жилье)",
      "Внутреннее бизнес-партнерство"
    ]
  },
  {
    id: "pwa",
    title: "Ядро PWA и Архитектура",
    status: "Оперативно",
    progress: 90,
    icon: <Flame className="text-orange-500" size={24} />,
    tasks: [
      "Синхронизация Firebase в реальном времени",
      "Оффлайн режим (PWA)",
      "Безопасность через пароль сообщества",
      "Дизайн-система Glassmorphism (Apple-style)"
    ]
  }
];

export default function DevRoadmap() {
  return (
    <div className="min-h-screen bg-kherch-dark text-vainakh-stone p-6 pb-20 font-sans">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto pt-12 mb-12"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-hearth-glow/20 rounded-2xl flex items-center justify-center border border-hearth-glow/30">
            <Terminal className="text-hearth-glow" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Консоль Разработки</h1>
            <p className="text-sm text-vainakh-stone/40 font-bold uppercase tracking-widest mt-2">Diaspora Hub / Пункт Управления</p>
          </div>
        </div>

        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
           <h2 className="text-lg font-bold text-hearth-amber mb-2 italic">«Разрушить стигму через совершенство.»</h2>
           <p className="text-sm text-vainakh-stone/60 leading-relaxed">
             Эта консоль отслеживает техническое развитие цифровой инфраструктуры диаспоры. Каждая функция создана для усиления нашего сообщества.
           </p>
        </div>
      </motion.div>

      {/* Grid Pillars */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {PILLARS.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               {pillar.icon}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">{pillar.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {pillar.progress === 100 ? (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  ) : pillar.progress === 0 ? (
                    <Circle size={12} className="text-white/20" />
                  ) : (
                    <Timer size={12} className="text-amber-500 animate-pulse" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{pillar.status}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${pillar.progress}%` }}
                 className="h-full bg-gradient-to-r from-chechen-blue to-hearth-glow"
               />
            </div>

            <ul className="space-y-3">
              {pillar.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-white/10 rounded-full mt-1.5 shrink-0" />
                  <span className="text-xs text-vainakh-stone/60 font-medium leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Navigation Return */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-sm font-black uppercase tracking-widest transition-all">
          Вернуться в Хаб <ArrowRight size={16} />
        </Link>
      </div>

      {/* Technical Footer */}
      <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Database size={12} /> Схема Базы Данных
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed font-mono">
            RTDB: /members/[id]<br />
            Firestore: /members/[id]<br />
            Vouches: Array&lt;userId&gt;
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Terminal size={12} /> Тех. Стек
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed font-mono">
            Next.js 15+ (App Router)<br />
            Firebase 11+<br />
            Framer Motion (Anim)
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Code2 size={12} /> Миссия Проекта
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed italic">
            "Высокая эффективность, вклад сообщества, видимость экспертов."
          </p>
        </div>
      </div>
    </div>
  );
}
