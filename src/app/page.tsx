"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UserPlus, Search, Menu, Target, Info, Heart, ShieldCheck, X, Filter, Globe, BookOpen } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import MemberProfile from '@/components/MemberProfile';
import LanguageModal from '@/components/LanguageModal';

// Use dynamic import for Leaflet Map as it needs 'window' (client-side only)
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-apple-light animate-pulse flex items-center justify-center font-bold text-gray-400">Загрузка карты...</div>
});

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeip, setSelectedTeip] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Listen to members in Realtime Database
  useEffect(() => {
    const membersRef = ref(db, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const membersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Filter for approved: true
        setMembers(membersList.filter(m => m.approved === true));
      } else {
        setMembers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos: [number, number] = [latitude, longitude];
          setUserLocation(pos);
          setMapCenter(pos);
        },
        () => {
          const pos: [number, number] = [43.318, 45.694];
          setUserLocation(pos);
          setMapCenter(pos);
        }
      );
    } else {
      const pos: [number, number] = [43.318, 45.694];
      setUserLocation(pos);
      setMapCenter(pos);
    }
  }, []);

  // Filter Logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                           m.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.teip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.profession?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTeip = selectedTeip ? m.teip === selectedTeip : true;
      
      return matchesSearch && matchesTeip;
    });
  }, [members, searchQuery, selectedTeip]);

  // Derived Filters
  const teips = useMemo(() => {
    const set = new Set(members.map(m => m.teip).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const centerOnMe = () => {
    if (userLocation) {
      setMapCenter([...userLocation]);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-apple-light text-apple-dark font-sans">
      
      {/* Background Map layer */}
      <Map 
        members={filteredMembers} 
        center={mapCenter} 
        onMemberClick={(m) => setSelectedMember(m)}
        showHeatmap={showHeatmap}
      />

      {/* Top Glassmorphism Header & Search */}
      <div className="absolute top-0 w-full z-10 px-4 pt-safe-top">
        <header className="mt-4 mx-auto max-w-2xl space-y-3">
          <div className="bg-white/70 backdrop-blur-md shadow-sm border border-black/5 rounded-2xl flex items-center justify-between px-4 py-3">
            <button 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} className="text-gray-800" />
            </button>
            
            <div className="flex-1 px-4 flex items-center gap-2">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Поиск по имени, селу или тайпу..."
                className="w-full bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-black/5 rounded-full">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>

            <button 
              className={`p-2 hover:bg-black/5 rounded-full transition-colors ${showHeatmap ? 'bg-chechen-green/10 text-chechen-green' : 'text-gray-800'}`}
              onClick={() => setShowHeatmap(!showHeatmap)}
              title={showHeatmap ? "Показать участников" : "Показать плотность"}
            >
              <Globe size={24} />
            </button>

            <button 
              className={`p-2 hover:bg-black/5 rounded-full transition-colors ${showFilters ? 'bg-chechen-green/10 text-chechen-green' : 'text-gray-800'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={24} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-md shadow-lg border border-black/5 rounded-2xl p-4 animate-scale-in flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedTeip('')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${!selectedTeip ? 'bg-chechen-green text-white border-chechen-green shadow-md' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
              >
                Все тайпы
              </button>
              {teips.map(teip => (
                <button 
                  key={teip}
                  onClick={() => setSelectedTeip(teip === selectedTeip ? '' : teip)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedTeip === teip ? 'bg-chechen-green text-white border-chechen-green shadow-md' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                >
                  {teip}
                </button>
              ))}
            </div>
          )}
        </header>
      </div>

      {/* Action Buttons Container */}
      <div className="absolute bottom-8 right-6 z-10 pb-safe-bottom flex flex-col gap-3">
        <button 
          onClick={centerOnMe}
          className="bg-white text-gray-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center border border-black/5"
        >
          <Target size={28} />
        </button>

        <Link 
          href="/join"
          className="bg-chechen-green text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <UserPlus size={28} />
        </Link>
      </div>

      {/* Language Learning Action Button - Prominently on Bottom Left */}
      <div className="absolute bottom-8 left-6 z-10 pb-safe-bottom flex flex-col gap-3">
        <button 
          onClick={() => setIsLanguageModalOpen(true)}
          className="bg-white/90 backdrop-blur-md text-apple-dark p-3 pr-5 rounded-[2rem] shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-black/5"
        >
          <div className="bg-chechen-green/10 p-3 rounded-full">
            <BookOpen size={20} className="text-chechen-green" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Изучение</p>
            <p className="text-sm font-bold tracking-tight">Чеченский Язык</p>
          </div>
        </button>
      </div>

      {/* Profile Modal */}
      {selectedMember && (
        <MemberProfile 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}

      {/* Language Modal */}
      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />

      {/* Sidebar */}
      <div 
        className={`absolute top-0 left-0 w-full md:w-80 h-full bg-white/95 backdrop-blur-xl shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 pt-safe-top h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Библиотека</h2>
            <button 
              className="p-2 hover:bg-black/5 rounded-full"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2">
            <div className="bg-chechen-green/5 p-4 rounded-2xl border border-chechen-green/10 mb-4">
              <p className="text-xs font-bold text-chechen-green uppercase tracking-widest mb-1 opacity-60">Статистика</p>
              <p className="text-2xl font-black text-chechen-green">{members.length} <span className="text-sm font-bold opacity-60">участников</span></p>
            </div>

            <Link 
              href="/heritage" 
              className="flex items-center gap-3 text-left py-3.5 px-4 rounded-xl hover:bg-black/5 font-bold text-gray-700 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <BookOpen size={20} className="text-chechen-green/80" /> Нохчалла (Наследие)
            </Link>
            <Link 
              href="/join" 
              className="flex items-center gap-3 text-left py-3.5 px-4 rounded-xl hover:bg-black/5 font-bold text-gray-700 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <UserPlus size={20} className="text-gray-400" /> Присоединиться
            </Link>
            <button className="flex items-center gap-3 text-left py-3.5 px-4 rounded-xl hover:bg-black/5 font-bold text-chechen-green transition-colors">
              <Heart size={20} className="text-chechen-green/60" /> Пожертвования (СагIа)
            </button>

            <div className="mt-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Топ локации</p>
              <div className="space-y-1">
                {/* Dynamically derived most common cities could go here */}
                {Array.from(new Set(members.map(m => m.ville))).slice(0, 5).map(city => (
                  <div key={city} className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50/50 text-xs font-bold">
                    <span className="text-gray-600 truncate">{city}</span>
                    <span className="text-chechen-green bg-white px-2 py-0.5 rounded-md shadow-sm">{members.filter(m => m.ville === city).length}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <Link 
                href="/admin" 
                className="flex items-center gap-3 text-left py-3 px-4 rounded-xl hover:bg-black/5 font-medium text-gray-400 text-xs"
                onClick={() => setIsSidebarOpen(false)}
              >
                <ShieldCheck size={18} /> Панель администратора
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
