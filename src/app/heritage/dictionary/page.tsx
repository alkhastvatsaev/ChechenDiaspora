"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, Book, GraduationCap, History, Bookmark, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial seed data (could be expanded to thousands of words later)
const DICTIONARY_SEED = [
  // Greeting / Common
  { ce: "Маршалла", fr: "Salutations / Paix", ru: "Приветствие / Мир", cat: "Приветствие" },
  { ce: "Де дика хуьлда", fr: "Bonjour", ru: "Добрый день", cat: "Приветствие" },
  { ce: "Баркалла", fr: "Merci", ru: "Спасибо", cat: "Вежливость" },
  { ce: "Дела реза хилда", fr: "Que Dieu soit satisfait de toi (Merci)", ru: "Да будет доволен тобой Аллах (Спасибо)", cat: "Вежливость" },
  { ce: "ХIаъ", fr: "Oui", ru: "Да", cat: "Общее" },
  { ce: "ХIан-хIа", fr: "Non", ru: "Нет", cat: "Общее" },
  
  // Nokhchalla / Culture
  { ce: "Нохчалла", fr: "L'identité/vertu tchétchène (Code d'honneur)", ru: "Чеченство (Кодекс чести)", cat: "Культура" },
  { ce: "Къонах", fr: "Homme d'honneur / Brave", ru: "Благородный муж / Витязь", cat: "Культура" },
  { ce: "Яхь", fr: "Émulation noble / Fierté saine", ru: "Здоровое соперничество / Честь", cat: "Культура" },
  { ce: "Оьздангалла", fr: "Noblesse / Étiquette / Politesse", ru: "Благородство / Этикет", cat: "Культура" },
  { ce: "ГIиллакх", fr: "Coutume / Politesse / Savoir-vivre", ru: "Обычай / Этикет", cat: "Культура" },
  
  // Family / People
  { ce: "Ваша", fr: "Frère", ru: "Брат", cat: "Семья" },
  { ce: "Йиша", fr: "Sœur", ru: "Сестра", cat: "Семья" },
  { ce: "Да", fr: "Père", ru: "Отец", cat: "Семья" },
  { ce: "Нана", fr: "Mère", ru: "Мать", cat: "Семья" },
  { ce: "КIант", fr: "Garçon / Fils", ru: "Сын / Парень", cat: "Семья" },
  { ce: "ЙоI", fr: "Fille", ru: "Дочь / Девушка", cat: "Семья" },
  { ce: "Гергарло", fr: "Parenté / Lien", ru: "Родство / Связь", cat: "Семья" },
  
  // Nature / Places
  { ce: "Лам", fr: "Montagne", ru: "Гора", cat: "Природа" },
  { ce: "Аре", fr: "Plaine / Dehors", ru: "Равнина / Улица", cat: "Природа" },
  { ce: "Хи", fr: "Eau / Rivière", ru: "Вода / Река", cat: "Природа" },
  { ce: "Даймохк", fr: "Patrie (Terre des pères)", ru: "Отечество / Родина", cat: "Общее" },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const categories = ["Все", ...Array.from(new Set(DICTIONARY_SEED.map(w => w.cat)))];

  const filteredWords = useMemo(() => {
    return DICTIONARY_SEED.filter(word => {
      const matchesSearch = 
        word.ce.toLowerCase().includes(search.toLowerCase()) ||
        word.fr.toLowerCase().includes(search.toLowerCase()) ||
        word.ru.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = activeCategory === "Все" || word.cat === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-900 pb-20 selection:bg-chechen-blue/20">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4 pt-safe-top">
          <Link href="/heritage" className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors shrink-0">
            <ChevronLeft size={24} />
          </Link>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск слова..."
              className="w-full bg-black/5 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          
          <div className="w-8 shrink-0 flex justify-end">
            <Bookmark size={20} className="text-gray-300" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? "bg-black text-white" 
                  : "bg-black/5 text-gray-500 hover:bg-black/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-chechen-blue/10 text-chechen-blue rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Book size={12} strokeWidth={3} />
            Архив: Дошлор
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Словарь Наследия</h1>
          <p className="text-gray-500 font-medium">Сохранение и передача языка наших предков.</p>
        </header>

        {/* Word Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredWords.length > 0 ? (
              filteredWords.map((word, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  key={word.ce}
                  className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md hover:border-black/10 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-400">
                        {word.cat}
                      </span>
                      <button className="text-gray-300 hover:text-black transition-colors">
                        <Bookmark size={16} />
                      </button>
                    </div>
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                       {word.ce}
                       <span className="w-1.5 h-1.5 rounded-full bg-chechen-blue/30" />
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-600 font-medium leading-tight">
                        {word.ru}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-black/[0.03] flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                    </div>
                    <button className="text-xs font-bold text-gray-300 hover:text-chechen-blue transition-colors flex items-center gap-1 group">
                      Подробнее <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Search size={32} />
                </div>
                <p className="font-bold text-gray-400">Дош ца карийна (Слово не найдено)</p>
                <button 
                  onClick={() => {setSearch(""); setActiveCategory("Все");}}
                  className="text-chechen-blue font-bold text-sm underline underline-offset-4"
                >
                  Показать все слова
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Contribute Section */}
        <section className="mt-32 p-10 bg-black text-white rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Globe size={180} />
          </div>
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-black mb-4">Пополнить архив.</h2>
            <p className="text-gray-400 font-medium mb-8 leading-relaxed">
              Словарь постоянно расширяется. У вас есть PDF, Excel или JSON файл со словами? Или вы хотите добавить слово вручную?
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                Предложить слово
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                Импорт (JSON)
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
