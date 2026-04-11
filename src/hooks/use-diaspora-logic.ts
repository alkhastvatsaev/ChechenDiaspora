import { useState, useEffect, useMemo, useRef } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, firestore, storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Member, TicketItem, ActiveTab, ActiveModal } from '@/types/diaspora';

const sampleExperts: Member[] = [
  { id: 'S1', prenom: "Аслан", nom: "Базаров", profession: "Юрист / Право убежища", isLegalDefender: true, vouchCount: 12, ville: "Страсбург", pays: "Франция", village: "Шали", teip: "Шолой", lat: 48.5734, lng: 7.7521, isLive: true, approved: true, message: "Готов помочь братьям юридически.", hasStory: true, storyContent: { type: 'berkat', title: 'Срочная помощь', text: 'Нужен переводчик для семьи в Страсбурге на завтра. Кто свободен?', date: '2ч назад' } },
  { id: 'S20', prenom: "Марина", nom: "И.", profession: "Социальный наставник", isSocialHelper: true, vouchCount: 56, ville: "Страсбург", pays: "Франция", village: "Гехи", teip: "Гехой", lat: 48.5839, lng: 7.7455, isLive: true, approved: true, message: "Помощь с оформлением документов (Asile, CAF, CPAM). Знаю администрацию наизусть." },
  { id: 'S21', prenom: "Зарема", nom: "Л.", profession: "Административный эксперт", isSocialHelper: true, vouchCount: 42, ville: "Париж", pays: "Франция", village: "Ведено", teip: "Белтой", lat: 48.8566, lng: 2.3522, isLive: true, approved: true, message: "Сопровождение новых семей. Запись в школы, медицинская страховка, интеграция." },
  { id: 'S2', prenom: "Зелим", nom: "Умаров", profession: "Инженер ПО", vouchCount: 5, ville: "Берлин", pays: "Германия", village: "Гехи", teip: "Гехой", lat: 52.5200, lng: 13.4050, isLive: false, openToMentorship: true, approved: true, message: "Могу стать наставником в IT." },
  { id: 'S10', prenom: "Муса", nom: "Ахматов", profession: "Автосервис / Ремонт", isBusiness: true, businessName: "Vainakh Auto Shop", businessDescription: "Профессиональный ремонт BMW/Audi. Своим скидки.", vouchCount: 45, ville: "Париж", pays: "Франция", village: "Валерик", teip: "Валорой", lat: 48.8566, lng: 2.3522, isLive: true, approved: true },
  { id: 'S11', prenom: "Тимур", nom: "Бокаев", profession: "Грузоперевозки / EU", isBusiness: true, businessName: "Bokaev Logistics", businessDescription: "Доставка грузов по всей Европе. Надежно и быстро.", vouchCount: 28, ville: "Брюссель", pays: "Бельгия", village: "Шатой", teip: "Шатой", lat: 50.8503, lng: 4.3517, isLive: true, approved: true },
  { id: 'S3', prenom: "Амина", nom: "Исаева", profession: "Присяжный переводчик", isTranslator: true, ville: "Вена", pays: "Австрия", village: "Ведено", teip: "Белтой", lat: 48.2082, lng: 16.3738, isLive: true, approved: true, message: "Перевод: Арабский/Немецкий/Французский.", hasStory: true, storyContent: { type: 'heritage', title: 'Урок языка', text: 'Сегодня разбираем тему Адатов в нашем культурном центре.', date: '30м назад' } }
];

