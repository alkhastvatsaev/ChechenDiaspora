import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShieldCheck, Globe, Mic, Send, MessageSquare, Briefcase, Home, Scale, HelpingHand } from 'lucide-react';
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
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Взаимопомощь</h1>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mt-1">Дом Вайнахской Солидарности</p>
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
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-text-primary">Нужна помощь (Активные заявки)</h3>
                <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black animate-pulse">LIVE</span>
              </div>
              
              <div className="space-y-3">
                {logic.publishedTickets?.length > 0 ? (
                  logic.publishedTickets.map((ticket: any) => (
                    <div key={ticket.id} className="p-5 card-premium hover:scale-[1.01] transition-transform space-y-3 border-l-4 border-brand-blue">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue">
                            {CATEGORY_ICONS[ticket.category] || <HelpingHand size={16} />}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-brand-blue">
                            {RUSSIAN_CATEGORIES[ticket.category] || 'Помощь'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-text-tertiary">{ticket.ville}</span>
                      </div>
                      <p className="text-[15px] font-bold text-text-primary leading-snug">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-black/[0.03]">
                        <span className="text-[10px] font-bold text-text-tertiary italic">от {ticket.authorName}</span>
                        <button className="text-[11px] font-black text-brand-blue uppercase tracking-tight">Помочь →</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white/50 rounded-3xl border-2 border-dashed border-black/[0.05]">
                    <MessageSquare className="mx-auto text-text-tertiary mb-3 opacity-20" size={32} />
                    <p className="text-[13px] font-bold text-text-tertiary leading-relaxed">
                      Активных заявок пока нет.<br/>Будьте первым, кому нужна помощь нашей общины.
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

          {/* Sticky Quick Help Bar */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white via-white to-white/0 pt-12">
            <div className="max-w-2xl mx-auto relative">
              <div className="glass-premium rounded-3xl p-2 shadow-2xl border border-black/[0.05] flex items-center gap-2">
                <button 
                  onClick={() => setIsListening(!isListening)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-bg-secondary text-text-primary'
                  }`}
                >
                  <Mic size={20} />
                </button>
                
                <input 
                  type="text"
                  value={finalTranscript || ticketDraft.description}
                  onChange={(e) => setTicketDraft({ ...ticketDraft, description: e.target.value })}
                  placeholder={isListening ? 'Слушаю вас...' : 'Как вам помочь? Напишите или скажите...'}
                  className="flex-1 bg-transparent px-3 py-3 text-[15px] font-bold focus:outline-none placeholder:text-text-tertiary"
                />

                <button 
                  onClick={submitTicket}
                  disabled={!ticketDraft.description && !finalTranscript}
                  className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-center text-[9px] font-bold text-text-tertiary uppercase tracking-widest mt-4">
                Ваша просьба будет видна всей диаспоре в этом регионе
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
