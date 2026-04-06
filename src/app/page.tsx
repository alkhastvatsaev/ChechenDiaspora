"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UserPlus, Search, Menu, Target, Info, Heart, ShieldCheck, X, Filter, Globe, BookOpen, Users, Briefcase, MapPin, Flame, ChevronLeft, Gavel, GraduationCap, Truck, ArrowRight, Languages, Map as MapIcon } from 'lucide-react';
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedExpertType, setSelectedExpertType] = useState<string | null>(null);

  // Check if first visit in this session
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('vainakh_seen_welcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('vainakh_seen_welcome', 'true');
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
      // Expert Type Filter
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

  const centerOnMe = () => {
    if (userLocation) {
      setMapCenter([...userLocation]);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-apple-light text-apple-dark font-sans">
      
      {showWelcome && (
        <div className="absolute inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in duration-700">
          <div className="max-w-3xl mx-auto px-8 py-20 pb-40">
            <div className="flex justify-center mb-12">
               <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                 <Flame className="w-10 h-10 text-hearth-amber" />
               </div>
            </div>

            <div className="space-y-6 mb-16 text-center">
              <h4 className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Вайнах / Vainakh</h4>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-black">
                MANIFESTE DE LA DIASPORA
              </h1>
              <p className="text-xl font-medium text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Détruire le stigmate, non pas par la plainte, mais par l&apos;irréfutable preuve de notre excellence.
              </p>
            </div>

            <article className="prose prose-lg prose-gray max-w-none space-y-16 text-justify selection:bg-black selection:text-white">
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">01.</span> Les Racines de l&apos;Exode
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Nous n&apos;avons pas quitté les montagnes du Caucase par opportunisme. Nous avons été propulsés par la violence. Notre exil est un instinct de survie pour protéger nos familles et notre patrimoine génétique même. Arrivés en Europe, nos parents ont bâti des vies à partir des cendres.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">02.</span> Le Poids du Stigmate
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Aujourd&apos;hui, nous faisons face à un second front : médiatique et administratif. Une étiquette lourde et injuste a été collée sur notre communauté. Le récit médiatique est brutal, nous observant à travers le prisme de la suspicion. Nous sommes pris en étau entre les abus d&apos;entités vengeresses et la méfiance des pays d&apos;accueil.
                </p>
                <div className="bg-black text-white p-8 rounded-3xl mt-6">
                  <h3 className="text-xl font-bold mb-4">La Tragédie du 1%</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Les actions d&apos;une infime minorité — le 1% qui trahit l&apos;éducation de nos pères — sont instrumentalisées pour définir l&apos;ensemble de notre peuple. Mais qui parle des 99% ? Les médecins, ingénieurs, et entrepreneurs qui sauvent des vies et créent de la valeur chaque jour ?
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">03.</span> Le Devoir de l&apos;Invité (Le Haasha)
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Le Nokhchalla est un code de conduite rigoureux. En Europe, nous sommes les invités. L&apos;invité (le Haasha) a le devoir absolu d&apos;être irréprochable. Le respect des lois de nos sociétés d&apos;accueil n&apos;est pas une option, c&apos;est une exigence de notre honneur.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">04.</span> L&apos;Arme de l&apos;Éducation
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Le patriotisme le plus élevé pour un jeune Vainakh aujourd&apos;hui est d&apos;obtenir son master, de devenir un avocat redoutable, un chercheur reconnu ou un entrepreneur brillant. Nous devons écraser le préjugé sous le poids de notre excellence intellectuelle.
                </p>
              </section>

              <section className="pt-10">
                <p className="text-xl font-black text-center mb-10 tracking-widest leading-relaxed uppercase">Далла аьтто бойла вай.</p>
                <button 
                  onClick={dismissWelcome}
                  className="w-full py-6 bg-black text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  J&apos;AI LU ET J&apos;ACCEPTE LA MISSION <ArrowRight size={18} />
                </button>
              </section>
            </article>
          </div>
        </div>
      )}

      {/* Main Layout Container with Expert Sidebar */}
      <div className="flex h-[100dvh] relative overflow-hidden w-full">
        
        {/* EXPERT QUICK ACCESS SIDEBAR (LEFT) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
           {[
             { id: 'isLegalDefender', icon: Gavel, label: 'Avocats', color: 'bg-red-500' },
             { id: 'isTranslator', icon: Languages, label: 'Traducteurs', color: 'bg-blue-500' },
             { id: 'isGuide', icon: MapIcon, label: 'Administratif', color: 'bg-emerald-500' },
             { id: 'openToMentorship', icon: GraduationCap, label: 'Mentors', color: 'bg-amber-500' },
           ].map((expert) => (
             <button
               key={expert.id}
               onClick={() => handleExpertFilter(expert.id)}
               className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all shadow-xl backdrop-blur-xl border border-white/20 
                 ${selectedExpertType === expert.id ? `${expert.color} text-white scale-110 shadow-inner` : 'bg-white/80 text-black hover:bg-white'}`}
             >
               <expert.icon size={24} />
               <div className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none z-50 shadow-2xl">
                 {expert.label}
               </div>
             </button>
           ))}
        </div>

        {/* Mobile Expert Tab (Bottom Left) */}
        <div className="absolute left-4 bottom-28 z-40 lg:hidden flex flex-col gap-2">
           <button 
             onClick={() => handleExpertFilter('isLegalDefender')}
             className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md transition-all 
               ${selectedExpertType === 'isLegalDefender' ? 'bg-red-500 text-white' : 'bg-white/80 text-red-500'}`}
           >
             <Gavel size={20} />
           </button>
           <button 
             onClick={() => handleExpertFilter('isGuide')}
             className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md transition-all 
               ${selectedExpertType === 'isGuide' ? 'bg-emerald-500 text-white' : 'bg-white/80 text-emerald-500'}`}
           >
             <MapIcon size={20} />
           </button>
        </div>
      
        {/* Background Map layer */}
        <div className="flex-1 relative">
          <Map 
            members={filteredMembers} 
            center={mapCenter} 
            onMemberClick={(m) => setSelectedMember(m)}
            showHeatmap={showHeatmap}
          />
        </div>

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
          className="bg-white text-kherch-dark p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center border border-black/5"
        >
          <Target size={28} />
        </button>
      </div>

      {/* Massive ORTSA (SOS / Emergency Mutual Aid) Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pb-safe-bottom flex flex-col items-center">
        <button 
          onClick={() => alert("ОРЦА: Сигнал бедствия хуьлуш ду... (В разработке)")}
          className="relative group bg-hearth-amber text-white px-8 md:px-10 py-4 rounded-full shadow-[0_0_30px_rgba(226,88,34,0.4)] hover:shadow-[0_0_40px_rgba(226,88,34,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-hearth-glow/50 font-black overflow-hidden"
        >
          {/* Subtle pulse effect inside button */}
          <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></span>
          <span className="absolute -inset-1 bg-hearth-glow rounded-full blur opacity-40 group-hover:opacity-60 animate-pulse"></span>
          
          <ShieldCheck size={24} className="relative z-10" />
          <span className="relative z-10 tracking-widest uppercase text-lg">Орца</span>
        </button>
        <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm hidden md:block">Экстренная помощь</p>
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

      {/* Community Sidebar / Mutual Aid Hub (Kherch) */}
      <div 
        className={`absolute top-0 left-0 w-full md:w-[28rem] h-full bg-vainakh-stone/95 backdrop-blur-2xl shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 sm:p-6 pb-2 pt-safe-top flex-shrink-0 border-b border-kherch-dark/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-black tracking-widest text-hearth-amber uppercase mb-1">Марша догIийла</p>
              <h2 className="text-3xl font-black tracking-tighter text-kherch-dark" style={{ fontFamily: 'Arial, sans-serif' }}>Вайнах</h2>
              <p className="text-sm text-kherch-dark/60 font-bold mt-1">Доступно {members.length} братьев/сестёр</p>
            </div>
            <button 
              className="p-2 hover:bg-kherch-dark/5 rounded-full transition-colors self-start"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} className="text-kherch-dark/50" />
            </button>
          </div>

          {/* Manifesto Entry Point - High Visibility */}
          <Link 
            href="/manifesto" 
            className="mb-6 p-4 bg-black text-white rounded-2xl flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-hearth-amber animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Manifeste</p>
                <p className="text-sm font-bold tracking-tight">Le fardeau et l&apos;excellence</p>
              </div>
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
                    <span className="truncate">{member.ville || 'N/A'}, {member.pays}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 flex flex-col items-center opacity-70">
              <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-4 shadow-sm border border-kherch-dark/5">
                <Heart size={24} className="text-hearth-amber" />
              </div>
              <p className="text-kherch-dark/60 font-bold">Ожидаем братьев и сестёр...</p>
            </div>
          )}

          {/* Crowdsourcing Call to Action */}
          <div className="mt-8 border-2 border-dashed border-kherch-dark/10 rounded-3xl p-5 text-center bg-vainakh-stone/50">
             <Heart size={24} className="mx-auto text-hearth-amber mb-2 opacity-90" />
             <h4 className="font-black text-kherch-dark text-sm mb-1">ГIо-Даккхар</h4>
             <p className="text-xs text-kherch-dark/60 font-medium mb-4 leading-relaxed">Сила нашего народа — в единстве. Пригласите сестру или брата.</p>
             <Link href="/join" className="inline-block bg-kherch-dark text-vainakh-stone text-xs font-bold px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md">
               Пригласить

             </Link>
          </div>
        </div>

        {/* ActionFooter */}
        <div className="p-4 border-t border-kherch-dark/5 bg-vainakh-stone/95 backdrop-blur-xl flex justify-between gap-3 z-10 flex-shrink-0 lg:hidden">
           <Link href="/heritage" className="flex-1 flex justify-center py-3.5 bg-white/80 hover:bg-white text-kherch-dark rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-sm">
             <BookOpen size={18} className="opacity-70" /> Наследие
           </Link>
           <Link href="/belkhi" className="flex-[1.2] flex justify-center py-3.5 bg-kherch-dark hover:bg-black text-vainakh-stone rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-lg">
             <Flame size={18} className="text-hearth-amber animate-pulse" /> Белхи
           </Link>
           <button className="flex-1 flex justify-center py-3.5 bg-white/80 hover:bg-white text-kherch-dark rounded-2xl transition-colors font-bold text-xs flex-col items-center gap-1 border border-kherch-dark/5 shadow-sm">
             <Heart size={18} className="opacity-70 text-hearth-amber" /> СагIа
           </button>
        </div>
        </div>
      </div>
    </main>
  );
}
