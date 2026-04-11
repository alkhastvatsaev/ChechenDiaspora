"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { UserPlus, Search, Menu, Target, Info, Heart, ShieldCheck, X, Filter, Globe, BookOpen, Users, Briefcase, MapPin, Flame, ChevronLeft, Gavel, GraduationCap, Truck, ArrowRight, Languages, Sparkles, Plane, Package, Plus, Mic, PenLine, Square, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, push, set } from 'firebase/database';
import { db, storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import MemberProfile from '@/components/MemberProfile';
import LanguageModal from '@/components/LanguageModal';
import StoryOverlay from '@/components/StoryOverlay';

// Use dynamic import for Leaflet Map as it needs 'window' (client-side only)
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-apple-light animate-pulse flex items-center justify-center font-bold text-gray-400">Загрузка карты...</div>
});

const sampleExperts = [
  { id: 'S1', prenom: "Аслан", nom: "Базаров", profession: "Юрист / Право убежища", isLegalDefender: true, ville: "Страсбург", pays: "Франция", village: "Шали", teip: "Шолой", lat: 48.5734, lng: 7.7521, isLive: true, approved: true, message: "Готов помочь братьям юридически.", hasStory: true, storyContent: { type: 'berkat', title: 'Срочная помощь', text: 'Нужен переводчик для семьи в Страсбурге на завтра. Кто свободен?', date: '2ч назад' } },
  { id: 'S2', prenom: "Зелим", nom: "Умаров", profession: "Инженер ПО", ville: "Берлин", pays: "Германия", village: "Гехи", teip: "Гехой", lat: 52.5200, lng: 13.4050, isLive: false, openToMentorship: true, approved: true, message: "Могу стать наставником в IT." },
  { id: 'S3', prenom: "Амина", nom: "Исаева", profession: "Присяжный переводчик", isTranslator: true, ville: "Вена", pays: "Австрия", village: "Ведено", teip: "Белтой", lat: 48.2082, lng: 16.3738, isLive: true, approved: true, message: "Перевод: Арабский/Немецкий/Французский.", hasStory: true, storyContent: { type: 'heritage', title: 'Урок языка', text: 'Сегодня разбираем тему Адатов в нашем культурном центре.', date: '30м назад' } },
  { id: 'S4', prenom: "Беслан", nom: "Цароев", profession: "Нотариус", ville: "Ницца", pays: "Франция", village: "Гудермес", teip: "Гордалой", lat: 43.7102, lng: 7.2620, isLive: false, approved: true },
  { id: 'S5', prenom: "Мансур", nom: "Гакаев", profession: "Тренер / ММА", ville: "Варшава", pays: "Польша", village: "Аргун", teip: "Элистанжхой", lat: 52.2297, lng: 21.0122, isLive: true, approved: true },
  { id: 'S6', prenom: "Раиса", nom: "Кадырова", profession: "Терапевт", ville: "Лион", pays: "Франция", village: "Грозный", teip: "Шолой", lat: 45.7640, lng: 4.8357, isLive: false, approved: true },
  { id: 'S7', prenom: "Хамзат", nom: "Джабраилов", profession: "Политолог", ville: "Брюссель", pays: "Бельгия", village: "Урус-Мартан", teip: "Чонкой", lat: 50.8503, lng: 4.3517, isLive: true, approved: true },
  { id: 'S8', prenom: "Исмаил", nom: "Наурбиев", profession: "Архитектор", ville: "Мюнхен", pays: "Германия", village: "Серноводск", teip: "Орстхой", lat: 48.1351, lng: 11.5820, isLive: false, approved: true },
  { id: 'S9', prenom: "Лиана", nom: "Тутаева", profession: "Дизайнер Маркетинга", ville: "Париж", pays: "Франция", village: "Ачхой-Мартан", teip: "Цечой", lat: 48.8566, lng: 2.3522, isLive: true, approved: true },
  { id: 'S10', prenom: "Адам", nom: "Хаджиев", profession: "Эксперт Кибербезопасности", ville: "Цюрих", pays: "Швейцария", village: "Бамут", teip: "Аккий", lat: 47.3769, lng: 8.5417, isLive: true, approved: true }
];

type TicketItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  ville: string;
  pays: string;
  lat?: number;
  lng?: number;
  audioUrl?: string;
  audioPath?: string;
  createdAt: number;
  status: 'new' | 'published' | 'closed';
};

