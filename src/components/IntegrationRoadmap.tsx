"use client";

import { motion } from 'framer-motion';
import { ChevronRight, Shield, Clock, FileText, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';

const FRENCH_ASYLE_FLOW = [
  {
    step: 1,
    title: "SPADA / ПЕРВАЯ ЗАПИСЬ",
    desc: "Регистрация в структуре первого приема. Получение записи в Префектуру.",
    details: "Вам нужно найти SPADA в вашем регионе. Возьмут ваши данные и выдадут 'Convocations'.",
    tip: "Приходите как можно раньше, часто живая очередь."
  },
  {
    step: 2,
    title: "GUDA / ПРЕФЕКТУРА",
    desc: "Сдача отпечатков пальцев и получение первого документа (Attestation).",
    details: "Здесь вам выдадут направление в OFII и вашу первую бумагу (Aide au Demandeur d'Asile).",
    tip: "С собой нужно иметь 4 фото на документы."
  },
  {
    step: 3,
    title: "OFII / СОЦ. ПОМОЩЬ",
    desc: "Подписание договора об интеграции и получение карты ADA (деньги).",
    details: "Выделяется ежемесячное пособие и (если есть места) жилье в CADA.",
    tip: "Всегда следите за почтой!"
  },
  {
    step: 4,
    title: "OFPRA / ДОСЬЕ",
    desc: "Отправка вашей истории в ведомство по делам беженцев.",
    details: "У вас есть 21 день на отправку досье после Префектуры. Это самый важный этап.",
    tip: "Пишите историю на родном языке, потом делайте перевод."
  }
];

export default function IntegrationRoadmap() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-kherch-dark">Путь Интеграции</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Франция: Азит / Убежище</p>
        </div>
      </div>

      <div className="relative space-y-4">
        {/* Connection Line */}
        <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-indigo-100/50 z-0" />

        {FRENCH_ASYLE_FLOW.map((item) => (
          <motion.button
            key={item.step}
            onClick={() => setActiveStep(item.step)}
            className={`relative z-10 w-full text-left p-5 rounded-[2rem] transition-all duration-300 flex items-start gap-4 border ${
              activeStep === item.step 
                ? 'bg-white shadow-xl border-indigo-100 ring-4 ring-indigo-50/50' 
                : 'bg-white/40 border-black/5'
            }`}
          >
            <div className={`w-[44px] h-[44px] rounded-2xl flex items-center justify-center shrink-0 transition-all font-black ${
              activeStep === item.step 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white border border-black/5 text-gray-300'
            }`}>
              {activeStep > item.step ? <CheckCircle2 size={24} /> : item.step}
            </div>

            <div className="flex-1 space-y-1">
              <h4 className={`text-sm font-black uppercase tracking-tight ${
                activeStep === item.step ? 'text-indigo-900' : 'text-gray-400'
              }`}>
                {item.title}
              </h4>
              <p className={`text-xs font-medium leading-relaxed ${
                activeStep === item.step ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {item.desc}
              </p>

              {activeStep === item.step && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="pt-4 mt-4 border-t border-indigo-50 space-y-3"
                >
                   <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3 items-start">
                      <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-indigo-900/70 font-medium leading-relaxed">
                        {item.details}
                      </p>
                   </div>
                   <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full inline-block">
                      💡 Совет: {item.tip}
                   </div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-vainakh-stone p-6 rounded-[2.5rem] border border-black/5 text-center space-y-2">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-relaxed">
           «Самое трудное — это начало. Помните о цели и не опускайте руки.»
         </p>
         <div className="flex items-center justify-center gap-2 text-indigo-500">
            <Shield size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Община с вами</span>
         </div>
      </div>
    </div>
  );
}
