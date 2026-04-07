"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UserPlus, Search, Menu, Target, Info, Heart, ShieldCheck, X, Filter, Globe, BookOpen, Users, Briefcase, MapPin, Flame, ChevronLeft, Gavel, GraduationCap, Truck, ArrowRight, Languages, Sparkles, Plane, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import MemberProfile from '@/components/MemberProfile';
import LanguageModal from '@/components/LanguageModal';

// Use dynamic import for Leaflet Map as it needs 'window' (client-side only)
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-apple-light animate-pulse flex items-center justify-center font-bold text-gray-400">Загрузка карты...</div>
});

const sampleExperts = [
  { id: 'S1', prenom: "Aslan", nom: "Bazarov", profession: "Avocat / Droit d'Asile", isLegalDefender: true, ville: "Strasbourg", pays: "France", village: "Shali", teip: "Shaloy", lat: 48.5734, lng: 7.7521, isLive: true, approved: true, message: "Prêt à aider juridiquement mes frères." },
  { id: 'S2', prenom: "Zelim", nom: "Umarov", profession: "Ingénieur Software", ville: "Berlin", pays: "Allemagne", village: "Gekhi", teip: "Gekhoy", lat: 52.5200, lng: 13.4050, isLive: false, openToMentorship: true, approved: true, message: "Je peux coacher les jeunes vers l'IT." },
  { id: 'S3', prenom: "Amina", nom: "Isaeva", profession: "Traductrice assermentée", isTranslator: true, ville: "Vienne", pays: "Autriche", village: "Vedeno", teip: "Beltoy", lat: 48.2082, lng: 16.3738, isLive: true, approved: true, message: "Traduction Arabe/Allemand/Français." },
  { id: 'S4', prenom: "Beslan", nom: "Tsaro", profession: "Notaire", ville: "Nice", pays: "France", village: "Gudermes", teip: "Gordaloy", lat: 43.7102, lng: 7.2620, isLive: false, approved: true },
  { id: 'S5', prenom: "Mansour", nom: "Gakaev", profession: "Coach Sportif / MMA", ville: "Varsovie", pays: "Pologne", village: "Argun", teip: "Elistanzhoy", lat: 52.2297, lng: 21.0122, isLive: true, approved: true },
  { id: 'S6', prenom: "Raisa", nom: "Kadyrova", profession: "Médecin Généraliste", ville: "Lyon", pays: "France", village: "Grozny", teip: "Shaloy", lat: 45.7640, lng: 4.8357, isLive: false, approved: true },
  { id: 'S7', prenom: "Khamzat", nom: "Djabrailov", profession: "Politologue", ville: "Bruxelles", pays: "Belgique", village: "Urus-Martan", teip: "Chonkoy", lat: 50.8503, lng: 4.3517, isLive: true, approved: true },
  { id: 'S8', prenom: "Ismail", nom: "Naurbiev", profession: "Architecte", ville: "Munich", pays: "Allemagne", village: "Sernovodsk", teip: "Orstkhoy", lat: 48.1351, lng: 11.5820, isLive: false, approved: true },
  { id: 'S9', prenom: "Liana", nom: "Tutaeva", profession: "Designer Marketing", ville: "Paris", pays: "France", village: "Achkhoy-Martan", teip: "Tsetshoy", lat: 48.8566, lng: 2.3522, isLive: true, approved: true },
  { id: 'S10', prenom: "Adam", nom: "Khadjiev", profession: "Expert Cyber-Sécurité", ville: "Zurich", pays: "Suisse", village: "Bamut", teip: "Akkiy", lat: 47.3769, lng: 8.5417, isLive: true, approved: true }
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'amanat' | 'union-son' | 'union-daughter' | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeip, setSelectedTeip] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedExpertType, setSelectedExpertType] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Check if first visit in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('vainakh_seen_welcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vainakh_seen_welcome', 'true');
    }
  };

  const handleExpertFilter = (type: string) => {
    const nextType = selectedExpertType === type ? null : type;
    setSelectedExpertType(nextType);
    if (nextType) {
      setSearchQuery('');
      setIsSidebarOpen(true);
    }
  };

  // Listen to members in Realtime Database
  useEffect(() => {
    const membersRef = ref(db, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      const travelers = [
        { id: 'T1', prenom: "Mansour", nom: "Dadaev", isTraveling: true, travelFrom: "Bruxelles", travelTo: "Grozny", approved: true },
        { id: 'T2', prenom: "Liana", nom: "Isaeva", isTraveling: true, travelFrom: "Vienne", travelTo: "Grozny", approved: true }
      ];

      if (data) {
        const membersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMembers([...membersList.filter(m => m.approved !== false), ...travelers]);
      } else {
        setMembers([...sampleExperts, ...travelers]);
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
      if (selectedExpertType) {
        if (selectedExpertType === 'isLegalDefender' && !m.isLegalDefender) return false;
        if (selectedExpertType === 'isTranslator' && !m.isTranslator) return false;
        if (selectedExpertType === 'isGuide' && !m.isGuide) return false;
        if (selectedExpertType === 'openToMentorship' && !m.openToMentorship) return false;
      }

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
  }, [members, searchQuery, selectedTeip, selectedProfession, selectedExpertType]);

  // Derived Filters
  const teips = useMemo(() => {
    const set = new Set(members.map(m => m.teip).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const professions = useMemo(() => {
    const set = new Set(members.map(m => m.profession).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const liveCount = useMemo(() => {
    return members.filter(m => m.isLive).length + Math.floor(members.length * 0.1) + 3;
  }, [members]);

  const handleSuggestionSelect = (term: string, type?: string) => {
    if (type === 'expert') {
      setSelectedExpertType(term);
      setSearchQuery('');
    } else {
      setSearchQuery(term);
      setSelectedExpertType('');
    }
    setIsSearchFocused(false);
  };

  return (
    <main className="flex h-full flex-col bg-apple-light overflow-hidden">
      <div className="relative flex-1 flex overflow-hidden">
        {/* Map Layer */}
        <div className="absolute inset-0 z-0">
          <Map 
            members={filteredMembers} 
            center={mapCenter} 
            showHeatmap={showHeatmap}
            onMemberClick={setSelectedMember}
          />
        </div>

        {/* Omnibar & Search UI - Adjusted for Notch/Dynamic Island */}
        <div className="absolute top-0 left-0 right-0 z-40 p-4 sm:p-8 pt-safe pointer-events-none">
           <div className="max-w-2xl mx-auto space-y-3">
              <div className="relative pointer-events-auto">
                 <div className={`flex items-center bg-white/90 backdrop-blur-2xl rounded-3xl p-2.5 shadow-2xl border transition-all duration-500 ${isSearchFocused ? 'border-black/20 ring-4 ring-black/5 scale-[1.02]' : 'border-black/5 hover:border-black/10'}`}>
                    <button 
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="w-12 h-12 flex items-center justify-center text-kherch-dark hover:bg-black/5 rounded-2xl transition-colors"
                    >
                       <Menu size={20} />
                    </button>
                    
                    <div className="flex-1 flex items-center px-2">
                       <Search size={18} className="text-kherch-dark/30 mr-3" />
                       <input 
                         type="text" 
                         placeholder="Avocat, Strasbourg, Billtoy..."
                         className="w-full bg-transparent border-none outline-none text-sm font-bold text-kherch-dark placeholder:text-kherch-dark/20 h-10"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         onFocus={() => setIsSearchFocused(true)}
                       />
                    </div>

                    <div className="flex items-center gap-1 pr-1">
                       <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-vainakh-stone rounded-xl border border-black/5">
                          <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                          <span className="text-[10px] font-black text-kherch-dark tracking-widest">{liveCount} LIVE</span>
                       </div>
                    </div>
                 </div>

                 {/* Intelligent Suggestions Panel */}
                 <AnimatePresence>
                    {isSearchFocused && (
                       <motion.div 
                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
                         className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-3xl rounded-[2rem] border border-black/5 shadow-2xl p-6 overflow-hidden max-h-[70vh] overflow-y-auto"
                       >
                          <div className="flex justify-between items-center mb-6">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Suggestions intelligentes</h4>
                             <button onClick={() => setIsSearchFocused(false)} className="text-gray-400 hover:text-black transition-colors">
                                <X size={16} />
                             </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <section>
                                <div className="flex items-center gap-2 mb-4 text-kherch-dark/40">
                                   <Target size={14} />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Expertises prioritaires</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {[
                                      { label: 'Avocat', icon: <Gavel size={12}/>, type: 'isLegalDefender' },
                                      { label: 'Notaire', icon: <Briefcase size={12}/> },
                                      { label: 'Médecin', icon: <Heart size={12} className="text-rose-500"/> },
                                      { label: 'Traducteur', icon: <Languages size={12}/>, type: 'isTranslator' },
                                      { label: 'Mentor', icon: <GraduationCap size={12}/>, type: 'openToMentorship' }
                                   ].map((item) => (
                                      <button 
                                        key={item.label}
                                        onClick={() => handleSuggestionSelect(item.type || item.label, item.type ? 'expert' : undefined)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-vainakh-stone/50 hover:bg-vainakh-stone rounded-xl text-xs font-bold transition-all border border-black/5 hover:scale-105"
                                      >
                                         {item.icon} {item.label}
                                      </button>
                                   ))}
                                </div>
                             </section>

                             <section>
                                <div className="flex items-center gap-2 mb-4 text-kherch-dark/40">
                                   <Globe size={14} />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Villes actives</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {['Strasbourg', 'Paris', 'Vienne', 'Berlin', 'Grozny', 'Nice'].map(city => (
                                      <button 
                                        key={city}
                                        onClick={() => handleSuggestionSelect(city)}
                                        className="px-4 py-2.5 bg-white/50 hover:bg-white rounded-xl text-xs font-bold transition-all border border-black/5 hover:shadow-sm"
                                      >
                                         {city}
                                      </button>
                                   ))}
                                </div>
                             </section>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                   <Search size={10} /> {searchQuery || '...'}
                                </div>
                             </div>
                             <p className="text-[10px] text-gray-400 font-medium">Recherche parmi {members.length} membres</p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Quick Filters (Pills) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto">
                 <button 
                   onClick={() => handleExpertFilter('isLegalDefender')}
                   className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedExpertType === 'isLegalDefender' ? 'bg-kherch-dark text-white shadow-xl scale-105' : 'bg-white/80 text-kherch-dark/70 backdrop-blur-xl border border-black/5 shadow-sm'}`}
                 >
                    <Gavel size={14} /> Юристы
                 </button>
                 <button 
                   onClick={() => handleExpertFilter('isTranslator')}
                   className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedExpertType === 'isTranslator' ? 'bg-kherch-dark text-white shadow-xl scale-105' : 'bg-white/80 text-kherch-dark/70 backdrop-blur-xl border border-black/5 shadow-sm'}`}
                 >
                    <Languages size={14} /> Переводчики
                 </button>
                 <button 
                   onClick={() => handleExpertFilter('openToMentorship')}
                   className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedExpertType === 'openToMentorship' ? 'bg-kherch-dark text-white shadow-xl scale-105' : 'bg-white/80 text-kherch-dark/70 backdrop-blur-xl border border-black/5 shadow-sm'}`}
                 >
                    <GraduationCap size={14} /> Наставники
                 </button>
                 <button className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 text-kherch-dark/70 backdrop-blur-xl border border-black/5 shadow-sm text-[10px] font-black uppercase tracking-widest">
                    <Truck size={14} /> Логистика
                 </button>
              </div>
           </div>
        </div>

        {/* Sidebar Container - Full Dynamic Height */}
        <div className={`absolute top-0 left-0 bottom-0 z-50 w-full sm:w-[420px] bg-vainakh-stone/95 backdrop-blur-3xl shadow-2xl transform transition-all duration-700 ease-in-out border-r border-kherch-dark/5 flex flex-col pt-safe ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="p-8 pb-6 bg-vainakh-stone/50 border-b border-kherch-dark/5 flex-shrink-0">
             <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-kherch-dark tracking-tighter mb-1">Кхерч / Diaspora</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sovereign Network v1.0</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-12 h-12 bg-black/5 hover:bg-black/10 text-kherch-dark rounded-2xl flex items-center justify-center transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
             </div>

          <Link href="/join" className="group w-full bg-kherch-dark text-vainakh-stone rounded-[2rem] p-6 flex items-center justify-between shadow-xl hover:scale-[1.02] active:scale-95 transition-all mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={80} />
             </div>
             <div className="relative z-10">
                <h3 className="text-lg font-black tracking-tight mb-0.5">Вступить в общину</h3>
                <p className="text-[10px] font-bold text-vainakh-stone/60 uppercase tracking-widest">Rejoindre le Hub</p>
             </div>
             <ChevronLeft size={18} className="rotate-180 opacity-40 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          {/* Search inside sidebar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Поиск брата/сестры, тайпа..."
              className="w-full bg-white border border-black/5 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-gray-900/20 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mutual Aid Filters (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            <button 
              onClick={() => setSelectedProfession('')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${!selectedProfession ? 'bg-kherch-dark text-vainakh-stone shadow-md border-kherch-dark' : 'bg-white/80 text-kherch-dark/60 border-black/5 hover:border-kherch-dark/20 hover:bg-white'}`}
            >
              Вся община
            </button>
            {professions.map(prof => (
              <button 
                key={prof as string}
                onClick={() => setSelectedProfession(prof === selectedProfession ? '' : (prof as string))}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedProfession === prof ? 'bg-kherch-dark text-vainakh-stone shadow-md border-kherch-dark' : 'bg-white/80 text-kherch-dark/60 border-black/5 hover:border-kherch-dark/20 hover:bg-white'}`}
              >
                {prof as string}
              </button>
            ))}
          </div>
        </div>

        {/* AMANAT - VOYAGES & TRANSPORTS (ADAT) */}
        <div className="px-5 mb-6">
           <div className="bg-vainakh-stone/40 border border-kherch-dark/5 rounded-[2rem] p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-vainakh-stone">
                       <Plane size={18} className="rotate-45" />
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-kherch-dark tracking-tight uppercase">Аманат / Voyages</h4>
                       <p className="text-[9px] font-bold text-gray-400">Entraide Logistique</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setActiveModal('amanat')}
                  className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                 >
                   Я еду
                 </button>
              </div>

              {/* Active Travels Scroller */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                 {members.filter(m => m.isTraveling).length > 0 ? (
                    members.filter(m => m.isTraveling).map(m => (
                       <div key={m.id} className="flex-shrink-0 w-48 bg-white rounded-2xl p-3 border border-black/5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">
                                {m.prenom?.[0]}{m.nom?.[0]}
                             </div>
                             <span className="text-[10px] font-bold truncate">{m.prenom} {m.nom}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-kherch-dark/60">
                             <span className="truncate">{m.travelFrom || 'Europe'}</span>
                             <ArrowRight size={10} className="text-black" />
                             <span className="text-black">{m.travelTo || 'Grozny'}</span>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-2 font-medium italic">« Передам ваши вещи в целости »</p>
                       </div>
                    ))
                 ) : (
                    <p className="text-[10px] font-bold text-gray-400 italic py-2">Нет активных поездок на этой неделе...</p>
                 )}
              </div>
           </div>
        </div>

        {/* Member List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-sm border border-kherch-dark/5 hover:shadow-md hover:border-kherch-dark/20 transition-all cursor-pointer group flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-vainakh-stone rounded-2xl flex items-center justify-center text-lg font-black text-kherch-dark flex-shrink-0 group-hover:scale-105 transition-transform border border-kherch-dark/5">
                    {member.prenom?.[0]}{member.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-kherch-dark truncate text-base">{member.prenom} {member.nom}</h3>
                    <p className="text-kherch-dark/50 text-xs font-bold uppercase tracking-widest truncate mt-0.5">{member.village || 'Неизвестно'} • {member.teip || 'Тайп'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-kherch-dark/5 pt-3">
                  <div className="flex items-center gap-1.5 text-kherch-dark font-bold text-xs bg-vainakh-stone px-2.5 py-1 rounded-lg border border-kherch-dark/5">
                    <Briefcase size={12} className="opacity-50" />
                    <span className="truncate">{member.profession || 'Готов помочь'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-kherch-dark/60 text-xs font-medium">
                    <MapPin size={12} className="opacity-50" />
                    <span>{member.ville}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-20 opacity-30">
                <Search size={40} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Никого не найдено</p>
             </div>
          )}

          {/* MARSHA MODULE - TRADITIONAL MARRIAGE (ADAT) */}
          <div className="mt-6 bg-vainakh-stone border border-kherch-dark/5 rounded-[2rem] p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500">
                   <Heart size={20} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-kherch-dark tracking-tight">Марша / Union Familiale</h4>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adat & Tradition</p>
                </div>
             </div>
             
             <p className="text-xs text-kherch-dark/70 font-medium leading-relaxed mb-6">
                Le futur de notre peuple repose sur la force de nos familles. Conformément à nos traditions, cette section permet aux parents de initier des unions dans la dignité et le respect du <strong>Nokhchalla</strong>.
             </p>

             <div className="space-y-3">
                <button 
                  onClick={() => setActiveModal('union-son')}
                  className="w-full py-4 bg-white border border-kherch-dark/5 hover:border-blue-500/20 hover:bg-blue-50/10 rounded-2xl flex items-center justify-between px-4 group transition-all"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                         <Users size={14} />
                      </div>
                      <span className="text-xs font-bold text-kherch-dark">Je cherche pour mon fils</span>
                   </div>
                   <ChevronLeft size={16} className="rotate-180 opacity-20 group-hover:opacity-100 transition-opacity" />
                </button>

                <button 
                  onClick={() => setActiveModal('union-daughter')}
                  className="w-full py-4 bg-white border border-kherch-dark/5 hover:border-rose-500/20 hover:bg-rose-50/10 rounded-2xl flex items-center justify-between px-4 group transition-all"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                         <Sparkles size={14} />
                      </div>
                      <span className="text-xs font-bold text-kherch-dark text-left">Je cherche pour ma fille</span>
                   </div>
                   <ChevronLeft size={16} className="rotate-180 opacity-20 group-hover:opacity-100 transition-opacity" />
                </button>
             </div>

             <div className="mt-6 flex items-center gap-2 px-2 opacity-40">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Processus respectant l&apos;Adat et la pudeur</span>
             </div>
          </div>

          <div className="mt-8 border-2 border-dashed border-kherch-dark/10 rounded-3xl p-5 text-center bg-vainakh-stone/50">
             <Heart size={24} className="mx-auto text-hearth-amber mb-2 opacity-90" />
             <h4 className="font-black text-kherch-dark text-sm mb-1">ГIо-Даккхар</h4>
             <p className="text-xs text-kherch-dark/60 font-medium mb-4 leading-relaxed">Сила нашего народа — в единстве. Пригласите сестру или брата.</p>
             <Link href="/join" className="inline-block bg-kherch-dark text-vainakh-stone text-xs font-bold px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md">
                Пригласить
             </Link>
          </div>
        </div>

        {/* ActionFooter - Adjusted for Home Indicator */}
        <div className="p-4 pb-safe border-t border-kherch-dark/5 bg-vainakh-stone/95 backdrop-blur-xl flex justify-between gap-3 z-10 flex-shrink-0 lg:hidden mb-2">
           <Link href="/heritage" className="flex-1 flex justify-center py-3.5 bg-white/80 hover:bg-white text-kherch-dark rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-sm active:scale-95">
             <BookOpen size={18} className="opacity-70" /> Наследие
           </Link>
           <Link href="/belkhi" className="flex-[1.2] flex justify-center py-3.5 bg-kherch-dark hover:bg-black text-vainakh-stone rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-lg active:scale-95">
             <Flame size={18} className="text-hearth-amber animate-pulse" /> Белхи
           </Link>
           <button className="flex-1 flex justify-center py-3.5 bg-white/80 hover:bg-white text-kherch-dark rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-sm active:scale-95">
             <Heart size={18} className="opacity-70 text-hearth-amber" /> СагIа
           </button>
        </div>
        </div>
      </div>

      {/* MODALS - AMANAT & UNION */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-vainakh-stone rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute right-6 top-6 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>

              {activeModal === 'amanat' ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white">
                        <Plane size={24} className="rotate-45" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-kherch-dark tracking-tight">Déclarer un Amanat</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entraide au voyage</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-kherch-dark/40 ml-4">Départ</label>
                           <input type="text" placeholder="Ex: Bruxelles" className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-kherch-dark/40 ml-4">Arrivée</label>
                           <input type="text" placeholder="Ex: Grozny" className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none" />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-kherch-dark/40 ml-4">Date de départ</label>
                        <input type="date" className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                     </div>
                     <button className="w-full py-5 bg-black text-vainakh-stone rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
                        Publier mon voyage
                     </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                     <div className={`w-14 h-14 ${activeModal === 'union-son' ? 'bg-blue-500' : 'bg-rose-500'} rounded-2xl flex items-center justify-center text-white`}>
                        {activeModal === 'union-son' ? <Users size={24} /> : <Sparkles size={24} />}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-kherch-dark tracking-tight">
                           {activeModal === 'union-son' ? 'Pour mon fils' : 'Pour ma fille'}
                        </h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Union Familiale (Adat)</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs text-kherch-dark/60 font-medium leading-relaxed px-2 bg-white/50 p-4 rounded-2xl border border-black/5 mb-6">
                        Conformément au <strong>Nokhchalla</strong>, cette demande est traitée avec la plus grande discrétion. Seuls les parents vérifiés pourront voir cette intention d&apos;union.
                     </p>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-kherch-dark/40 ml-4">Prénom de l&apos;enfant</label>
                        <input type="text" className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-kherch-dark/40 ml-4">Âge</label>
                        <input type="number" className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none" />
                     </div>
                     <button className={`w-full py-5 ${activeModal === 'union-son' ? 'bg-blue-600' : 'bg-rose-600'} text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4`}>
                        Déposer l&apos;intention
                     </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMember && (
          <MemberProfile member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>

      <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
    </main>
  );
}
