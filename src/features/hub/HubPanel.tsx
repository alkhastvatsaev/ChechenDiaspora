import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShieldCheck, Globe, GraduationCap, Briefcase, Info } from 'lucide-react';
import { Member } from '@/types/diaspora';
import WisdomCard from '@/components/WisdomCard';

interface HubPanelProps {
  isVisible: boolean;
  onClose: () => void;
  logic: any; // Type-safety: using any for the large logic object for now, will refine later
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filteredMembers: Member[];
  onMemberClick: (m: Member) => void;
  selectedTeip: string;
  setSelectedTeip: (t: string) => void;
  selectedVillage: string;
  setSelectedVillage: (v: string) => void;
}

export function HubPanel({ 
  isVisible, onClose, logic, searchQuery, setSearchQuery, 
  filteredMembers, onMemberClick,
  selectedTeip, setSelectedTeip,
  selectedVillage, setSelectedVillage 
}: HubPanelProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+60px)] z-[80] glass-premium rounded-t-hero shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Кхерч / Хаб</h1>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mt-1">Plateforme Régalienne • Diaspora Hub</p>
            </div>
            <button 
              onClick={onClose}
              className="w-11 h-11 bg-bg-secondary rounded-full flex items-center justify-center border border-black/[0.05] tap-haptic"
            >
              <X size={22} className="text-text-primary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-[calc(env(safe-area-inset-bottom)+120px)] space-y-8 scrollbar-hide">
            
            {/* Context Layer */}
            <div className="pt-4">
              <WisdomCard />
            </div>

            {/* Global Search Bar */}
            <div className="sticky top-0 z-20 pt-2 pb-4 mr-[-24px] pr-[24px]">
               <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary group-focus-within:text-brand-blue transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un membre, un métier, un lieu..."
                  className="w-full bg-white rounded-2xl py-5 pl-12 pr-6 text-[15px] font-bold border border-black/[0.08] shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all placeholder:text-text-tertiary"
                />
              </div>
            </div>

            {/* Main Expert Hub Filters */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary px-1">Expertise & Entraide</h3>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
                {[
                  { id: 'isLegalDefender', label: 'Bouclier Juridique', icon: <ShieldCheck size={14} /> },
                  { id: 'openToMentorship', label: 'Mentorats', icon: <GraduationCap size={14} /> },
                  { id: 'isTranslator', label: 'Traducteurs', icon: <Info size={14} /> },
                  { id: 'isBusiness', label: 'Entreprises', icon: <Briefcase size={14} /> }
                ].map((chip) => (
                  <button 
                    key={chip.id}
                    onClick={() => logic.setSelectedExpertType(logic.selectedExpertType === chip.id ? null : chip.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-[13px] font-black tracking-tight transition-all shrink-0 border-2 ${
                      logic.selectedExpertType === chip.id 
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xl scale-105' 
                      : 'bg-white text-text-primary border-black/[0.05] shadow-sm'
                    }`}
                  >
                    {chip.icon}
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ancestral Navigation */}
            <div className="space-y-6">
               <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Filtre par Teip (Clan)</h3>
                  {selectedTeip && (
                    <button onClick={() => setSelectedTeip('')} className="text-[10px] font-bold text-brand-blue uppercase">Annuler</button>
                  )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                  {['Беной', 'Гендаргеной', 'Билтой', 'Энганой', 'Шолой'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setSelectedTeip(selectedTeip === t ? '' : t)}
                      className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shrink-0 border-1.5 ${
                        selectedTeip === t ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-text-primary border-black/[0.08]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Village d&apos;origine</h3>
                  {selectedVillage && (
                    <button onClick={() => setSelectedVillage('')} className="text-[10px] font-bold text-success uppercase">Annuler</button>
                  )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                  {['Гехи', 'Шали', 'Шатой', 'Ведено', 'Гудермес'].map((v) => (
                    <button 
                      key={v}
                      onClick={() => setSelectedVillage(selectedVillage === v ? '' : v)}
                      className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shrink-0 ${
                        selectedVillage === v ? 'bg-success text-white shadow-lg' : 'nav-pill-inactive'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary px-1">
                {searchQuery || selectedTeip || selectedVillage ? 'Résultats trouvés' : 'Membres en Vedette'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {filteredMembers.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => onMemberClick(m)}
                    className="flex items-center gap-4 p-5 card-premium text-left group hover:scale-[1.01] overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-blue-soft rounded-2xl flex items-center justify-center text-brand-blue relative shrink-0">
                      <span className="text-xl font-black">{m.prenom[0]}</span>
                      {m.isLive && (
                        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white ring-2 ring-success/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[17px] font-black text-text-primary leading-tight flex items-center gap-2">
                        {m.prenom} {m.nom}
                        {m.vouchCount && m.vouchCount > 5 && <ShieldCheck size={14} className="text-brand-blue" />}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[12px] font-bold text-text-secondary line-clamp-1">{m.profession}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 opacity-60">
                         <Globe size={10} />
                         <span className="text-[10px] font-bold uppercase tracking-wider">{m.ville}, {m.pays}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
