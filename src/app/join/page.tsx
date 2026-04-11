"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

export default function Join() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    age: '',
    profession: '',
    village: '',
    teip: '',
    ville: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Step 1: Geocoding fallback with Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.ville)}`);
      const data = await res.json();
      
      let lat = 43.318, lng = 45.694; // Grozny falback
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }

      // Step 2: Push to DB
      const membersRef = ref(db, 'members');
      const newMemberRef = push(membersRef);
      await set(newMemberRef, {
        ...formData,
        lat,
        lng,
        approved: false,
        createdAt: new Date().toISOString()
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error joining:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-6 text-[#1d1d1f]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Баркалла.</h1>
          <p className="text-lg text-[#86868b] font-medium leading-relaxed mb-10">
            Ваш профиль отправлен. Доступ будет предоставлен после проверки.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-black selection:text-white pb-safe">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-6">
            <UserPlus size={28} className="text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Присоединиться</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Сеть Вайнахской Диаспоры</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-black/5 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Основная Информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" name="prenom" value={formData.prenom} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Имя" />
            </div>
            <div>
              <input required type="text" name="nom" value={formData.nom} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Фамилия" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Возраст" />
            </div>
            <div>
              <input required type="text" name="profession" value={formData.profession} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Профессия" />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-bold text-[#1d1d1f] tracking-tight ml-1">Происхождение и Местоположение</h3>
            
            <div>
              <input required type="text" name="teip" value={formData.teip} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Ваш тейп (напр: Беной)" />
            </div>

            <div>
              <input required type="text" name="village" value={formData.village} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Родное село в Чечне (напр: Шали)" />
            </div>

            <div>
              <input required type="text" name="ville" value={formData.ville} onChange={handleChange} 
                     className="w-full bg-white px-5 py-4 rounded-2xl text-lg font-medium border-0 ring-1 ring-black/5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-[#86868b]" 
                     placeholder="Город текущего проживания (напр: Страсбург)" />
            </div>
          </div>

          <div className="pt-10">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1d1d1f] hover:bg-black text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-[0_5px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Отправка...
                </>
              ) : (
                "Запросить доступ"
              )}
            </button>
          </div>

        </motion.form>

      </div>
    </div>
  );
}
