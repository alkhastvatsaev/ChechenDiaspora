import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldAlert, Heart, Briefcase, GraduationCap, Package, Terminal, BookOpen, MessageCircle, Gavel, Globe } from 'lucide-react';
import { ActiveModal } from '@/types/diaspora';

interface ModalRegistryProps {
  activeModal: ActiveModal;
  onClose: () => void;
}

export function ModalRegistry({ activeModal, onClose }: ModalRegistryProps) {
  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" 
        />
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
          className="relative w-full max-w-lg glass-premium rounded-t-hero p-8 pb-[calc(env(safe-area-inset-bottom)+30px)] shadow-2xl pointer-events-auto"
        >
          <div className="w-10 h-1 bg-black/5 rounded-full mx-auto mb-6" />
          
          {activeModal === 'administrative' && (
            <div className="space-y-6 animate-fade">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue-soft rounded-2xl flex items-center justify-center text-brand-blue">
                    <Gavel size={26} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">Bouclier Juridique</h2>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mt-1">Protection et Intégration</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "Procédures d'Asile", desc: "OFPRA, CNDA, Recours, Dublin", icon: <Gavel size={18} /> },
                    { title: "Titres de Séjour", desc: "Préfecture, 10 ans, renouvellement", icon: <Briefcase size={18} /> },
                    { title: "Logement & Social", desc: "DAHO, DALO, CPAM, CAF", icon: <Heart size={18} /> }
                  ].map((item, idx) => (
                    <button key={idx} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-black/[0.05] text-left tap-active">
                      <div className="w-10 h-10 rounded-2xl bg-bg-primary flex items-center justify-center text-brand-blue">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-text-primary">{item.title}</h4>
                        <p className="text-[11px] text-text-tertiary font-medium">{item.desc}</p>
                      </div>
                    </button>
                  ))}
               </div>
               <button className="w-full py-5 bg-danger text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-danger/20 tap-haptic">
                 <ShieldAlert className="inline-block mr-2" size={18} /> Urgence Administrative
               </button>
            </div>
          )}

          {activeModal === 'mentorship' && (
             <div className="space-y-6 animate-fade">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                      <GraduationCap size={26} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">Mentorat Vainakh</h2>
                      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mt-1">Transmission de l&apos;Excellence</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "Études", icon: <BookOpen size={18} /> },
                      { title: "Tech / IT", icon: <Terminal size={18} /> },
                      { title: "Business", icon: <Briefcase size={18} /> },
                      { title: "Artisanat", icon: <Package size={18} /> }
                    ].map((item, idx) => (
                      <button key={idx} className="flex flex-col gap-3 p-5 bg-white rounded-3xl border border-black/[0.05] text-left tap-active">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                          {item.icon}
                        </div>
                        <h4 className="text-[15px] font-black text-text-primary leading-none">{item.title}</h4>
                      </button>
                    ))}
                </div>
                <button onClick={onClose} className="w-full py-5 bg-success text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-success/20 tap-haptic">Trouver un Mentor</button>
             </div>
          )}

          {/* Fallback Close button */}
          {!activeModal && (
            <button onClick={onClose} className="w-full py-4 text-text-tertiary font-bold uppercase tracking-widest">Fermer</button>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
