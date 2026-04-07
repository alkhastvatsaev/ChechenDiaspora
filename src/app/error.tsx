"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-kherch-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      
      <h2 className="text-2xl font-black text-white tracking-tighter mb-2 italic">ГIалат даьлла / Erreur Système</h2>
      <p className="text-vainakh-stone/60 text-sm max-w-sm mb-8 font-medium leading-relaxed">
        Une erreur critique est survenue lors du chargement de l'interface. Cela arrive souvent lors d'un conflit entre le serveur et ton navigateur.
      </p>

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-8 text-left overflow-hidden">
        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Détails Techniques (Fatale)</p>
        <code className="text-[10px] text-vainakh-stone/80 font-mono break-all line-clamp-4">
          {error.message || "Erreur inconnue (Probablement SSR Hydration)"}
        </code>
        {error.digest && (
          <p className="text-[10px] text-vainakh-stone/30 mt-2 font-mono">Digest: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={() => reset()}
          className="w-full bg-white text-kherch-dark font-black py-4 rounded-xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
        >
          Réessayer le chargement
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-transparent border border-white/10 text-vainakh-stone/60 font-black py-4 rounded-xl hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
        >
          Retour à l'accueil
        </button>
      </div>
      
      <p className="mt-12 text-[10px] font-black text-vainakh-stone/20 uppercase tracking-[0.3em]">Вайнах Соверен Систем</p>
    </div>
  );
}
