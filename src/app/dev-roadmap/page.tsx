"use client";

import { motion } from 'framer-motion';
import { 
  Flame, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Globe, 
  Briefcase, 
  Gavel, 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Timer,
  ArrowRight,
  Code2,
  Database
} from 'lucide-react';
import Link from 'next/link';

const PILLARS = [
  {
    id: "trust",
    title: "Système de Vouching",
    status: "Logique Connectée",
    progress: 60,
    icon: <ShieldCheck className="text-amber-500" size={24} />,
    tasks: [
      "Architecture de données (vouchedBy array) - TERMINÉ",
      "Logique de vote (handleVouch) - TERMINÉ",
      "Interface de profil avec bouton Vouch - TERMINÉ",
      "Badge d'honneur pour les membres multi-vouchés"
    ]
  },
  {
    id: "ancestral",
    title: "Connexion Ancestrale",
    status: "Filtres Actifs",
    progress: 50,
    icon: <Globe className="text-blue-500" size={24} />,
    tasks: [
      "Filtre par Teip (Clan) - TERMINÉ",
      "Filtre par Village d'origine - TERMINÉ",
      "Hubs de village (mini-communautés par terroir)",
      "Intégration sur la carte interactive"
    ]
  },
  {
    id: "legal",
    title: "Bouclier Juridique",
    status: "Contexte Intégré",
    progress: 25,
    icon: <Gavel className="text-rose-500" size={24} />,
    tasks: [
      "Annuaire des avocats spécialisés (Asile/Interpol)",
      "Bouton d'urgence administrative",
      "Base de connaissances (fiches pratiques par pays)",
      "Traducteurs assermentés vérifiés"
    ]
  },
  {
    id: "mentorship",
    title: "Mentorat & Excellence",
    status: "Bouton Activé",
    progress: 20,
    icon: <Database className="text-emerald-500" size={24} />,
    tasks: [
      "Profil Mentor (compétences, dispo)",
      "Mise en relation sécurisée",
      "Suivi des réussites de la jeunesse",
      "Webinaires de carrière internes"
    ]
  },
  {
    id: "economy",
    title: "Solidarité Économique",
    status: "Partiellement Opérationnel",
    progress: 40,
    icon: <Briefcase className="text-indigo-500" size={24} />,
    tasks: [
      "Répertoire des entreprises de la diaspora",
      "Offres d'emploi exclusives à la communauté",
      "Système de caution par les frères (Logement)",
      "Partenariats commerciaux internes"
    ]
  },
  {
    id: "pwa",
    title: "PWA Core & Architecture",
    status: "Opérationnel",
    progress: 90,
    icon: <Flame className="text-orange-500" size={24} />,
    tasks: [
      "Synchronisation Firebase Temps Réel",
      "Mode Hors-ligne (PWA)",
      "Sécurité par Passphrase Communautaire",
      "Design System Glassmorphism (Apple-style)"
    ]
  }
];

export default function DevRoadmap() {
  return (
    <div className="min-h-screen bg-kherch-dark text-vainakh-stone p-6 pb-20 font-sans">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto pt-12 mb-12"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-hearth-glow/20 rounded-2xl flex items-center justify-center border border-hearth-glow/30">
            <Terminal className="text-hearth-glow" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Console de Développement</h1>
            <p className="text-sm text-vainakh-stone/40 font-bold uppercase tracking-widest mt-2">Diaspora Hub / Mission Control</p>
          </div>
        </div>

        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
           <h2 className="text-lg font-bold text-hearth-amber mb-2 italic">« Détruire le stigmate par l'excellence. »</h2>
           <p className="text-sm text-vainakh-stone/60 leading-relaxed">
             Cette console trace l'évolution technique de l'infrastructure numérique de la diaspora. Chaque fonctionnalité est conçue pour le levier communautaire.
           </p>
        </div>
      </motion.div>

      {/* Grid Pillars */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {PILLARS.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               {pillar.icon}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">{pillar.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {pillar.progress === 100 ? (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  ) : pillar.progress === 0 ? (
                    <Circle size={12} className="text-white/20" />
                  ) : (
                    <Timer size={12} className="text-amber-500 animate-pulse" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{pillar.status}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${pillar.progress}%` }}
                 className="h-full bg-gradient-to-r from-chechen-blue to-hearth-glow"
               />
            </div>

            <ul className="space-y-3">
              {pillar.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-white/10 rounded-full mt-1.5 shrink-0" />
                  <span className="text-xs text-vainakh-stone/60 font-medium leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Navigation Return */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-sm font-black uppercase tracking-widest transition-all">
          Retour au Hub <ArrowRight size={16} />
        </Link>
      </div>

      {/* Technical Footer */}
      <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Database size={12} /> Database Schema
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed font-mono">
            RTDB: /members/[id]<br />
            Firestore: /members/[id]<br />
            Vouches: Array&lt;userId&gt;
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Terminal size={12} /> Tech Stack
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed font-mono">
            Next.js 15+ (App Router)<br />
            Firebase 11+<br />
            Framer Motion (Anim)
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-hearth-glow tracking-widest">
            <Code2 size={12} /> Project Mission
          </div>
          <p className="text-[11px] text-vainakh-stone/40 leading-relaxed italic">
            "High Leverage, Community Driven, Expert Visibility."
          </p>
        </div>
      </div>
    </div>
  );
}