declare global {
  interface Window {
    webkitSpeechRecognition?: unknown;
    SpeechRecognition?: unknown;
  }
}

export default function Home() {
  // Core State
  const [activeTab, setActiveTab] = useState<'map' | 'hub' | 'council'>('map');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedStoryMember, setSelectedStoryMember] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'amanat' | 'perevozchik' | 'administrative' | 'union-son' | 'union-daughter' | 'berkat-form' | null>(null);
  const [showBerkat, setShowBerkat] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeip, setSelectedTeip] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedExpertType, setSelectedExpertType] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Admin Tickets (publicly published)
  const [publishedTickets, setPublishedTickets] = useState<TicketItem[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketDraft, setTicketDraft] = useState({
    title: '',
    description: '',
    category: 'administrative',
    ville: '',
    pays: 'Франция',
    lat: '',
    lng: '',
  });
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [ticketInputMode, setTicketInputMode] = useState<'voice' | 'text'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrlLocal, setAudioUrlLocal] = useState<string>('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Check if first visit in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('vainakh_seen_welcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  useEffect(() => {
    const ticketsRef = ref(db, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, any> | null;
      if (!data) {
        setPublishedTickets([]);
        return;
      }

      const list: TicketItem[] = Object.entries(data)
        .map(([id, v]) => ({
          id,
          title: typeof v.title === 'string' ? v.title : '',
          description: typeof v.description === 'string' ? v.description : '',
          category: typeof v.category === 'string' ? v.category : 'administrative',
          ville: typeof v.ville === 'string' ? v.ville : '',
          pays: typeof v.pays === 'string' ? v.pays : '',
          lat: typeof v.lat === 'number' ? v.lat : undefined,
          lng: typeof v.lng === 'number' ? v.lng : undefined,
          createdAt: typeof v.createdAt === 'number' ? v.createdAt : 0,
          status: v.status === 'published' || v.status === 'closed' ? v.status : 'new',
        }))
        .filter((t) => t.status === 'published')
        .sort((a, b) => b.createdAt - a.createdAt);

      setPublishedTickets(list);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionCtor = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as any;
    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalAdd = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = String(res?.[0]?.transcript ?? '');
        if (res.isFinal) finalAdd += text;
        else interim += text;
      }

      if (finalAdd) {
        setFinalTranscript((prev) => (prev ? `${prev} ${finalAdd}`.trim() : finalAdd.trim()));
      }
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    const combined = `${finalTranscript} ${interimTranscript}`.trim();
    if (!combined) return;
    if (ticketInputMode !== 'voice') return;
    setTicketDraft((d) => ({ ...d, description: combined }));
  }, [finalTranscript, interimTranscript, ticketInputMode]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vainakh_seen_welcome', 'true');
    }
  };

  const submitTicket = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const title = ticketDraft.title.trim() || 'Аудио-запрос';
    const description = ticketDraft.description.trim() || (audioBlob ? 'Аудио-сообщение' : '');
    const ville = ticketDraft.ville.trim() || 'Не указан';
    const pays = ticketDraft.pays.trim() || 'Не указан';
    
    // Must have either a description (text) or an audio recording
    if (!description && !audioBlob) return;

    const lat = Number(ticketDraft.lat);
    const lng = Number(ticketDraft.lng);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

    stopListening();

    let uploadedAudioUrl: string | undefined;
    let uploadedAudioPath: string | undefined;

    if (audioBlob) {
      const ext = audioBlob.type.includes('webm') ? 'webm' : audioBlob.type.includes('ogg') ? 'ogg' : 'bin';
      const path = `tickets_audio/${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, audioBlob, { contentType: audioBlob.type || 'application/octet-stream' });
      uploadedAudioUrl = await getDownloadURL(sRef);
      uploadedAudioPath = path;
    }

    const newRef = push(ref(db, 'tickets'));
    await set(newRef, {
      title,
      description,
      category: ticketDraft.category,
      ville,
      pays,
      ...(hasCoords ? { lat, lng } : {}),
      ...(uploadedAudioUrl ? { audioUrl: uploadedAudioUrl } : {}),
      ...(uploadedAudioPath ? { audioPath: uploadedAudioPath } : {}),
      status: 'new',
      createdAt: Date.now(),
    });

    setIsTicketModalOpen(false);
    setTicketDraft({
      title: '',
      description: '',
      category: 'administrative',
      ville: '',
      pays: 'Франция',
      lat: '',
      lng: '',
    });
    setTicketInputMode('voice');
    setIsListening(false);
    setFinalTranscript('');
    setInterimTranscript('');
    if (audioUrlLocal) URL.revokeObjectURL(audioUrlLocal);
    setAudioBlob(null);
    setAudioUrlLocal('');
    setIsRecordingAudio(false);
  };

  const startListening = () => {
    if (!speechSupported) {
      setTicketInputMode('text');
      return;
    }
    if (isListening) return;
    try {
      recognitionRef.current?.start?.();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!isListening) return;
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    setIsListening(false);
  };

  const startAudioRecording = async () => {
    if (typeof window === 'undefined') return;
    if (!navigator.mediaDevices?.getUserMedia) return;
    if (isRecordingAudio) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        if (audioUrlLocal) URL.revokeObjectURL(audioUrlLocal);
        setAudioUrlLocal(URL.createObjectURL(blob));
        setIsRecordingAudio(false);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingAudio(true);
    } catch {
      setIsRecordingAudio(false);
    }
  };

  const stopAudioRecording = () => {
    if (!isRecordingAudio) return;
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      setIsRecordingAudio(false);
    }
  };

  // Listen to members in Realtime Database
  useEffect(() => {
    const membersRef = ref(db, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      const travelers = [
        { 
          id: 'V1', 
          prenom: "Вадик", 
          isTraveling: true, 
          routePoints: [
            [48.5734, 7.7521],   // Strasbourg
            [48.1351, 11.5820],  // Munich
            [48.2082, 16.3738],  // Vienna
            [47.4979, 19.0402],  // Budapest
            [44.4268, 26.1025],  // Bucharest
            [41.0082, 28.9784],  // Istanbul
            [41.2867, 36.33],    // Samsun
            [41.6168, 41.6367],  // Batumi
            [41.7151, 44.7877],  // Tbilisi
            [43.0246, 44.6656],  // Vladikavkaz
            [43.318, 45.694]     // Grozny
          ],
          lat: 48.5734, lng: 7.7521, 
          approved: true 
        },
        { 
          id: 'T1', 
          prenom: "Мансур", 
          nom: "Дадаев", 
          isTraveling: true, 
          routePoints: [
            [50.8503, 4.3517],   // Brussels
            [50.1109, 8.6821],   // Frankfurt
            [50.0755, 14.4378],  // Prague
            [52.2297, 21.0122],  // Warsaw
            [53.9006, 27.5590],  // Minsk
            [55.7558, 37.6173],  // Moscow
            [47.2357, 39.7015],  // Rostov
            [43.318, 45.694]     // Grozny
          ],
          lat: 50.8503, lng: 4.3517, 
          approved: true 
        }
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

  const liveCount = useMemo(() => {
    return members.filter(m => m.isLive).length + Math.floor(members.length * 0.1) + 3;
  }, [members]);

  const mapEntities = useMemo(() => {
    const ticketMarkers = publishedTickets
      .filter((t) => typeof t.lat === 'number' && typeof t.lng === 'number')
      .map((t) => ({
        id: t.id,
        lat: t.lat,
        lng: t.lng,
        ville: t.ville,
        pays: t.pays,
        approved: true,
        isTicket: true,
        ticketTitle: t.title,
        ticketDescription: t.description,
        ticketCategory: t.category,
        createdAt: t.createdAt,
        prenom: t.title,
        nom: '',
        profession: 'Запрос',
      }));

    return [...filteredMembers, ...ticketMarkers];
  }, [filteredMembers, publishedTickets]);

  const handleSuggestionSelect = (term: string, type?: string) => {
    if (type === 'expert') {
      setSelectedExpertType(term);
      setSearchQuery('');
    } else {
      setSearchQuery(term);
      setSelectedExpertType('');
    }
    setIsSearchFocused(false);
    setActiveTab('hub');
  };

  return (
    <main className="flex h-full w-full flex-col bg-apple-light overflow-hidden fixed inset-0">
      {/* Background Interactive Map - Always Presence */}
      <div className="absolute inset-0 z-0">
        <Map 
          members={mapEntities} 
          center={mapCenter} 
          showHeatmap={showHeatmap}
          onMemberClick={(m: any) => {
            if (m?.isTicket) {
              setSelectedTicket({
                id: String(m.id),
                title: String(m.ticketTitle ?? ''),
                description: String(m.ticketDescription ?? ''),
                category: String(m.ticketCategory ?? ''),
                ville: String(m.ville ?? ''),
                pays: String(m.pays ?? ''),
                lat: typeof m.lat === 'number' ? m.lat : undefined,
                lng: typeof m.lng === 'number' ? m.lng : undefined,
                createdAt: typeof m.createdAt === 'number' ? m.createdAt : 0,
                status: 'published',
              });
              setActiveTab('map');
              return;
            }
            if (m.hasStory) {
              setSelectedStoryMember(m);
            } else {
              setSelectedMember(m);
              setActiveTab('map');
            }
          }}
        />
      </div>


      {/* Primary Interaction Layer (Home/Hub Content) */}
      <AnimatePresence mode="wait">
        {activeTab === 'hub' && (
          <motion.div 
            key="hub-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+60px)] z-[80] bg-vainakh-stone/95 backdrop-blur-3xl rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col border-t border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
              <div>
                <h1 className="text-4xl font-black text-kherch-dark tracking-tighter mb-1">Кхерч / Хаб</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Глобальный мост чеченской диаспоры</p>
              </div>
              <button 
                onClick={() => setActiveTab('map')}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-black/5 text-kherch-dark active:scale-90 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-40 space-y-8 scrollbar-hide">

              {/* High-Impact Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/join" className="col-span-2 bg-blue-600 p-6 rounded-[2.5rem] flex flex-col justify-between h-36 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform text-white">
                    <UserPlus size={80} />
                  </div>
                  <UserPlus className="text-white" size={28} />
                  <div className="relative z-10">
                    <h3 className="text-white font-black text-lg leading-tight mb-1">Вступить в Сеть</h3>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Ст ть ч стью сообществ </p>
                  </div>
                </Link>
                
                <button 
                  onClick={() => setActiveModal('amanat')}
                  className="bg-white p-6 rounded-[3rem] flex flex-col justify-between h-40 shadow-xl border border-blue-500/10 group active:scale-95 transition-all text-left"
                >
                  <Package className="text-blue-600" size={28} />
                  <div>
                    <h3 className="text-blue-900 font-black text-lg leading-tight mb-1">Аманат</h3>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-tight text-balance">Личные посылки</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('administrative')}
                  className="bg-white p-6 rounded-[3rem] flex flex-col justify-between h-40 shadow-xl border border-indigo-500/10 group active:scale-95 transition-all text-left"
                >
                  <Gavel className="text-indigo-600" size={28} />
                  <div>
                    <h3 className="text-indigo-900 font-black text-lg leading-tight mb-1">Помощь</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-tight text-balance">Админ. Франция</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('perevozchik')}
                  className="col-span-2 bg-white p-6 rounded-[3rem] flex items-center justify-between h-28 shadow-xl border border-emerald-500/10 group active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <h3 className="text-emerald-900 font-black text-xl leading-tight mb-1">Перевозки</h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-tight text-balance">Коммерческие грузы и почта</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Truck size={28} />
                  </div>
                </button>

                <button 
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="col-span-2 bg-[#FDFBF7] p-6 rounded-[3rem] flex items-center justify-between h-32 shadow-xl border border-orange-200/30 group active:scale-95 transition-all relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col justify-center text-left">
                    <h3 className="text-[#8B7355] font-black text-xl leading-tight mb-1 uppercase tracking-tighter">Дешар / Изучение</h3>
                    <p className="text-[11px] text-[#A69076] font-bold uppercase tracking-[0.2em] leading-tight">Чеченский язык и Адат</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-orange-100 flex-shrink-0 relative z-10">
                     <BookOpen className="text-[#8B7355]" size={32} />
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 translate-x-4">
                     <BookOpen size={120} />
                  </div>
                </button>
              </div>

              {/* Berkat (Work & Opportunities) Tile */}
              <button 
                onClick={() => setShowBerkat(true)}
                className="w-full bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100/50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500">
                    <Briefcase size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-kherch-dark font-black text-lg leading-tight uppercase tracking-tighter">Беркат</h3>
                    <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-widest">Работа и Местные Советы</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Anti-WhatsApp Core */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/requests"
                  className="bg-white p-6 rounded-[3rem] flex flex-col justify-between h-40 shadow-xl border border-black/5 group active:scale-95 transition-all text-left"
                >
                  <ShieldCheck className="text-kherch-dark" size={28} />
                  <div>
                    <h3 className="text-kherch-dark font-black text-lg leading-tight mb-1">Запросы</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight text-balance">Такт. помощь</p>
                  </div>
                </Link>

                <Link
                  href="/guides"
                  className="bg-white p-6 rounded-[3rem] flex flex-col justify-between h-40 shadow-xl border border-black/5 group active:scale-95 transition-all text-left"
                >
                  <BookOpen className="text-kherch-dark" size={28} />
                  <div>
                    <h3 className="text-kherch-dark font-black text-lg leading-tight mb-1">Гайды</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight text-balance">Память общины</p>
                  </div>
                </Link>

                <Link
                  href="/vouch"
                  className="col-span-2 bg-white p-6 rounded-[3rem] flex items-center justify-between h-28 shadow-xl border border-black/5 group active:scale-95 transition-all"
                >
                  <div className="text-left">
                    <h3 className="text-kherch-dark font-black text-xl leading-tight mb-1">Доверие</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight text-balance">Поручительство</p>
                  </div>
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-kherch-dark">
                    <Users size={28} />
                  </div>
                </Link>
              </div>

              {/* Search & Intelligence */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 shadow-inner border border-black/5 flex items-center gap-4">
                  <Search size={20} className="text-kherch-dark/30" />
                  <input 
                    type="text" 
                    placeholder="Найти земляка, юриста, наставника..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-kherch-dark placeholder:text-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expert Grid */}
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Сеть Вз имопомощи</h2>
                <div className="grid grid-cols-1 gap-3">
                  {filteredMembers.map(member => (
                    <motion.div 
                      layout
                      key={member.id} 
                      onClick={() => setSelectedMember(member)}
                      className="bg-white/60 p-4 rounded-3xl border border-black/[0.03] shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
                    >
                      <div className="w-14 h-14 bg-vainakh-stone rounded-2xl flex items-center justify-center text-xl font-black text-kherch-dark shadow-inner">
                        {member.prenom?.[0]}{member.nom?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-kherch-dark text-base truncate">{member.prenom} {member.nom}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-hearth-amber px-2 py-0.5 bg-hearth-amber/5 rounded-full">{member.profession}</span>
                          <span className="text-[9px] font-bold text-gray-300 uppercase truncate">{member.village} • {member.teip}</span>
                        </div>
                      </div>
                      <ChevronLeft size={16} className="rotate-180 text-gray-300" />
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* Berkat Sub-Panel */}
        {activeTab === 'hub' && showBerkat && (
          <motion.div 
            key="berkat-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+60px)] z-[95] bg-white flex flex-col rounded-t-[3rem] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <button onClick={() => setShowBerkat(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-kherch-dark">
                <X size={20} />
              </button>
              <h2 className="font-black text-xl tracking-tighter">Берк т / Возможности</h2>
              <button onClick={() => setActiveModal('berkat-form')} className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Опубл.</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20">
              <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100">
                <p className="text-[11px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                  Здесь старшие из диаспоры советуют прибывшим компании, которые реально нанимают.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { city: "Ницца, Франция", company: "Логистика и доставка", tip: "Обращайтесь прямо на склад утром в 7:00. Ищут 3 водителей.", author: "Ильяс" },
                  { city: "Страсбург, Франция", company: "Строительство / Отделка", tip: "Стройки в квартале W нанимают. Свяжитесь с компанией Z.", author: "Мансур" },
                  { city: "Берлин, Германия", company: "Безопасность / Мероприятия", tip: "Серьезная компания ищет агентов на следующий месяц. Нужен CV.", author: "Зелим" }
                ].map((job, i) => (
                  <div key={i} className="p-5 rounded-[2rem] border border-gray-100 shadow-sm bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full">{job.city}</span>
                       <span className="text-[9px] font-bold text-gray-300">от {job.author}</span>
                    </div>
                    <h4 className="font-black text-kherch-dark mb-1">{job.company}</h4>
                    <p className="text-xs text-gray-500 leading-normal">{job.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'council' && (
          <motion.div 
            key="council-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+60px)] z-[80] bg-kherch-dark text-white rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col border-t border-white/10 overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-4 flex-shrink-0" onClick={() => setActiveTab('map')}></div>
            <div className="flex-1 overflow-y-auto px-10 py-20 text-center space-y-8 scrollbar-hide">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-hearth-amber/20 blur-2xl rounded-full"></div>
                <Flame size={64} className="relative text-hearth-amber mx-auto mb-6" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Наследие</h1>
                <h2 className="text-xl font-bold text-hearth-amber/80 mb-8">Совет Старейшин</h2>
                <div className="w-16 h-1 bg-hearth-amber/30 mx-auto rounded-full mb-8"></div>
                <p className="text-lg font-medium text-vainakh-stone/60 leading-relaxed max-w-sm mx-auto">
                  Этот раздел посвящен сохранению нашего Адата и языка.
                </p>
                <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-vainakh-stone/40">Статус: В разработке</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Community Hub & Admin Ticket CTA (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 z-[70] px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] pointer-events-none">
        <div className="max-w-screen-sm mx-auto flex items-center bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-white/40 h-20 px-3 gap-3 pointer-events-auto overflow-hidden">
          {/* Hub Access Button */}
          <button 
            onClick={() => setActiveTab('hub')}
            className={`h-14 w-14 rounded-full flex flex-col items-center justify-center transition-all shrink-0 active:scale-90 ${
              activeTab === 'hub' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Users size={22} strokeWidth={2.5} />
            <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">ХАБ</span>
          </button>

          {/* Vertical Separator */}
          <div className="w-px h-10 bg-slate-100 shrink-0" />

          {/* Online Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
             <span className="text-xs font-black text-slate-800 tracking-tighter">{liveCount}</span>
          </div>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex-1 h-14 bg-kherch-dark text-vainakh-stone rounded-full flex items-center justify-center gap-2 px-5 active:scale-95 transition-all shadow-xl shadow-kherch-dark/20 min-w-0"
            aria-label="Créer une demande"
            title="Créer une demande"
          >
            <ShieldCheck size={18} strokeWidth={2.5} className="shrink-0 text-hearth-amber" />
            <span className="text-[11px] font-black uppercase tracking-widest truncate">Créer une demande</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                stopListening();
                stopAudioRecording();
                setIsTicketModalOpen(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-vainakh-stone rounded-t-[3rem] p-8 pb-[calc(env(safe-area-inset-bottom)+30px)] shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <div className="w-12 h-1.5 bg-kherch-dark/5 rounded-full mx-auto mb-6 flex-shrink-0" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-kherch-dark shadow-sm border border-black/5">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-kherch-dark tracking-tight">Demande</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Administrateur</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    stopListening();
                    stopAudioRecording();
                    setIsTicketModalOpen(false);
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-kherch-dark shadow-sm border border-black/5 active:scale-90 transition-all font-black text-xs"
                  aria-label="Закрыть"
                >
                  X
                </button>
              </div>

              <form onSubmit={submitTicket} className="flex flex-col items-center justify-center space-y-12 py-10">
                
                <div className="text-center space-y-2">
                  <div className="text-lg font-black text-kherch-dark tracking-tight">Parlez pour créer la demande</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Moins d'écriture, plus d'action</div>
                </div>

                <div className="relative">
                  {isRecordingAudio && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping scale-150" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecordingAudio) {
                        stopAudioRecording();
                        stopListening();
                      } else {
                        void startAudioRecording();
                        setTicketInputMode('voice');
                        if (!isListening) startListening();
                      }
                    }}
                    className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecordingAudio 
                        ? 'bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-105 active:scale-95' 
                        : 'bg-kherch-dark text-white shadow-2xl shadow-kherch-dark/30 active:scale-95 hover:scale-105'
                    }`}
                  >
                    {isRecordingAudio ? (
                      <Square size={48} strokeWidth={2.5} className="animate-pulse" />
                    ) : (
                      <Mic size={56} strokeWidth={2} />
                    )}
                  </button>
                </div>

                {audioUrlLocal && (
                  <div className="w-full space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <audio controls src={audioUrlLocal} className="w-full" />
                    
                    <button
                      type="submit"
                      className="w-full py-5 bg-kherch-dark text-vainakh-stone rounded-[2rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all shadow-kherch-dark/20 cursor-pointer text-sm"
                    >
                      Отправить / Envoyer
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[125] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-vainakh-stone rounded-t-[3rem] p-8 pb-[calc(env(safe-area-inset-bottom)+30px)] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-kherch-dark/5 rounded-full mx-auto mb-6 flex-shrink-0" />

              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-black/5 mt-1 shrink-0">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block mb-2">Активный Запрос</div>
                    <div className="text-2xl font-black tracking-tight leading-tight text-kherch-dark">{selectedTicket.title}</div>
                    <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                      {selectedTicket.ville}, {selectedTicket.pays}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-kherch-dark shadow-sm border border-black/5 active:scale-90 transition-all font-black text-xs shrink-0"
                  aria-label="Закрыть"
                >
                  X
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                  <div className="text-sm text-kherch-dark font-medium leading-relaxed">{selectedTicket.description}</div>
                </div>
                
                <div className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
                  Это обращение опубликовано администратором для помощи общины.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals & Profiles */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-vainakh-stone rounded-t-[3rem] p-8 pb-[calc(env(safe-area-inset-bottom)+30px)] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-kherch-dark/5 rounded-full mx-auto mb-6" />
              {activeModal === "amanat" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Package size={32} className="text-kherch-dark" />
                    <div>
                      <h2 className="text-2xl font-black text-kherch-dark">Объявить Аманат</h2>
                      <p className="text-xs font-bold text-gray-400">Личные посылки и документы</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Отправление</label>
                      <input type="text" placeholder="Напр: Брюссель" className="w-full bg-white p-4 rounded-2xl text-sm font-bold border border-black/5" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Прибытие</label>
                      <input type="text" placeholder="Напр: Грозный" className="w-full bg-white p-4 rounded-2xl text-sm font-bold border border-black/5" />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Опубликовать Аманат</button>
                </div>
              ) : activeModal === "administrative" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Gavel size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-kherch-dark">Админ. Помощь</h2>
                      <p className="text-xs font-bold text-gray-400">Сопровождение во Франции</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { title: "Запрос Азиля", desc: "SPADA, CNDA, переводы, сроки", icon: <Globe size={18} /> },
                      { title: "Карта жителя", desc: "Prefecture, renouvellement, 10 ans", icon: <Briefcase size={18} /> },
                      { title: "Social / Santé", desc: "Carte Vitale, CAF, AME/PUMA", icon: <Heart size={18} /> },
                      { title: "Составление CV", desc: "Поиск работы и интеграция", icon: <Sparkles size={18} /> }
                    ].map((item, idx) => (
                      <button key={idx} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-black/5 text-left active:scale-98 transition-all hover:border-indigo-200 group">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-indigo-900">{item.title}</h4>
                          <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Бесплатная помощь от братьев</p>
                </div>
              ) : activeModal === "perevozchik" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Truck size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-kherch-dark">Услуги перевозки</h2>
                      <p className="text-xs font-bold text-gray-400">Коммерческие грузы и почта</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Маршрут</label>
                        <input type="text" placeholder="Франция -> ЧР" className="w-full bg-white p-4 rounded-2xl text-sm font-bold border border-black/5" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Дата выезда</label>
                        <input type="text" placeholder="Напр: Каждую среду" className="w-full bg-white p-4 rounded-2xl text-sm font-bold border border-black/5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Тип ТС / Описание</label>
                      <textarea placeholder="Напр: Микроавтобус, беру посылки до 50кг..." className="w-full bg-white p-4 rounded-2xl text-sm font-bold border border-black/5 resize-none h-24" />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Опубликовать</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Heart size={32} className="text-rose-500" />
                    <h2 className="text-2xl font-black text-kherch-dark">Создание Семьи</h2>
                  </div>
                  <p className="text-xs text-kherch-dark/60 font-medium leading-relaxed bg-white/50 p-4 rounded-2xl">
                    В соответствии с <strong>Нохчалла</strong>, этот запрос конфиденциален.
                  </p>
                  <button className="w-full py-5 bg-kherch-dark text-vainakh-stone rounded-[2rem] font-black uppercase tracking-widest shadow-xl">Оставить намерение</button>
                </div>
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

      <AnimatePresence>
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

      <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
    </main>
  );
}
