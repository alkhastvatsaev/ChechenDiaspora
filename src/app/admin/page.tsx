"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { ArrowLeft, Check, X, UserCheck, ShieldAlert, Lock, LogOut } from 'lucide-react';

export default function Admin() {
  const router = useRouter();
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'chechnyalive') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
  };

  const handleApprove = async (id: string) => {
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
    if (window.confirm("Удалить эту заявку?")) {
      try {
        await remove(ref(db, `members/${id}`));
      } catch (e) {
        console.error("Error rejecting:", e);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-apple-light flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 border border-black/5 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-chechen-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-chechen-blue" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Вход в панель</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Только для администраторов</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <input 
                type="password" 
                placeholder="Введите пароль..."
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-chechen-blue/20 focus:border-chechen-blue/30 transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-bold pl-2 pt-1">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-chechen-blue text-white rounded-2xl font-black shadow-lg shadow-chechen-blue/20 active:scale-95 transition-all"
            >
              Войти
            </button>
          </form>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest pt-2"
          >
            Вернуться на карту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-apple-light p-4 pt-safe-top md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2.5 hover:bg-white rounded-full transition-all border border-transparent hover:border-black/5 hover:shadow-sm">
              <ArrowLeft size={24} className="text-gray-800" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Панель администратора</h1>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Новые заявки ({pendingMembers.length})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex p-2 bg-chechen-blue/10 text-chechen-blue rounded-xl px-4 py-2 text-sm font-bold items-center gap-2 border border-chechen-blue/5">
              <UserCheck size={18} /> Admin Access
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-transparent"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Pending List */}
        {pendingMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-black/5 space-y-3 animate-scale-in">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-black/[0.03]">
              <Check size={36} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Заявок пока нет!</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Все новые лица уже проверены и добавлены на карту.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-slide-up">
            {pendingMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex items-center gap-5 w-full">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400 border border-black/[0.03]">
                    {member.prenom?.[0]}{member.nom?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold">{member.prenom} {member.nom}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-gray-100/50 px-3 py-1 rounded-full text-xs font-bold text-gray-600 border border-black/[0.03] uppercase tracking-tighter">{member.age} лет</span>
                      <span className="bg-gray-100/50 px-3 py-1 rounded-full text-xs font-bold text-gray-600 border border-black/[0.03] uppercase tracking-tighter">{member.village} ({member.teip})</span>
                      <span className="bg-chechen-blue/5 text-chechen-blue px-3 py-1 rounded-full text-xs font-bold border border-chechen-blue/10 uppercase tracking-tighter">{member.ville}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-50">
                  <button 
                    onClick={() => handleReject(member.id)}
                    className="flex-1 md:flex-none p-3.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-bold flex items-center justify-center gap-2 ring-1 ring-red-100"
                  >
                    <X size={20} /> <span className="md:hidden">Отклонить</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(member.id)}
                    className="flex-1 md:flex-none p-4 px-10 bg-chechen-blue text-white hover:bg-opacity-90 rounded-2xl shadow-lg shadow-chechen-blue/20 transition-all font-extrabold flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check size={20} /> <span className="">Одобрить</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
