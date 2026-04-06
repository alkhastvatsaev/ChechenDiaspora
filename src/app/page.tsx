"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UserPlus, Search, Menu, Target, Info, Heart, ShieldCheck, X, Filter, Globe, BookOpen, Users, Briefcase, MapPin } from 'lucide-react';
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
  const [selectedProfession, setSelectedProfession] = useState('');
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
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(val => val.length > 0);
      
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => 
        fullName.includes(term) || 
        m.village?.toLowerCase().includes(term) ||
        m.teip?.toLowerCase().includes(term) ||
        m.ville?.toLowerCase().includes(term) ||
        m.profession?.toLowerCase().includes(term)
      );
      
      const matchesTeip = selectedTeip ? m.teip === selectedTeip : true;
      const matchesProfession = selectedProfession ? m.profession === selectedProfession : true;
      
      return matchesSearch && matchesTeip && matchesProfession;
    });
  }, [members, searchQuery, selectedTeip, selectedProfession]);

  // Derived Filters
  const teips = useMemo(() => {
    const set = new Set(members.map(m => m.teip).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const professions = useMemo(() => {
    const set = new Set(members.map(m => m.profession).filter(Boolean));
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
              className={`p-2 hover:bg-black/5 rounded-full transition-colors ${showHeatmap ? 'bg-chechen-blue/10 text-chechen-blue' : 'text-gray-800'}`}
              onClick={() => setShowHeatmap(!showHeatmap)}
              title={showHeatmap ? "Показать участников" : "Показать плотность"}
            >
              <Globe size={24} />
            </button>

            <button 
              className={`p-2 hover:bg-black/5 rounded-full transition-colors ${showFilters ? 'bg-chechen-blue/10 text-chechen-blue' : 'text-gray-800'}`}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${!selectedTeip ? 'bg-chechen-blue text-white border-chechen-blue shadow-md' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
              >
                Все тайпы
              </button>
              {teips.map(teip => (
                <button 
                  key={teip}
                  onClick={() => setSelectedTeip(teip === selectedTeip ? '' : teip)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedTeip === teip ? 'bg-chechen-blue text-white border-chechen-blue shadow-md' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
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
          className="bg-chechen-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
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
          <div className="bg-chechen-blue/10 p-3 rounded-full">
            <BookOpen size={20} className="text-chechen-blue" />
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

      {/* Directory Sidebar */}
      <div 
        className={`absolute top-0 left-0 w-full md:w-[28rem] h-full bg-white/95 backdrop-blur-xl shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 pb-2 pt-safe-top flex-shrink-0 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">Каталог Диаспоры</h2>
              <p className="text-sm text-gray-500 font-medium">Контактная база ({members.length})</p>
            </div>
            <button 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
          
          {/* Search inside sidebar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Поиск специалиста, города..."
              className="w-full bg-gray-100 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-chechen-blue/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Profession Filters (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            <button 
              onClick={() => setSelectedProfession('')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${!selectedProfession ? 'bg-chechen-blue text-white shadow-md border-chechen-blue' : 'bg-white text-gray-500 border-gray-200 hover:border-chechen-blue/50 hover:bg-gray-50'}`}
            >
              Все Специалисты
            </button>
            {professions.map(prof => (
              <button 
                key={prof as string}
                onClick={() => setSelectedProfession(prof === selectedProfession ? '' : (prof as string))}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedProfession === prof ? 'bg-chechen-blue text-white shadow-md border-chechen-blue' : 'bg-white text-gray-500 border-gray-200 hover:border-chechen-blue/50 hover:bg-gray-50'}`}
              >
                {prof as string}
              </button>
            ))}
          </div>
        </div>

        {/* Member List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-chechen-blue/30 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-chechen-blue/10 rounded-full flex items-center justify-center text-lg font-black text-chechen-blue flex-shrink-0 group-hover:scale-110 transition-transform">
                  {member.prenom?.[0]}{member.nom?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate text-base">{member.prenom} {member.nom}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-chechen-blue font-semibold text-xs">
                    <Briefcase size={12} className="opacity-70" />
                    <span className="truncate">{member.profession || 'Участник'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-xs font-medium">
                    <MapPin size={12} className="opacity-70" />
                    <span className="truncate">{member.ville || 'N/A'}, {member.pays}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Никто не найден.</p>
            </div>
          )}
        </div>

        {/* ActionFooter */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-between gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10 flex-shrink-0">
           <Link href="/heritage" className="flex-1 flex justify-center py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-transparent hover:border-gray-200">
             <BookOpen size={18} className="text-chechen-blue/80" /> Наследие
           </Link>
           <Link href="/join" className="flex-1 flex justify-center py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-transparent hover:border-gray-200">
             <UserPlus size={18} className="text-gray-500" /> Вступить
           </Link>
           <button className="flex-1 flex justify-center py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-transparent hover:border-gray-200">
             <Heart size={18} className="text-chechen-blue/80" /> СагIа
           </button>
        </div>
      </div>
    </main>
  );
}
