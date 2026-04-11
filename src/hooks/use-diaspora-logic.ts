import { useState, useEffect, useMemo, useRef } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, firestore, storage } from '@/lib/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Member, TicketItem, ActiveTab, ActiveModal } from '@/types/diaspora';

const sampleExperts: Member[] = [
  { id: 'S1', prenom: "Зелимхан", nom: "Базаров", profession: "Юрист / Право убежища", isLegalDefender: true, vouchCount: 12, ville: "Страсбург", pays: "Франция", village: "Шали", teip: "Шолой", lat: 48.5734, lng: 7.7521, isLive: true, approved: true, message: "Готов помочь братьям юридически.", hasStory: true, storyContent: { type: 'berkat', title: 'Срочная помощь', text: 'Нужен переводчик для семьи в Страсбурге на завтра. Кто свободен?', date: '2ч назад' } },
  { id: 'S20', prenom: "Аминат", nom: "И.", profession: "Социальный наставник", isSocialHelper: true, vouchCount: 56, ville: "Страсбург", pays: "Франция", village: "Гехи", teip: "Гехой", lat: 48.5839, lng: 7.7455, isLive: true, approved: true, message: "Помощь с оформлением документов (Asile, CAF, CPAM)." },
  { id: 'S21', prenom: "Малика", nom: "Л.", profession: "Административный эксперт", isSocialHelper: true, vouchCount: 42, ville: "Париж", pays: "Франция", village: "Ведено", teip: "Белтой", lat: 48.8566, lng: 2.3522, isLive: true, approved: true, message: "Сопровождение новых семей." },
  { id: 'S30', prenom: "Ибрагим", nom: "К.", profession: "Адвокат по уголовным делам", isLegalDefender: true, vouchCount: 89, ville: "Ницца", pays: "Франция", village: "Чечен-Аул", teip: "Гунхой", lat: 43.7102, lng: 7.2620, isLive: true, approved: true },
  { id: 'S31', prenom: "Мухаммад", nom: "Т.", profession: "Юрист (Бизнес / Налоги)", isSocialHelper: true, vouchCount: 15, ville: "Лион", pays: "Франция", village: "Аргун", teip: "Мержой", lat: 45.7640, lng: 4.8357, isLive: true, approved: true },
  { id: 'S32', prenom: "Турпал", nom: "Ш.", profession: "Присяжный переводчик (FR/RU/CH)", isTranslator: true, vouchCount: 34, ville: "Брюссель", pays: "Бельгия", village: "Ачхой-Мартан", teip: "Валорой", lat: 50.8503, lng: 4.3517, isLive: true, approved: true },
  { id: 'S33', prenom: "Хава", nom: "Б.", profession: "Переводчик / Соц. гид", isTranslator: true, isSocialHelper: true, vouchCount: 22, ville: "Вена", pays: "Австрия", village: "Курчалой", teip: "Курчалой", lat: 48.2082, lng: 16.3738, isLive: true, approved: true },
  { id: 'S10', prenom: "Муса", nom: "Ахматов", profession: "Автосервис / Ремонт", isBusiness: true, businessName: "Vainakh Auto Shop", businessDescription: "Профессиональный ремонт BMW/Audi.", vouchCount: 45, ville: "Париж", pays: "Франция", village: "Валерик", teip: "Валорой", lat: 48.8566, lng: 2.3522, isLive: true, approved: true },
  { id: 'S11', prenom: "Байсангур", nom: "Б.", profession: "Грузоперевозки / EU", isBusiness: true, businessName: "Vainakh Logistics", businessDescription: "Доставка грузов по всей Европе.", vouchCount: 28, ville: "Брюссель", pays: "Бельгия", village: "Шатой", teip: "Шатой", lat: 50.8503, lng: 4.3517, isLive: true, approved: true },
  { id: 'S12', prenom: "Ахмед", nom: "Д.", profession: "ИТ-Консалтинг", isBusiness: true, businessName: "Vainakh Tech", vouchCount: 19, ville: "Берлин", pays: "Германия", village: "Гехи", teip: "Гехой", lat: 52.5200, lng: 13.4050, isLive: true, approved: true }
];

