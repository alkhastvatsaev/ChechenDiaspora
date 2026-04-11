"use client";

import { X, Briefcase, Heart, GraduationCap, Gavel, ShieldCheck, MessageCircle, Send, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface MemberProfileProps {
  member: any;
  onClose: () => void;
  onVouch?: (id: string) => void;
}

export default function MemberProfile({ member, onClose, onVouch }: MemberProfileProps) {
  if (!member) return null;

  return (
    <div className="absolute inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content Sheet */}
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
        className="relative w-full max-w-lg bg-white rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] border-t border-black/[0.05]"
      >
        {/* Header Visual */}
        <div className="h-32 bg-bg-secondary relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
            <ShieldCheck size={160} className="text-text-primary" />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-11 h-11 bg-white shadow-lg rounded-full flex items-center justify-center z-50 tap-haptic"
          >
            <X size={22} className="text-text-primary" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-12 -mt-14 relative overflow-y-auto flex-1 scrollbar-hide">
          {/* Avatar Area */}
          <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-4xl font-black text-text-primary mb-6 border-8 border-white">
            {member.prenom?.[0]}{member.nom?.[0]}
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-text-primary leading-none">
              {member.prenom} {member.nom}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="px-4 py-1.5 bg-brand-blue text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-md">
                {member.profession || "УЧАСТНИК"}
              </span>
              <span className="px-4 py-1.5 bg-bg-secondary text-text-secondary text-[11px] font-black uppercase tracking-widest rounded-full border border-black/[0.03]">
                {member.teip || "СООБЩЕСТВО"}
              </span>
              {member.vouchCount > 0 && (
                <span className="px-4 py-1.5 bg-brand-amber/10 text-brand-amber text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <ShieldCheck size={12} fill="currentColor" /> {member.vouchCount} ПОДТВЕРЖДЕНИЙ
                </span>
              )}
            </div>

            {/* Specialized Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {member.isLegalDefender && (
                <div className="flex items-center gap-2 px-3 py-2 bg-danger/10 text-danger rounded-2xl border border-danger/10">
                  <Gavel size={14} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest">ЮРИДИЧЕСКАЯ ЗАЩИТА</span>
                </div>
              )}
              {member.openToMentorship && (
                <div className="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-2xl border border-success/10">
                  <GraduationCap size={14} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest">НАСТАВНИЧЕСТВО</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-bg-secondary p-5 rounded-[2rem] border border-black/[0.03] flex flex-col gap-1.5 shadow-sm">
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Родное селение</span>
                <span className="font-black text-[15px] text-text-primary uppercase tracking-tight">{member.village || "—"}</span>
             </div>
             <div className="bg-bg-secondary p-5 rounded-[2rem] border border-black/[0.03] flex flex-col gap-1.5 shadow-sm">
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Возраст</span>
                <span className="font-black text-[15px] text-text-primary uppercase tracking-tight">{member.age || "—"} лет</span>
             </div>
             <div className="bg-bg-secondary p-6 rounded-[2rem] border border-black/[0.03] flex flex-col gap-1.5 col-span-2 shadow-sm">
                <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Текущее местоположение</span>
                <span className="font-black text-[17px] text-text-primary uppercase tracking-tight">{member.ville}, {member.pays}</span>
             </div>

             {member.isBusiness && (
                <div className="col-span-2 bg-success/5 p-8 rounded-[2.5rem] border border-success/10 flex flex-col gap-4 shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-success text-white rounded-2xl flex items-center justify-center shadow-lg shadow-success/20">
                         <Briefcase size={22} />
                      </div>
                      <div>
                         <h4 className="text-text-primary font-black text-[15px] uppercase tracking-tight">Биизнес и Услуги</h4>
                         <p className="text-[12px] text-success font-bold uppercase tracking-widest">{member.businessName || 'Поддержка своих'}</p>
                      </div>
                   </div>
                   <p className="text-[13px] text-text-secondary font-medium leading-relaxed">
                      {member.businessDescription || 'Проверенный бизнес нашей общины. Ответственность и высокое качество исполнения.'}
                   </p>
                </div>
              )}
          </div>

          <div className="p-6 bg-brand-blue/5 rounded-[2.5rem] border border-brand-blue/10 mb-10 shadow-sm leading-relaxed">
            <h4 className="flex items-center gap-2 text-brand-blue font-black uppercase text-[11px] tracking-widest mb-3">
              <ShieldCheck size={16} /> 
              ПРИНЦИП ВЗАИМОПОМОЩИ
            </h4>
            <p className="text-[12px] text-text-secondary font-bold">
              Взаимопомощь строится на принципах благородства и чести. Помощь соплеменникам оказывается <strong>добровольно</strong>. Ваша репутация — наше общее достояние.
            </p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-5 bg-text-primary text-white rounded-[2rem] font-black text-[15px] uppercase tracking-widest shadow-2xl tap-haptic flex items-center justify-center gap-3">
              СВЯЗАТЬСЯ <MessageCircle size={20} />
            </button>
            <button 
              onClick={() => onVouch?.(member.id)}
              className="w-full py-5 bg-brand-amber/10 text-brand-amber border border-brand-amber/20 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.15em] tap-haptic flex items-center justify-center gap-3"
            >
              ПОРУЧИТЬСЯ ЗА ЧЕЛОВЕКА <ShieldCheck size={20} />
            </button>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button 
                onClick={() => member.whatsapp && window.open(`https://wa.me/${member.whatsapp}`, '_blank')}
                className="flex items-center justify-center gap-3 py-5 bg-[#25D366]/5 text-[#25D366] rounded-[1.5rem] font-black text-[11px] tracking-widest border border-[#25D366]/10 tap-haptic"
              >
                ВАТСАП <MessageCircle size={18} />
              </button>
              <button 
                onClick={() => member.telegram && window.open(`https://t.me/${member.telegram?.replace('@', '')}`, '_blank')}
                className="flex items-center justify-center gap-3 py-5 bg-[#0088cc]/5 text-[#0088cc] rounded-[1.5rem] font-black text-[11px] tracking-widest border border-[#0088cc]/10 tap-haptic"
              >
                ТЕЛЕГРАМ <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
