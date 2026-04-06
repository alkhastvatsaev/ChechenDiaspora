"use client";

import { X, MapPin, Briefcase, Calendar, Home, Shield, Phone, MessageCircle, ExternalLink, Heart, GraduationCap, Gavel, Truck, Map as MapIcon } from 'lucide-react';

interface MemberProfileProps {
  member: any;
  onClose: () => void;
}

export default function MemberProfile({ member, onClose }: MemberProfileProps) {
  if (!member) return null;

  return (
    <div className="absolute inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content Sheet */}
      <div className="relative w-full max-w-lg bg-vainakh-stone/95 backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up border border-kherch-dark/5">
        {/* Header Image/Pattern Area */}
        <div className="h-32 bg-kherch-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <Shield size={120} className="text-hearth-amber" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all border border-white/5"
          >
            <X size={20} className="text-white/80" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="px-8 pb-10 -mt-10 relative">
          <div className="w-24 h-24 bg-vainakh-stone rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-black text-kherch-dark mb-4 border-4 border-kherch-dark/5 transform hover:rotate-3 transition-transform">
            {member.prenom?.[0]}{member.nom?.[0]}
          </div>

          <div className="space-y-1.5 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-kherch-dark">
              {member.prenom} {member.nom}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-kherch-dark text-vainakh-stone text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                Бёлхи / {member.profession}
              </span>
              <span className="px-3 py-1 bg-white/50 text-kherch-dark text-[10px] font-bold uppercase tracking-widest rounded-full border border-kherch-dark/10">
                {member.teip}
              </span>
            </div>

            {/* Strategic High-Leverage Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {member.isLegalDefender && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20 animate-pulse-slow">
                  <Gavel size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Бакъо / Юрист</span>
                </div>
              )}
              {member.openToMentorship && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-chechen-blue text-white rounded-xl shadow-lg shadow-chechen-blue/20">
                  <GraduationCap size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Кхетам / Ментор</span>
                </div>
              )}
              {member.isFuneralLogistics && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-vainakh-stone rounded-xl shadow-lg shadow-black/20">
                  <Truck size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-vainakh-stone">Кашмаш / Ритуал</span>
                </div>
              )}
              {member.isGuide && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20">
                  <MapIcon size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">ГIо-Деш / Guide</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} className="opacity-50" /> Возраст
              </p>
              <p className="font-bold text-gray-800 text-lg">{member.age} лет</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Home size={12} className="opacity-50" /> Родное село
              </p>
              <p className="font-bold text-gray-800 text-lg">{member.village}</p>
            </div>

            <div className="space-y-1 col-span-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-t border-gray-50 pt-4">
                <MapPin size={12} className="opacity-50" /> Локация проживания
              </p>
              <p className="font-bold text-gray-800 text-lg flex items-center gap-2">
                {member.ville}
              </p>
            </div>
          </div>

          <div className="mt-8 mb-6 p-4 md:p-5 bg-hearth-amber/5 border border-hearth-amber/20 rounded-2xl">
            <h4 className="flex items-center gap-2 text-kherch-dark font-black tracking-tight mb-2 uppercase text-xs tracking-widest">
              <Heart size={14} className="text-hearth-amber" /> 
              Основа — Нохчалла
            </h4>
            <p className="text-xs text-kherch-dark/80 font-medium leading-relaxed">
              Связь и взаимопомощь между нами строятся исключительно на чеченских адатах. Любая помощь, будь то совет в бизнесе или коде, изначально оказывается <strong>бесплатно</strong> (ГIо-Даккхар). 
              Если брат или сестра желает отблагодарить — это их личный выбор и Ризк. Мы строим доверие, а не коммерцию.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-kherch-dark/5">
            <button className="w-full py-4.5 bg-kherch-dark text-vainakh-stone rounded-2xl font-black shadow-xl active:scale-[0.98] transition-all hover:bg-black hover:shadow-2xl flex items-center justify-center gap-2">
              Связаться с братом / сестрой <ExternalLink size={16} className="opacity-50" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`https://wa.me/${member.whatsapp}`, '_blank');
                  }
                }}
                className="flex items-center justify-center gap-2.5 py-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-black shadow-none active:scale-[0.95] transition-all hover:bg-[#25D366]/20 border border-[#25D366]/20"
              >
                <Phone size={18} /> WhatsApp
              </button>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`https://t.me/${member.telegram?.replace('@', '')}`, '_blank');
                  }
                }}
                className="flex items-center justify-center gap-2.5 py-4 bg-[#0088cc]/10 text-[#0088cc] rounded-2xl font-black shadow-none active:scale-[0.95] transition-all hover:bg-[#0088cc]/20 border border-[#0088cc]/20"
              >
                <MessageCircle size={18} /> Telegram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
