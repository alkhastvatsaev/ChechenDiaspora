"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function LeSeuil() {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const { loginWithPassphrase, user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    const success = await loginWithPassphrase(passphrase);
    if (success) {
      setIsOpening(true);
      // Wait for animation before pushing to main hub
      setTimeout(() => {
        router.push('/');
      }, 1500); 
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-kherch-dark flex items-center justify-center" />;

  return (
    <div className="min-h-screen bg-kherch-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-hearth-amber/20 via-kherch-dark to-black" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <AnimatePresence>
        {!isOpening ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="z-10 w-full max-w-md px-6 flex flex-col items-center"
          >
            {/* Logo / Symbol */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
                Вайнах
              </h1>
            </div>

            <div className="text-center space-y-3 mb-10">
              <p className="text-hearth-amber/80 text-sm tracking-widest uppercase font-bold">
                Марша догIийла, Ваша
              </p>
              <p className="text-vainakh-stone/60 text-xs mt-2 italic">
                Дом гостя. Здесь ты никогда не будешь один.
              </p>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="relative">
                <input
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="ГIап (Пароль)"
                  className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} text-vainakh-stone placeholder:text-vainakh-stone/30 px-6 py-4 rounded-2xl outline-none focus:border-hearth-amber/50 focus:ring-1 focus:ring-hearth-amber/50 transition-all font-mono text-center tracking-widest backdrop-blur-md`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-vainakh-stone/30 hover:text-hearth-amber transition-colors"
                >
                  {showPassphrase ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs font-bold"
                  >
                    Харц ду (Неверный пароль)
                  </motion.p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full bg-hearth-amber/20 hover:bg-hearth-amber/30 border border-hearth-amber/30 text-hearth-amber font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.1)] hover:shadow-[0_0_30px_rgba(217,119,6,0.2)] active:scale-95 uppercase tracking-widest text-sm"
              >
                Войти
              </button>
              
              {/* Quick Dev Login */}
              {process.env.NODE_ENV === 'development' && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPassphrase('вайнах');
                      // Wait a bit just to see the value populate before submit
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }, 100);
                    }}
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-hearth-amber/60 p-2 transition-colors"
                  >
                    🚀 FAST DEV LOGIN (вайнах)
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-kherch-dark flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-hearth-amber flex flex-col items-center gap-6"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" style={{ fontFamily: 'Arial, sans-serif' }}>
                Вайнах
              </h1>
              <p className="text-xl tracking-widest text-white/80 drop-shadow-md font-medium">
                Маршалла хуьлда...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
