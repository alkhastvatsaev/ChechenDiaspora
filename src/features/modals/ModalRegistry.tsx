import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Heart, Briefcase, GraduationCap, Package, Terminal, BookOpen, Gavel } from 'lucide-react';
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
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
        />
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
          className="relative w-full max-w-lg bg-white rounded-t-[3rem] p-8 pb-[calc(env(safe-area-inset-bottom)+30px)] shadow-2xl pointer-events-auto border-t border-black/[0.05]"
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full mx-auto mb-8" />
          
          {activeModal === 'administrative' && (
            <div className="space-y-6 animate-fade">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                    <Gavel size={30} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">Юридическая Защита</h2>
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none mt-1">Помощь и Интеграция</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: "Миграционные вопросы", desc: "Убежище, Рекорсы, Дублин", icon: <Gavel size={18} /> },
                    { title: "Вид на жительство", desc: "Префектура, Документы, Продление", icon: <Briefcase size={18} /> },
                    { title: "Жилье и Соцподдержка", desc: "Социальные службы, Пособия, Жилье", icon: <Heart size={18} /> }
                  ].map((item, idx) => (
                    <button key={idx} className="flex items-center gap-4 p-5 bg-bg-secondary rounded-[2rem] border border-black/[0.03] text-left tap-active">
                      <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-brand-blue shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-text-primary">{item.title}</h4>
                        <p className="text-[11px] text-text-secondary font-bold">{item.desc}</p>
                      </div>
                    </button>
                  ))}
               </div>
               <button className="w-full py-5 bg-danger text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-danger/20 tap-haptic">
                 <ShieldAlert className="inline-block mr-2" size={18} /> Экстренная Помощь
               </button>
            </div>
          )}

          {activeModal === 'mentorship' && (
             <div className="space-y-6 animate-fade">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                      <GraduationCap size={30} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">Наставничество</h2>
                      <p className="text-[10px] font-black text-success uppercase tracking-widest leading-none mt-1">Передача Опыта</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "Обучение", icon: <BookOpen size={18} /> },
                      { title: "Технологии", icon: <Terminal size={18} /> },
                      { title: "Бизнес", icon: <Briefcase size={18} /> },
                      { title: "Ремесло", icon: <Package size={18} /> }
                    ].map((item, idx) => (
                      <button key={idx} className="flex flex-col gap-4 p-6 bg-bg-secondary rounded-[2rem] border border-black/[0.03] text-left tap-active">
                        <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-success shadow-sm">
                          {item.icon}
                        </div>
                        <h4 className="text-[15px] font-black text-text-primary leading-none">{item.title}</h4>
                      </button>
                    ))}
                </div>
                <button onClick={onClose} className="w-full py-5 bg-success text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-success/20 tap-haptic">Найти Наставника</button>
             </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
