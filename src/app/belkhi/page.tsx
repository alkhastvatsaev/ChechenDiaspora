"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Briefcase, 
  Home, 
  Heart, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  MessageCircle,
  Tag,
  Filter,
  X,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

type AdCategory = 'job' | 'housing' | 'aid' | 'business' | 'other';

interface Ad {
  id: string;
  title: string;
  description: string;
  category: AdCategory;
  ville: string;
  pays: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  price?: string;
  phone?: string;
}

const CATEGORIES = [
  { id: 'all', name: 'Все', icon: Flame, color: 'text-orange-500 bg-orange-50' },
  { id: 'job', name: 'Работа', icon: Briefcase, color: 'text-blue-500 bg-blue-50' },
  { id: 'housing', name: 'Жилье', icon: Home, color: 'text-emerald-500 bg-emerald-50' },
  { id: 'aid', name: 'Помощь', icon: Heart, color: 'text-red-500 bg-red-50' },
  { id: 'business', name: 'Бизнес', icon: ShoppingBag, color: 'text-purple-500 bg-purple-50' },
];

export default function BelkhiPage() {
  const { communityMember } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    category: 'aid' as AdCategory,
    ville: '',
    pays: 'France',
    phone: ''
  });

  useEffect(() => {
    const adsRef = ref(db, 'ads');
    const unsubscribe = onValue(adsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const adsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.createdAt - a.createdAt);
        setAds(adsList);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
      const matchesSearch = 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.ville.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [ads, selectedCategory, searchQuery]);

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title || !newAd.description) return;

    const adsRef = ref(db, 'ads');
    const newAdRef = push(adsRef);
    
    await set(newAdRef, {
      ...newAd,
      createdAt: Date.now(),
      authorName: 'Анонимный брат/сестра', // To be updated with Auth later
      authorId: 'system',
    });

    setIsPosting(false);
    setNewAd({
      title: '',
      description: '',
      category: 'aid',
      ville: '',
      pays: 'France',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-black/5 pt-safe-top">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Белхи / Belkhi</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Взаимопомощь</p>
          </div>
          <button 
            onClick={() => setIsPosting(true)}
            className="p-2 bg-black text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Intro Section */}
        <div className="bg-hearth-amber/5 border border-hearth-amber/10 rounded-[2rem] p-6 flex gap-4 items-start">
           <div className="p-3 bg-hearth-amber/10 rounded-2xl">
             <Heart size={24} className="text-hearth-amber" />
           </div>
           <div>
             <h3 className="font-bold text-hearth-amber">Традиция Белхи</h3>
             <p className="text-sm text-gray-600 font-medium leading-relaxed">
               В чеченской культуре «Белхи» — это волонтерская помощь общиной. Продавайте, предлагайте работу или просите о помощи в духе Нохчалла.
             </p>
           </div>
        </div>

        {/* Search & Categories */}
        <div className="space-y-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Что вы ищете? (Работа, Квартира...)"
              className="w-full bg-white border border-black/5 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-black/10 outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedCategory === cat.id ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-500 border-black/5 hover:border-black/10'}`}
              >
                <cat.icon size={16} className={selectedCategory === cat.id ? 'text-white' : ''} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ads List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-black/5 border-t-black rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-gray-400">Загрузка объявлений...</p>
            </div>
          ) : filteredAds.length > 0 ? (
            filteredAds.map(ad => (
              <div 
                key={ad.id}
                className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${CATEGORIES.find(c => c.id === ad.category)?.color}`}>
                         {CATEGORIES.find(c => c.id === ad.category)?.name}
                       </span>
                       <span className="text-gray-300 text-[10px] flex items-center gap-1 font-bold">
                         <Clock size={12} /> {new Date(ad.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mt-1">{ad.title}</h2>
                  </div>
                  {ad.price && (
                    <div className="bg-black text-white px-4 py-2 rounded-xl text-sm font-black">
                      {ad.price}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {ad.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                   <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                     <span className="flex items-center gap-1.5"><MapPin size={14} /> {ad.ville}, {ad.pays}</span>
                     <span className="hidden sm:flex items-center gap-1.5"><Tag size={14} /> {ad.authorName}</span>
                   </div>
                   <button 
                     onClick={() => ad.phone && window.open(`tel:${ad.phone}`)}
                     className="bg-apple-light hover:bg-black hover:text-white p-3 rounded-full transition-all"
                   >
                     <MessageCircle size={20} />
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-black/5 rounded-[3rem]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="text-gray-300" size={32} />
              </div>
              <p className="font-bold text-gray-400">Объявлений пока нет.<br/>Будьте первым!</p>
            </div>
          )}
        </div>
      </main>

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPosting(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 animate-slide-up overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight">Новое объявление</h2>
              <button onClick={() => setIsPosting(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostAd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Категория</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewAd({ ...newAd, category: cat.id as AdCategory })}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${newAd.category === cat.id ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-transparent'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Заголовок</label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Ищу работу плиточником"
                  className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white p-4 rounded-xl text-sm font-medium outline-none transition-all"
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Описание (Подробно)</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Опишите ваше предложение или просьбу..."
                  className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white p-4 rounded-xl text-sm font-medium outline-none transition-all resize-none"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Город</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Например: Paris"
                    className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white p-4 rounded-xl text-sm font-medium outline-none transition-all"
                    value={newAd.ville}
                    onChange={(e) => setNewAd({ ...newAd, ville: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Телефон</label>
                  <input 
                    type="tel" 
                    placeholder="+33..."
                    className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white p-4 rounded-xl text-sm font-medium outline-none transition-all"
                    value={newAd.phone}
                    onChange={(e) => setNewAd({ ...newAd, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                 <button 
                   type="submit"
                   className="w-full py-5 bg-black text-white rounded-2xl font-black shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                 >
                   Опубликовать в Белхи <Plus size={20} />
                 </button>
                 <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-[0.2em] leading-relaxed">
                   Публикуя, вы подтверждаете <br/> следование кодексу Нохчалла.
                 </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
