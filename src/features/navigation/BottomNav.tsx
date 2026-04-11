import { Map as MapIcon, Search, Globe, Plus, Mic, Send, Square, Trash2, Play, Pause, Scale, ShieldCheck, Briefcase, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from '@/types/diaspora';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  logic: any;
}

const QUICK_EXPERTS = [
  { id: 'isLegalDefender', label: 'Адвокат', icon: <Scale size={18} /> },
  { id: 'juriste', label: 'Юрист', icon: <ShieldCheck size={18} /> },
  { id: 'isTranslator', label: 'Переводчик', icon: <Globe size={18} /> },
  { id: 'isSocialHelper', label: 'Соц. помощь', icon: <MessageSquare size={18} /> },
  { id: 'isBusiness', label: 'Бизнес', icon: <Briefcase size={18} /> },
];

export function BottomNav({ activeTab, setActiveTab, logic }: BottomNavProps) {
  const { 
    ticketDraft, setTicketDraft, submitTicket, 
    isListening, interimTranscript, finalTranscript,
    isRecording, startRecording, stopRecording, audioUrl, resetAudio,
    setSelectedExpertType, isSearchFocused, setIsSearchFocused
  } = logic;

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      setActiveTab('hub');
    }
  };

  const handleCategoryClick = (id: string) => {
    setSelectedExpertType(id);
    // Remove automatic hub switch to keep it as a popup first
    // setActiveTab('hub'); 
    setIsSearchFocused(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        
        {/* Expert Discovery Popup (Floating Overlay) */}
        <AnimatePresence>
          {logic.selectedExpertType && logic.filteredMembers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-4 glass-premium rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden max-h-[350px] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between shrink-0">
                <h3 className="text-[12px] font-black uppercase tracking-widest text-brand-blue">Доступные эксперты</h3>
                <button 
                  onClick={() => logic.setSelectedExpertType(null)}
                  className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {logic.filteredMembers.map((m: any) => (
                  <div key={m.id} className="p-4 bg-white/60 rounded-3xl border border-white/40 flex items-center justify-between shadow-sm hover:bg-white transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center font-black text-xs">
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
                      className="w-10 h-10 bg-success text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-md"
                    >
                      <MessageSquare size={18} />
                    </a>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-brand-blue/5 text-center">
                <button 
                  onClick={() => {
                    logic.setSelectedExpertType(null);
                    setActiveTab('hub');
                  }}
                  className="text-[10px] font-black uppercase tracking-tight text-brand-blue"
                >
                  Посмотреть всех в центре Бёлхи →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Expertise Bubbles */}
        <AnimatePresence>
          {isSearchFocused && !isRecording && !audioUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 flex flex-wrap gap-2 justify-center"
            >
              {QUICK_EXPERTS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="px-4 py-3 glass-premium rounded-full flex items-center gap-2 shadow-xl border border-white/40 active:scale-95 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-[13px] font-black tracking-tight text-text-primary">{cat.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcription Preview (Floating above) */}
        <AnimatePresence>
          {(isRecording || interimTranscript || finalTranscript) && !audioUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 p-4 glass-premium rounded-3xl border border-black/5 shadow-xl max-h-32 overflow-y-auto"
            >
              <p className="text-[14px] font-bold text-text-primary leading-tight">
                {finalTranscript || interimTranscript || (isRecording ? 'Слушаю вас...' : '')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-premium rounded-full p-2 shadow-2xl border border-black/[0.05] flex items-center gap-2">
          
          {/* Main Action Toggle or Trash */}
          {audioUrl ? (
            <button 
              onClick={resetAudio}
              className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center tap-haptic"
            >
              <Trash2 size={20} />
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab(activeTab === 'map' ? 'hub' : 'map')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'hub' ? 'bg-brand-blue text-white' : 'bg-bg-secondary text-text-primary'
              }`}
            >
              {activeTab === 'map' ? <Search size={20} /> : <MapIcon size={20} />}
            </button>
          )}

          {/* Recording UI vs Input UI */}
          <div className="flex-1 flex items-center gap-2">
            {isRecording ? (
              <div className="flex-1 flex items-center px-4 gap-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[14px] font-black text-red-500 tabular-nums uppercase tracking-widest">Идет запись...</span>
              </div>
            ) : audioUrl ? (
              <div className="flex-1 flex items-center px-4 gap-3 bg-black/5 rounded-full py-2">
                 <audio src={audioUrl} controls className="h-8 flex-1" />
              </div>
            ) : (
              <input 
                type="text"
                value={ticketDraft.description}
                onChange={(e) => setTicketDraft({ ...ticketDraft, description: e.target.value })}
                onFocus={() => {
                  setIsSearchFocused(true);
                }}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Чем мы можем помочь?"
                className="flex-1 bg-transparent px-4 py-2 text-[15px] font-bold focus:outline-none placeholder:text-text-tertiary"
              />
            )}

            {/* Mic / Stop / Send Button */}
            {audioUrl || ticketDraft.description ? (
              <button 
                onClick={submitTicket}
                className="px-6 bg-red-500 text-white h-12 rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <span className="text-[11px] font-black uppercase tracking-widest">ОРЦА!</span>
                <Send size={16} />
              </button>
            ) : (
              <button 
                onClick={handleMicClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isRecording ? 'bg-red-500 text-white scale-110 shadow-red-200' : 'bg-brand-blue text-white'
                }`}
              >
                {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
