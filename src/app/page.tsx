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
        // Show approved OR sample ones (all sample have approved: true)
        setMembers(membersList.filter(m => m.approved !== false));
      } else {
        // Fallback to sample experts for user visualization
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
        setMembers(sampleExperts);
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

  const liveCount = useMemo(() => {
    // 10% des membres + ceux avec isLive: true
    return members.filter(m => m.isLive).length + Math.floor(members.length * 0.1) + 3;
  }, [members]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const centerOnMe = () => {
    if (userLocation) {
      setMapCenter([...userLocation]);
    }
  };

  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const shareLiveLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsSharingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const liveRef = ref(db, 'members');
          const newLiveMember = {
            prenom: "Membre",
            nom: "En ligne",
            age: "??",
            teip: "Vainakh",
            village: "Daimohk",
            profession: "Frère / Sœur en ligne",
            ville: "Position Partagée",
            lat: latitude,
            lng: longitude,
            whatsapp: "",
            isLive: true,
            approved: true,
            lastSeen: Date.now()
          };
          
          // Simulation d'un ajout "Live"
          const newRef = push(liveRef);
          await set(newRef, newLiveMember);
          
          alert("Votre position a été partagée avec la communauté ! Vous apparaissez maintenant sur la carte.");
          setMapCenter([latitude, longitude]);
        } catch (err) {
          console.error("Erreur de partage:", err);
          alert("Erreur lors du partage de la position.");
        } finally {
          setIsSharingLocation(false);
        }
      },
      (error) => {
        console.error("Geoloc error:", error);
        alert("Impossible d'accéder à votre position. Veuillez autoriser la localisation.");
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: true }
    );
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
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] text-black uppercase">
                Manifeste de la Diaspora<br/>
                <span className="text-gray-400">Le Fardeau et l'Excellence</span>
              </h1>
              <p className="text-xl font-medium text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Une introspection absolue sur notre réalité en exil. Détruire le stigmate, non pas par la plainte, mais par l'irréfutable preuve de notre excellence.
              </p>
            </div>

            <article className="prose prose-lg prose-gray max-w-none space-y-16 text-justify selection:bg-black selection:text-white">
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">01.</span> Les Racines de l'Exode
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Comprendre la diaspora tchétchène moderne nécessite de regarder la vérité en face. Nous n'avons pas quitté les montagnes du Caucase par pur opportunisme économique. Nous avons été propulsés hors de nos terres (Daimohk) par la violence inouïe de deux guerres dévastatrices. Notre exil est avant tout un instinct de survie, un acte de protection pour nos familles, nos enfants et notre patrimoine génétique même.
                  </p>
                  <p>
                    Arrivés en Europe – en France, en Allemagne, en Autriche, en Belgique – nos parents ont dû affronter un monde inconnu, une barrière linguistique de fer, et le traumatisme sourd de la perte. Pourtant, ils ont construit. Ils ont bâti des vies à partir des cendres.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">02.</span> Le Poids du Stigmate
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Aujourd'hui, nous faisons face à un second front. Il n'est plus armé, il est sociétal, médiatique et administratif. En Europe et ailleurs, une étiquette lourde, injuste et stigmatisante a été collée sur le front de notre communauté.
                  </p>
                  <p>
                    Le récit médiatique est brutal. La communauté est trop souvent observée à travers le prisme de la sécurité, de la suspicion, et de la criminalisation collective. Dans certains pays hôtes, le simple fait de porter un nom à consonance nord-caucasienne peut déclencher des vérifications supplémentaires, des refus de logement, des obstacles à l'embauche, voire un harcèlement administratif ou le spectre terrifiant d'une déportation.
                  </p>
                  <p>
                    Nous sommes pris en étau. D'un côté, la menace des abus des notices rouges d'Interpol lancées par des entités étatiques vengeresses. De l'autre, la méfiance des pays d'accueil qui simplifient une histoire millénaire complexe en un raccourci xénophobe. Ce fardeau est lourd pour la jeunesse qui growit ici.
                  </p>
                </div>

                <div className="bg-black text-white p-10 rounded-[2.5rem] mt-8 shadow-2xl space-y-6">
                  <h3 className="text-2xl font-black">La Tragédie du 1% et le Silence des 99%</h3>
                  <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                    <p>
                      C'est la tragédie mathématique de l'attention publique. Les actions d'une infime minorité — le 1% qui s'égare, qui trahit l'éducation de nos pères, qui tombe dans la délinquance ou les idéologies mortifères — sont systématiquement instrumentalisées pour définir l'ensemble de notre peuple.
                    </p>
                    <p>
                      Quand "l'un" commet une faute, l'origine ethnique occupe les gros titres. Mais qui parle des 99% ? Le monde ignore délibérément la majorité silencieuse de notre diaspora.
                    </p>
                    <p>
                      Qui parle de ces milliers de médecins, d'infirmières, de chirurgiens d'origine tchétchène qui sauvent des vies chaque jour dans les hôpitaux européens ? Qui parle de nos brillants ingénieurs, de nos étudiants diplômés des plus grandes universités, de nos entrepreneurs qui créent de l'emploi et de la valeur dans la matrice même de la société française, allemande ou autrichienne ? Qui souligne que la majorité écrasante de notre peuple vit honnêtement, paie ses impôts, respecte les lois et élève ses enfants dans le respect et l'honneur strict ?
                    </p>
                    <p className="text-white font-black italic">
                      Notre excellence est invisible, nos erreurs sont luminescentes. C'est le lot des exilés, et nous devons l'accepter pour mieux le combattre.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">03.</span> Le Devoir de l'Invité (Le Haasha)
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Notre tradition, le Nokhchalla, n'est pas qu'un mot vide. C'est un code de conduite rigoureux, forgé dans la roche. Au sommet de ce code se trouve un concept sacré : l'hospitalité.
                  </p>
                  <p>
                    Mais l'hospitalité va dans les deux sens. Si l'hôte se doit de tout offrir à l'invité, l'invité (le Haasha) a le devoir absolu d'être irréprochable. En Europe, c'est nous les invités. Ces pays ont accordé l'asile à nos pères quand ils fuyaient les bombes. Ils ont nourri, soigné et scolarisé nos familles. Le Nokhchalla exige de nous une gratitude sans borne et un respect intransigeant des lois de nos sociétés d'accueil.
                  </p>
                  <blockquote className="border-l-4 border-black pl-6 py-2 text-black font-black text-xl italic">
                    "Celui qui ne respecte pas le toit qui l'abrite n'est ni un héros, ni un homme d'honneur. Il est la honte de son Teip."
                  </blockquote>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">04.</span> Détruire les Préjugés par l'Excellence
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    Comment détruire ces stéréotypes qui pèsent sur l'avenir de nos enfants ? Ce ne sera ni par la victimisation constante, ni par la plainte incessante. Le monde ne respecte que la force intellectuelle, la contribution manifeste et le succès.
                  </p>
                  <p className="text-black font-black text-xl">
                    Nous devons écraser le préjugé sous le poids de notre excellence.
                  </p>
                  <p>
                    Aujourd'hui, l'acte de résistance le plus puissant, le patriotisme le plus élevé pour un jeune Vainakh, ce n'est pas l'agitation stérile. C'est d'obtenir un master, de créer une entreprise florissante, de devenir un avocat redoutable, un chercheur reconnu, un artiste brillant. Lorsque les institutions locales interagiront avec nous, elles ne verront pas des problèmes, elles verront la solution, la compétence, le savoir-être (O'zdangalla).
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">05.</span> L'Arme de l'Éducation (Кхетам)
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    L'éducation, pure et simple, est notre porte de salut. Les parents de notre communauté ont sacrifié leur santé dans des usines et sur des chantiers en Europe, non pas pour que leurs enfants reproduisent la précarité ou s'égarent dans l'illusion de la facilité de la rue, mais pour qu'ils s'assoient sur les bancs des grandes écoles. Ne trahisons pas leur sacrifice.
                  </p>
                  <p>
                    C'est pourquoi, au sein de cet outil, de cette plateforme, <strong className="text-black">le Mentorat est central</strong>. Ceux de la première vague qui ont réussi à percer le plafond de verre (ingénieurs, juristes, cadres) ont le devoir moral absolu, imposé par la fraternité, de tendre la main et de guider la jeunesse qui doute.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                  <span className="text-gray-200">06.</span> La Fonction du Foyer "Вайнах"
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                  <p>
                    C'est la raison d'être de cette application. Elle n'est pas un réseau social conçu pour tuer le temps ou flatter des egos. C'est une <strong className="text-black">infrastructure numérique stricte, fonctionnelle, dédiée à la protection et à l'ascension</strong> de notre communauté.
                  </p>
                  <ul className="space-y-4 mt-6">
                    <li className="flex gap-4">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 shrink-0"></span>
                      <span><strong className="text-black">Un Bouclier Juridique :</strong> Identifier instantanément nos avocats et traducteurs assermentés pour protéger ceux d'entre nous menacés d'abus administratifs et sécuriser notre présence légale permanente.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 shrink-0"></span>
                      <span><strong className="text-black">Un Relais de Mentorat :</strong> Mettre en relation l'excellence technique, médicale ou intellectuelle d'un membre avec l'ambition légitime d'un autre.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 shrink-0"></span>
                      <span><strong className="text-black">Un Réseau Économique :</strong> Favoriser les affaires, l'embauche, et garantir le logement par la caution de nos frères et sœurs solides économiquement.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 shrink-0"></span>
                      <span><strong className="text-black">Un Devoir Sacré :</strong> Faciliter la logistique et fonds pour gérer les épreuves ultimes, notamment le respect digne et le rapatriement funéraire de nos anciens.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="pt-20 border-t border-gray-100">
                <div className="text-center space-y-8">
                  <h3 className="text-3xl font-black text-black">Épilogue</h3>
                  <div className="space-y-6 text-gray-600 font-medium text-lg italic">
                    <p>Personne ne viendra nous sauver, si ce n'est nous-mêmes, par la grâce de Dieu.</p>
                    <p>Soyons les meilleurs citoyens, soyons les plus éduqués, soyons d'une droiture inébranlable et d'une utilité incontestable pour le monde qui nous entoure.</p>
                    <p>Puisons dans notre identité millénaire la fierté non pas pour être arrogants, mais pour trouver la force d'être irréprochables. N'ayons aucune patience, aucune complaisance envers ceux d'entre nous qui dévient et salissent l'histoire de leurs ancêtres. Elevons les autres.</p>
                  </div>
                  <p className="text-2xl font-black text-black mt-12 tracking-[0.2em] uppercase">Далла аьтто бойла вай.</p>
                  
                  <button 
                    onClick={dismissWelcome}
                    className="w-full mt-12 py-6 bg-black text-white rounded-2xl font-black text-sm tracking-[0.2em] uppercase shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    J&apos;AI LU ET J&apos;ACCEPTE LA MISSION <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            </article>
          </div>
        </div>
      )}

      {/* Main Layout Container with Expert Sidebar */}
      <div className="flex h-[100dvh] relative overflow-hidden w-full">
        
      
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
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-black/5 rounded-[2rem] flex items-center justify-between px-4 py-2.5">
            <button 
              className="w-11 h-11 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} className="text-gray-800" />
            </button>
            
            <div className="flex-1 px-3 flex items-center gap-2">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Поиск..."
                className="w-full bg-transparent border-none outline-none text-base font-medium placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>

            <div className="flex items-center gap-1 shrink-0 border-l border-black/5 ml-2 pl-2">
              <button 
                onClick={shareLiveLocation}
                disabled={isSharingLocation}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isSharingLocation ? 'animate-pulse text-hearth-amber' : 'hover:bg-black/5 text-gray-400 hover:text-hearth-amber'}`}
                title="Partager ma position live"
              >
                <Target size={20} />
              </button>

              <button 
                onClick={centerOnMe}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 rounded-full transition-all text-gray-400 hover:text-chechen-blue"
                title="Ma position"
              >
                <MapPin size={20} />
              </button>
            </div>
          </div>

          {/* Intelligent Search Suggestions */}
          <AnimatePresence>
            {isSearchFocused && (
              <>
                {/* Backdrop to close focus */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSearchFocused(false)}
                  className="fixed inset-0 z-[-1]"
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-white/90 backdrop-blur-2xl shadow-2xl border border-black/5 rounded-[2rem] p-6 mt-3 flex flex-col gap-5 overflow-hidden"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Быстрый поиск / Experts</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'isLegalDefender', label: 'Адвокат / Avocats', icon: Gavel, color: 'text-red-500' },
                        { id: 'isTranslator', label: 'Переводчик / Traducteurs', icon: Languages, color: 'text-blue-500' },
                        { id: 'isGuide', label: 'Админ. помощь / Guide', icon: MapIcon, color: 'text-emerald-500' },
                        { id: 'openToMentorship', label: 'Ментор / Mentors', icon: GraduationCap, color: 'text-amber-500' },
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => handleSuggestionSelect(item.id, 'expert')}
                          className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-black/5 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm ${selectedExpertType === item.id ? 'ring-2 ring-black bg-gray-50' : ''}`}
                        >
                          <item.icon size={14} className={item.color} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Популярные запросы</p>
                    <div className="flex flex-wrap gap-2">
                      {['Ingénieur', 'Marketing', 'Développeur', 'Strasbourg', 'Berlin', 'Vienne'].map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => handleSuggestionSelect(tag)}
                          className="px-4 py-2 bg-gray-50/50 hover:bg-gray-100 border border-black/5 rounded-xl text-xs font-bold text-gray-600 transition-all active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedExpertType && (
                    <button 
                      onClick={() => {setSelectedExpertType(''); setIsSearchFocused(false);}}
                      className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-opacity text-center w-full"
                    >
                      Сбросить фильтры / Clear filters
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Expanded Filters (Legacy Teips) */}
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

          {/* Live Status Header Widget */}
          <div className="mb-6 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-kherch-dark/5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-kherch-dark rounded-xl flex items-center justify-center text-vainakh-stone">
                  <Users size={20} />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">В сети / Online</p>
                <p className="text-sm font-black text-kherch-dark">{liveCount} братьев и сестер</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-600 animate-pulse">Live Now</p>
              <div className="flex gap-0.5 mt-1 h-3 items-end">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-0.5 bg-emerald-500/40 rounded-full animate-bounce h-${i % 2 === 0 ? 'full' : '1/2'}`} style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
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
                  onClick={() => {/* Declare travel logic */}}
                  className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                 >
                   Я еду
                 </button>
              </div>

              {/* Active Travels Scroller */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                 {filteredMembers.filter(m => m.isTraveling).length > 0 ? (
                    filteredMembers.filter(m => m.isTraveling).map(m => (
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
                  onClick={() => {/* Form logic for son */}}
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
                  onClick={() => {/* Form logic for daughter */}}
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
