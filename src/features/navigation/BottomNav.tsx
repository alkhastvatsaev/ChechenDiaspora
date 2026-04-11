import { Map as MapIcon, Search, Globe, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActiveTab } from '@/types/diaspora';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onAddClick: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onAddClick }: BottomNavProps) {
  const tabs = [
    { id: 'map', label: 'КАРТА', icon: <MapIcon size={20} />, color: 'brand-blue' },
    { id: 'hub', label: 'СОБРАНИЕ', icon: <Search size={20} />, color: 'brand-blue' },
    { id: 'council', label: 'СОВЕТ', icon: <Globe size={20} />, color: 'brand-blue' },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] px-6 pb-[calc(env(safe-area-inset-bottom)+12px)] pointer-events-none">
      <div className="max-w-md mx-auto flex items-center gap-3 pointer-events-auto">
        
        {/* Main Navigation Pill */}
        <div className="flex-1 glass-premium rounded-full p-2 flex items-center justify-between shadow-2xl shadow-black/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 group ${
                activeTab === tab.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-text-tertiary'
              }`}
            >
              <div className="relative z-10">{tab.icon}</div>
              {activeTab === tab.id && (
                <motion.span 
                  layoutId="nav-text"
                  className="text-[13px] font-black tracking-tighter uppercase relative z-10"
                >
                  {tab.label}
                </motion.span>
              )}
              {activeTab !== tab.id && (
                <div className="absolute inset-0 rounded-full group-active:bg-black/5 transition-colors" />
              )}
            </button>
          ))}
        </div>

        {/* Primary Action Button (Magic Plus) */}
        <button 
          onClick={onAddClick}
          className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-2xl shadow-brand-blue/30 tap-haptic"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
