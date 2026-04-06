"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Join() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    try {
      // Step 1: Geocoding with Nominatime
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.ville)}`);
      const data = await res.json();
      
      let lat = 43.318, lng = 45.694;
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }

      // Step 2: Add to RTDB with "approved: false"
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
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-apple-light flex items-center justify-center p-6 animate-scale-in">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-4 border border-black/5">
          <div className="flex justify-center">
            <CheckCircle size={64} className="text-chechen-green" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Баркалла!</h2>
          <p className="text-gray-500 leading-relaxed font-medium">
            Ваша заявка отправлена. Администратор проверит ее в ближайшее время.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]"
          >
            Вернуться на карту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-light p-4 pt-safe-top md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up border border-black/5">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Присоединиться</h1>
            <p className="text-sm font-medium text-gray-500">Заполните анкету для вступления в диаспору</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Имя</label>
              <input required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Султан" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Фамилия</label>
              <input required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Вацаев" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Возраст</label>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="30" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Профессия</label>
              <input required type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Врач / Программист" />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-50">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">ЦIер мичар ву хьо (Родное село)</label>
              <input required type="text" name="village" value={formData.village} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Шали" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Хьо тайпан мила ву (Тайп)</label>
              <input required type="text" name="teip" value={formData.teip} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Алхаст" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Город проживания</label>
              <input required type="text" name="ville" value={formData.ville} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-chechen-green/20 focus:border-chechen-green/30 transition-all font-medium placeholder:text-gray-300" placeholder="Страсбург, Франция" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4.5 bg-chechen-green text-white rounded-2xl font-extrabold shadow-lg shadow-chechen-green/20 hover:shadow-xl transition-all active:scale-[0.98] mt-2"
          >
            Отправить анкету
          </button>
        </form>
      </div>
    </div>
  );
}
