"use client";

import { X, MapPin, Briefcase, Calendar, Home, Shield, Phone, MessageCircle, ExternalLink, Heart, GraduationCap, Gavel, Truck, Map as MapIcon, ShieldCheck, ShieldAlert } from 'lucide-react';

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
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-3xl rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] overflow-hidden animate-slide-up border border-white/40 max-h-[94dvh] flex flex-col">
        {/* Native Drag Handle */}
        <div className="absolute top-3 left-0 right-0 z-50">
           <div className="w-10 h-1 bg-black/10 rounded-full mx-auto" />
        </div>

        {/* Header Image/Pattern Area */}
        <div className="h-28 bg-kherch-dark relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <ShieldCheck size={120} className="text-white" />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 flex items-center justify-center z-50 tap-effect"
            aria-label="Закрыть"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="px-6 pb-12 pb-safe-bottom -mt-12 relative overflow-y-auto flex-1 scrollbar-hide overscroll-contain">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-black text-kherch-dark mb-4 border-4 border-white transform">
            {member.prenom?.[0]}{member.nom?.[0]}
          </div>

          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-kherch-dark">
              {member.prenom} {member.nom}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-chechen-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                БЁЛХИ / {member.profession}
              </span>
              <span className="px-3 py-1 bg-white border border-black/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                {member.teip}
              </span>
            </div>

            {/* Strategic High-Leverage Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {member.isLegalDefender && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/10">
                  <Gavel size={12} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-widest">ЮРИСТ</span>
                </div>
              )}
              {member.openToMentorship && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/10">
                  <GraduationCap size={12} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-widest">МЕНТОР</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-white p-4 rounded-3xl border border-black/5 flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Родное село</span>
                <span className="font-bold text-kherch-dark">{member.village}</span>
             </div>
             <div className="bg-white p-4 rounded-3xl border border-black/5 flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Возраст</span>
                <span className="font-bold text-kherch-dark">{member.age} лет</span>
             </div>
             <div className="bg-white p-4 rounded-3xl border border-black/5 flex flex-col gap-1 col-span-2">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Текущий город</span>
                <span className="font-bold text-kherch-dark">{member.ville}, {member.pays}</span>
             </div>
          </div>

          <div className="p-5 bg-chechen-blue/5 rounded-3xl border border-chechen-blue/10 mb-8">
            <h4 className="flex items-center gap-2 text-chechen-blue font-black uppercase text-[10px] tracking-widest mb-2">
              <Heart size={14} /> 
              ОСНОВА — НОХЧАЛЛА
            </h4>
            <p className="text-[11px] text-kherch-dark/70 font-medium leading-relaxed">
              Взаимопомощь строится на чеченских адатах. Помощь оказывается <strong>бесплатно</strong>. Доверие — наш главный актив.
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-5 bg-kherch-dark text-white rounded-[1.5rem] font-black text-sm shadow-xl tap-effect flex items-center justify-center gap-3">
              СВЯЗАТЬСЯ <MessageCircle size={18} />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => member.whatsapp && window.open(`https://wa.me/${member.whatsapp}`, '_blank')}
                className="flex items-center justify-center gap-2 py-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-black text-xs tap-effect border border-[#25D366]/10"
                aria-label="Написать в WhatsApp"
              >
                WHATSAPP
              </button>
              <button 
                onClick={() => member.telegram && window.open(`https://t.me/${member.telegram?.replace('@', '')}`, '_blank')}
                className="flex items-center justify-center gap-2 py-4 bg-[#0088cc]/10 text-[#0088cc] rounded-2xl font-black text-xs tap-effect border border-[#0088cc]/10"
                aria-label="Написать в Telegram"
              >
                TELEGRAM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