export function useDiasporaLogic() {
  const { user, loading, communityMember } = useAuth();
  
  // -- UI States --
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
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

  // -- First Time User Logic --
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeen = localStorage.getItem('vainakh_has_seen_manifesto');
    if (!hasSeen) {
      setActiveTab('council');
      localStorage.setItem('vainakh_has_seen_manifesto', 'true');
    }
  }, []);
  
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
      const mergedFromDB = Array.from(dataMap.values()).filter(m => m.approved !== false);
      
      // Starting list: Sample Experts
      let final: Member[] = [...sampleExperts];
      
      // Merge logic with deduplication by Name + City
      mergedFromDB.forEach(dbMember => {
        const fullName = `${dbMember.prenom}${dbMember.nom || ''}`.toLowerCase();
        
        // Check if this person already exists in 'final' (either in sample or added previously)
        const duplicateIdx = final.findIndex(m => 
          (`${m.prenom}${m.nom || ''}`.toLowerCase() === fullName) && 
          (m.ville === dbMember.ville)
        );

        if (duplicateIdx >= 0) {
          // Update existing with fresh DB data
          final[duplicateIdx] = { ...final[duplicateIdx], ...dbMember };
        } else {
          final.push(dbMember);
        }
      });

      travelers.forEach(t => { 
        const isPresent = final.find(m => m.id === t.id);
        if (!isPresent) final.push(t); 
      });
      
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

  // -- Audio / Transcription Engine (WhatsApp-Style) --
  const [ticketInputMode, setTicketInputMode] = useState<'voice' | 'text'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // -- Transcription Logic --
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setFinalTranscript(prev => prev + event.results[i][0].transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interim);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        setAudioChunks(chunks);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setIsListening(true);
      if (recognitionRef.current) recognitionRef.current.start();
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    setIsListening(false);
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setAudioChunks([]);
    setFinalTranscript('');
    setInterimTranscript('');
  };

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
        if (selectedExpertType === 'isSocialHelper' && !m.isSocialHelper) return false;
        if (selectedExpertType === 'isBusiness' && !m.isBusiness) return false;
        if (selectedExpertType === 'juriste' && !m.profession?.toLowerCase().includes('юрист')) return false;
      }
      const fullName = `${m.prenom} ${m.nom ?? ''}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || m.profession?.toLowerCase().includes(query) || m.teip?.toLowerCase().includes(query);
    });
  }, [members, searchQuery, selectedExpertType]);

  const submitTicket = async () => {
    if (!user) return;
    
    const content = finalTranscript || ticketDraft.description;
    if (!content) return;

    const newTicket: any = {
      ...ticketDraft,
      description: content,
      authorId: user.uid,
      authorName: (communityMember as any)?.prenom || "Аноним",
      createdAt: Date.now(),
      status: 'published',
      ville: ticketDraft.ville || (communityMember as any)?.ville || "",
      pays: ticketDraft.pays || (communityMember as any)?.pays || "Франция",
      hasAudio: !!audioUrl
    };

    try {
      const ticketsRef = ref(db, 'tickets');
      const newTicketRef = push(ticketsRef);
      await set(newTicketRef, newTicket);
      
      setMembers(prev => prev.map(m => 
        m.id === user.uid ? { ...m, hasActiveTicket: true, lastTicketId: newTicketRef.key } : m
      ));

      setTicketDraft({ title: '', description: '', category: 'administrative', ville: '', pays: 'Франция', isEmergency: false });
      resetAudio();
      setActiveModal(null);
    } catch (e) {
      console.error("Ticket submission failed", e);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!user) return;
    try {
      await set(ref(db, `tickets/${ticketId}`), null);
      
      // Update local member state
      setMembers(prev => prev.map(m => 
        m.id === user.uid ? { ...m, hasActiveTicket: false, lastTicketId: null } : m
      ));
    } catch (e) {
      console.error("Failed to delete ticket", e);
    }
  };

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
    ticketDraft, setTicketDraft, submitTicket,
    isListening, setIsListening, ticketInputMode, setTicketInputMode,
    finalTranscript, setFinalTranscript, interimTranscript,
    isRecording, startRecording, stopRecording, audioUrl, resetAudio,
    deleteTicket
  };
}
