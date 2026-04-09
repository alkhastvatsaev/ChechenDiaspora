"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function Admin() {
  const router = useRouter();
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoggedIn] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch members and filter for approved: false in memory
    const membersRef = ref(db, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).filter(m => m.approved === false);
        setPendingMembers(list);
      } else {
        setPendingMembers([]);
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const ticketsRef = ref(db, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setTickets(list);
      } else {
        setTickets([]);
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  const handleApprove = async (id: string, prenom: string) => {
    try {
      await update(ref(db, `members/${id}`), {
        approved: true,
        approvedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error approving:", e);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
      try {
        await remove(ref(db, `members/${id}`));
      } catch (e) {
        console.error("Error rejecting:", e);
      }
    }
  };

  const handlePublishTicket = async (id: string) => {
    try {
      await update(ref(db, `tickets/${id}`), {
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Error publishing ticket:", e);
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      await update(ref(db, `tickets/${id}`), {
        status: 'closed',
        closedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Error closing ticket:", e);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот запрос?")) {
      try {
        await remove(ref(db, `tickets/${id}`));
      } catch (e) {
        console.error("Error deleting ticket:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-black selection:text-white pb-safe">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              Кхел
            </h1>
            <p className="text-lg text-[#86868b] font-medium">Панель модерации и приема.</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-bold text-[#86868b]">
              <span className="w-2 h-2 rounded-full bg-[#34c759]"></span> В сети
            </div>
            <button 
              onClick={() => router.push('/')}
              className="px-5 py-2.5 bg-black/5 hover:bg-[#ff3b30]/10 hover:text-[#ff3b30] rounded-full text-sm font-bold transition-colors"
            >
              На карту
            </button>
          </div>
        </motion.div>

        {/* List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold tracking-tight">В ожидании</h2>
            <span className="bg-[#1d1d1f] text-white px-3 py-1 rounded-full text-sm font-bold">{pendingMembers.length}</span>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-black/5 flex flex-col items-center justify-center">
               <svg className="w-16 h-16 text-[#86868b] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <h3 className="text-xl font-bold mb-2">Все обновлено</h3>
              <p className="text-[#86868b] font-medium">Новых заявок на вступление нет.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.01]">
                  
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-14 h-14 shrink-0 bg-[#fbfbfd] rounded-full flex items-center justify-center text-lg font-bold text-[#1d1d1f] border border-black/5">
                      {member.prenom?.[0]}{member.nom?.[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 tracking-tight">{member.prenom} {member.nom}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-1 text-sm font-medium text-[#86868b]">
                        <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {member.age} лет</span>
                        <span>•</span>
                        <span>{member.profession}</span>
                        <span>•</span>
                        <span className="text-[#1d1d1f] font-bold">{member.ville}</span>
                      </div>
                      <div className="mt-2 text-xs font-bold text-[#86868b] uppercase tracking-wider">
                        Тейп {member.teip} — Родом из {member.village}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-black/5">
                    <button 
                      onClick={() => handleReject(member.id)}
                      className="flex-1 md:flex-none w-12 h-12 flex items-center justify-center bg-[#fbfbfd] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white rounded-full transition-colors shrink-0"
                      title="Отклонить"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button 
                      onClick={() => handleApprove(member.id, member.prenom)}
                      className="flex-1 md:flex-none px-6 h-12 bg-[#1d1d1f] text-white hover:bg-black rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shrink-0"
                    >
                      <span>Принять</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold tracking-tight">Запросы</h2>
            <span className="bg-[#1d1d1f] text-white px-3 py-1 rounded-full text-sm font-bold">{tickets.filter(t => t.status !== 'closed').length}</span>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-black/5 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-2">Пусто</h3>
              <p className="text-[#86868b] font-medium">Запросов пока нет.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tickets.map((t) => (
                <div key={t.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#86868b] uppercase tracking-widest">
                        {t.status === 'published' ? 'Опубликовано' : t.status === 'closed' ? 'Закрыто' : 'Новый запрос'}
                      </div>
                      <div className="text-2xl font-bold tracking-tight mt-2">{t.title || 'Без названия'}</div>
                      <div className="text-sm text-[#86868b] font-medium mt-2">
                        {t.ville || '—'}, {t.pays || '—'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteTicket(t.id)}
                        className="w-12 h-12 flex items-center justify-center bg-[#fbfbfd] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white rounded-full transition-colors shrink-0"
                        title="Удалить"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      {t.status !== 'published' && t.status !== 'closed' && (
                        <button
                          onClick={() => handlePublishTicket(t.id)}
                          className="px-6 h-12 bg-[#1d1d1f] text-white hover:bg-black rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shrink-0"
                          title="Опубликовать"
                        >
                          Опубликовать
                        </button>
                      )}
                      {t.status === 'published' && (
                        <button
                          onClick={() => handleCloseTicket(t.id)}
                          className="px-6 h-12 bg-black/5 hover:bg-black/10 text-[#1d1d1f] rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
                          title="Закрыть"
                        >
                          Закрыть
                        </button>
                      )}
                    </div>
                  </div>

                  {t.description && (
                    <div className="text-sm text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
                      {t.description}
                    </div>
                  )}

                  {t.audioUrl && (
                    <div className="bg-[#fbfbfd] rounded-2xl p-4 border border-black/5">
                      <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Голосовое сообщение</div>
                      <audio controls src={t.audioUrl} className="w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>


      </div>
    </div>
  );
}