export function useDiasporaLogic() {
  const { user, loading, communityMember } = useAuth();
  
  // -- UI States --
  const [activeTab, setActiveTab] = useState<ActiveTab>('council');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedStoryMember, setSelectedStoryMember] = useState<Member | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  
  // -- Filter States --
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeip, setSelectedTeip] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedExpertType, setSelectedExpertType] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // -- Data States --
  const [members, setMembers] = useState<Member[]>([]);
  const [publishedTickets, setPublishedTickets] = useState<TicketItem[]>([]);
  
  // -- Voice & Audio Stats --
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
  const audioChunksRef = useRef<any[]>([]);

  const [ticketDraft, setTicketDraft] = useState<Partial<TicketItem>>({
    title: '',
    description: '',
    category: 'administrative',
    ville: '',
    pays: 'Франция',
    isEmergency: false,
  });

  // -- Data Sync (Firebase) --
  useEffect(() => {
    const travelers = [
      { 
        id: 'V1', 
        prenom: "Вадик", 
        isTraveling: true, 
        lat: 48.5734, 
        lng: 7.7521, 
        approved: true,
        routePoints: [
          [48.5734, 7.7521],   // Strasbourg
          [48.1351, 11.5820],  // Munich
          [48.2082, 16.3738],  // Vienna
          [47.4979, 19.0402],  // Budapest
          [44.8125, 20.4612],  // Belgrade
          [42.6977, 23.3219],  // Sofia
          [41.0082, 28.9784],  // Istanbul
          [41.2867, 36.33],    // Samsun
          [41.6168, 41.6367],  // Batumi
          [41.7151, 44.8271],  // Tbilisi
          [43.0246, 44.6817],  // Vladikavkaz
          [43.318, 45.694]     // Grozny
        ]
      }
    ] as Member[];

    const dataMap = new Map<string, Member>();
    const updateMembers = () => {
      const merged = Array.from(dataMap.values()).filter(m => m.approved !== false);
      let final: Member[] = [];
      if (merged.length === 0) {
        final = [...sampleExperts, ...travelers];
      } else {
        final = [...merged];
        travelers.forEach(t => { if (!final.find(m => m.id === t.id)) final.push(t); });
      }
      setMembers(final);
      
      // PERSIST FOR OFFLINE USE
      if (typeof window !== 'undefined' && final.length > travelers.length) {
        localStorage.setItem('vainakh_cached_members', JSON.stringify(final));
      }
    };

    // HYDRATE FROM CACHE
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('vainakh_cached_members');
      if (cached) {
        try { setMembers(JSON.parse(cached)); } catch {}
      }
    }

    const unsubRTDB = onValue(ref(db, 'members'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(([key, val]: [string, any]) => { dataMap.set(key, { id: key, ...val }); });
        updateMembers();
      }
    }, (error) => {
      console.warn("RTDB Members Listen Error (Permissions):", error.message);
    });

    const unsubTickets = onValue(ref(db, 'tickets'), (snapshot) => {
      const data = snapshot.val();
      if (!data) return setPublishedTickets([]);
      const list: TicketItem[] = Object.entries(data)
        .map(([id, v]: [string, any]) => ({ id, ...v }))
        .filter(t => t.status === 'published')
        .sort((a, b) => b.createdAt - a.createdAt);
      setPublishedTickets(list);
    }, (error) => {
      console.warn("RTDB Tickets Listen Error (Permissions):", error.message);
    });

    let unsubFirestore: any;
    try {
      const q = query(collection(firestore, 'members'), where('approved', '==', true));
      unsubFirestore = onSnapshot(q, 
        (snapshot) => {
          snapshot.forEach((doc) => { dataMap.set(doc.id, { id: doc.id, ...doc.data() } as Member); });
          updateMembers();
        },
        (error) => {
          console.warn("Firestore Members Listen Error (Permissions):", error.message);
        }
      );
    } catch (e) {
      console.error("Firestore Setup Error:", e);
    }

    return () => { unsubRTDB(); unsubTickets(); if (unsubFirestore) unsubFirestore(); };
  }, []);

  // -- Voice Logic --
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionCtor);
    
    if (SpeechRecognitionCtor) {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = 'ru-RU';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        let interim = '';
        let finalAdd = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalAdd += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (finalAdd) setFinalTranscript(p => p ? `${p} ${finalAdd}` : finalAdd);
        setInterimTranscript(interim);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // -- Actions --
  const handleVouch = async (memberId: string) => {
    if (!communityMember) return;
    try {
      const mRef = ref(db, `members/${memberId}`);
      const snap = await get(mRef);
      if (snap.exists()) {
        const d = snap.val();
        const vouches = d.vouchedBy || [];
        if (vouches.includes(user?.uid)) return;
        await set(mRef, { ...d, vouchedBy: [...vouches, user?.uid], vouchCount: vouches.length + 1 });
      }
    } catch {}
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (selectedExpertType) {
        if (selectedExpertType === 'isLegalDefender' && !m.isLegalDefender) return false;
        if (selectedExpertType === 'isTranslator' && !m.isTranslator) return false;
      }
      const fullName = `${m.prenom} ${m.nom ?? ''}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || m.profession?.toLowerCase().includes(query) || m.teip?.toLowerCase().includes(query);
    });
  }, [members, searchQuery, selectedExpertType]);

  return {
    user, loading, communityMember,
    activeTab, setActiveTab, activeModal, setActiveModal,
    searchQuery, setSearchQuery, selectedTeip, setSelectedTeip,
    selectedVillage, setSelectedVillage, selectedProfession, setSelectedProfession,
    selectedExpertType, setSelectedExpertType, isSearchFocused, setIsSearchFocused,
    members, filteredMembers, publishedTickets, liveCount: members.length + 3,
    selectedMember, setSelectedMember, selectedStoryMember, setSelectedStoryMember,
    mapCenter, setMapCenter,
    handleVouch,
    ticketDraft, setTicketDraft, submitTicket: () => {} // Implement full logic later
  };
}
