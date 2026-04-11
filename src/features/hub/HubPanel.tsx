import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShieldCheck, Globe, Mic, Send, MessageSquare, Briefcase, Home, Scale, HelpingHand, Trash2 } from 'lucide-react';
import { Member } from '@/types/diaspora';
import WisdomCard from '@/components/WisdomCard';

interface HubPanelProps {
  isVisible: boolean;
  onClose: () => void;
  logic: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filteredMembers: Member[];
  onMemberClick: (m: Member) => void;
  selectedTeip?: any;
  setSelectedTeip?: any;
  selectedVillage?: any;
  setSelectedVillage?: any;
  [key: string]: any;
}

const CATEGORY_ICONS: Record<string, any> = {
  'work': <Briefcase size={16} />,
  'housing': <Home size={16} />,
  'administrative': <Scale size={16} />,
  'other': <MessageSquare size={16} />
};

const RUSSIAN_CATEGORIES: Record<string, string> = {
  'work': 'Работа',
  'housing': 'Жилье',
  'administrative': 'Админ. вопросы',
  'other': 'Общее'
};

export function HubPanel({ 
  isVisible, onClose, logic, searchQuery, setSearchQuery, 
  filteredMembers, onMemberClick
}: HubPanelProps) {
  const { ticketDraft, setTicketDraft, submitTicket, isListening, setIsListening, finalTranscript } = logic;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+60px)] z-[80] glass-premium rounded-t-hero shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Вайнехан Бёлхи</h1>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mt-1">Традиция взаимопомощи • Diaspora Belkhi</p>
            </div>
            <button 
              onClick={onClose}
              className="w-11 h-11 bg-bg-secondary rounded-full flex items-center justify-center border border-black/[0.05] tap-haptic"
            >
              <X size={22} className="text-text-primary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-[calc(env(safe-area-inset-bottom)+180px)] space-y-8 scrollbar-hide">
            
            {/* Wisdom / Manifesto Context */}
            <div className="pt-4">
              <WisdomCard />
            </div>

            {/* Active Help Requests (Tickets) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-text-primary">Активное ОРЦА (Призывы о помощи)</h3>
                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black animate-pulse">ОТКРЫТО</span>
              </div>

              {/* Expert Discovery Results */}
              {logic.selectedExpertType && filteredMembers.length > 0 && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-blue">Наденные эксперты</h3>
                    <button 
                      onClick={() => logic.setSelectedExpertType(null)}
                      className="text-[10px] font-bold text-text-tertiary uppercase hover:text-danger flex items-center gap-1"
                    >
                      <X size={10} /> Сбросить
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredMembers.map(m => (
                      <div key={m.id} className="p-4 bg-white rounded-3xl border border-black/[0.03] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center font-black text-brand-blue border border-black/[0.03]">
                            {m.prenom[0]}
                          </div>
                          <div>
                            <div className="text-sm font-black text-text-primary">{m.prenom} {m.nom}</div>
                            <div className="text-[10px] font-bold text-text-tertiary">{m.profession}</div>
                          </div>
                        </div>
                        <a 
                          href={`https://wa.me/${m.phone || '33600000000'}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center active:scale-95 transition-all"
                        >
                          <MessageSquare size={18} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {logic.publishedTickets?.length > 0 ? (
                  logic.publishedTickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-5 card-premium hover:scale-[1.01] transition-transform space-y-3 border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                            {CATEGORY_ICONS[ticket.category] || <HelpingHand size={16} />}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-red-500">
                            ОРЦА: {RUSSIAN_CATEGORIES[ticket.category] || 'Помощь'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-text-tertiary">{ticket.ville}</span>
                      </div>
                      <p className="text-[15px] font-bold text-text-primary leading-snug">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-black/[0.03]">
                        <span className="text-[10px] font-bold text-text-tertiary italic">от {ticket.authorName}</span>
                        <div className="flex items-center gap-2">
                          {logic.user?.uid === ticket.authorId && (
                            <button 
                              onClick={() => logic.deleteTicket(ticket.id)}
                              className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95 transition-all flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Удалить
                            </button>
                          )}
                          <button className="px-4 py-2 bg-brand-blue text-white rounded-xl text-[11px] font-black uppercase tracking-tight shadow-md active:scale-95 transition-all">Прийти на помощь →</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center bg-white/50 rounded-3xl border-2 border-dashed border-black/[0.05]">
                    <p className="text-[14px] font-bold text-text-primary leading-relaxed">
                      Призывов о помощи пока нет.<br/>
                      <span className="text-[11px] text-text-tertiary font-medium">Это время для спокойствия, но помните: Бёлхи — это сердце нашего народа.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Specialist / Experts Hub */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-text-primary px-1">Специалисты (Готовы помочь)</h3>
              <div className="grid grid-cols-1 gap-4">
                {filteredMembers.filter(m => m.tag === 'expert' || m.hasActiveTicket).map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => onMemberClick(m)}
                    className="flex items-center gap-4 p-5 card-premium text-left group transition-all"
                  >
                    <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue relative shrink-0">
                      <span className="text-xl font-black">{m.prenom[0]}</span>
                      {m.hasActiveTicket && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[17px] font-black text-text-primary leading-tight flex items-center gap-2">
                        {m.prenom} {m.nom}
                        <ShieldCheck size={14} className="text-brand-blue opacity-40" />
                      </h4>
                      <span className="text-[12px] font-bold text-brand-blue/70 block mt-0.5">{m.profession}</span>
                      <div className="flex items-center gap-2 mt-2 opacity-60">
                         <Globe size={10} />
                         <span className="text-[10px] font-bold uppercase tracking-wider">{m.ville}, {m.pays}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
