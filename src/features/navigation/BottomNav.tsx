import { Map as MapIcon, Search, Globe, Plus, Mic, Send, Square, Trash2, Play, Pause, Scale, ShieldCheck, Briefcase, MessageSquare } from 'lucide-react';
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
    setActiveTab('hub');
    setIsSearchFocused(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        
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
