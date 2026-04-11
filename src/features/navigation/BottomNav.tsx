import { Map as MapIcon, Search, Globe, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActiveTab } from '@/types/diaspora';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  logic: any;
}

export function BottomNav({ activeTab, setActiveTab, logic }: BottomNavProps) {
  const { ticketDraft, setTicketDraft, submitTicket, isListening, setIsListening, finalTranscript } = logic;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] px-6 pb-[calc(env(safe-area-inset-bottom)+160px)] pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="glass-premium rounded-full p-2 shadow-2xl border border-black/[0.05] flex items-center gap-2">
          {/* View Toggle (Subtle) */}
          <button 
            onClick={() => setActiveTab(activeTab === 'map' ? 'hub' : 'map')}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'hub' ? 'bg-brand-blue text-white' : 'bg-bg-secondary text-text-primary'
            }`}
          >
            {activeTab === 'map' ? <Search size={20} /> : <MapIcon size={20} />}
          </button>

          {/* Smart Input */}
          <div className="flex-1 flex items-center gap-2">
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-text-tertiary hover:bg-black/5'
              }`}
            >
              <Mic size={18} />
            </button>
            
            <input 
              type="text"
              value={finalTranscript || ticketDraft.description}
              onChange={(e) => setTicketDraft({ ...ticketDraft, description: e.target.value })}
              onFocus={() => activeTab !== 'hub' && setActiveTab('hub')}
              placeholder={isListening ? 'Слушаю...' : 'Чем помочь?'}
              className="flex-1 bg-transparent px-2 py-2 text-[15px] font-bold focus:outline-none placeholder:text-text-tertiary"
            />

            <button 
              onClick={submitTicket}
              disabled={!ticketDraft.description && !finalTranscript}
              className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
