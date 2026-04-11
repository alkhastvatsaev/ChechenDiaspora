"use client";

import { useEffect, useState } from 'react';
import { useDiasporaLogic } from '@/hooks/use-diaspora-logic';
import { MapView } from '@/features/map/MapView';
import { HubPanel } from '@/features/hub/HubPanel';
import { BottomNav } from '@/features/navigation/BottomNav';
import { ModalRegistry } from '@/features/modals/ModalRegistry';
import MemberProfile from '@/components/MemberProfile';
import StoryOverlay from '@/components/StoryOverlay';
import Manifesto from '@/components/Manifesto';
import { Search, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppShell() {
  const logic = useDiasporaLogic();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const {
    activeTab, setActiveTab, activeModal, setActiveModal,
    searchQuery, setSearchQuery, selectedTeip, setSelectedTeip,
    selectedVillage, setSelectedVillage, 
    filteredMembers, selectedMember, setSelectedMember,
    selectedStoryMember, setSelectedStoryMember,
    handleVouch
  } = logic;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-bg-primary text-text-primary">
      
      {/* Background Layer (Map) */}
      <div className={`absolute inset-0 transition-all duration-700 ${activeTab !== 'map' ? 'scale-105 blur-md opacity-40' : 'scale-100'}`}>
        <MapView 
          members={filteredMembers} 
          onMemberClick={setSelectedMember}
        />
      </div>

      {/* Header (Premium Minimalist) */}
      <div className="absolute top-0 inset-x-0 z-[60] px-6 pt-safe pb-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-black tracking-tighter text-text-primary uppercase">Вайнах</h1>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
           <button 
            onClick={() => {
              setActiveTab('hub');
              logic.setIsSearchFocused(true);
            }}
            className="w-11 h-11 glass-premium rounded-full flex items-center justify-center tap-haptic"
          >
            <Search size={20} className="text-text-primary" />
          </button>
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 bg-warning/10 text-warning text-[10px] font-black uppercase tracking-widest rounded-full border border-warning/20 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
              ВНЕ СЕТИ
            </motion.div>
          )}
          <button className="w-11 h-11 glass-premium rounded-full flex items-center justify-center tap-haptic overflow-hidden">
             <div className="w-full h-full bg-gradient-to-br from-brand-blue to-success opacity-10"></div>
             <Info size={20} className="text-text-primary absolute" />
          </button>
        </div>
      </div>

      {/* Primary Interaction Layers */}
      <HubPanel 
        isVisible={activeTab === 'hub'}
        onClose={() => setActiveTab('map')}
        logic={logic}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMembers={filteredMembers}
        onMemberClick={setSelectedMember}
        selectedTeip={selectedTeip}
        setSelectedTeip={setSelectedTeip}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
      />

      {/* Council/Manifesto Layer */}
      <AnimatePresence>
        {activeTab === 'council' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] overflow-y-auto px-6 py-safe pb-40 bg-white/20 backdrop-blur-[2px]"
          >
            {/* The requested House of Light Gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.8)_40%,transparent_100%)]"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto pt-12">
              <Manifesto />
            </div>
            
            <button 
              onClick={() => setActiveTab('map')}
              className="fixed top-safe right-6 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-text-primary tap-haptic border border-black/5 z-[100] mt-4"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setActiveModal('addMember')}
      />

      {/* Modal Systems */}
      <ModalRegistry 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />

      {/* Overlays */}
      <AnimatePresence>
        {selectedMember && (
          <MemberProfile 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)}
            onVouch={() => handleVouch(selectedMember.id)}
          />
        )}
        {selectedStoryMember && (
          <StoryOverlay 
            member={selectedStoryMember} 
            onClose={() => setSelectedStoryMember(null)}
            onOpenProfile={() => {
              setSelectedMember(selectedStoryMember);
              setSelectedStoryMember(null);
            }}
          />
        )}
      </AnimatePresence>

    </main>
  );
}
