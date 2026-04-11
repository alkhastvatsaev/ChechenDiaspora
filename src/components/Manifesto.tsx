"use client";

import { motion } from 'framer-motion';
import { Shield, Users, Briefcase, GraduationCap, Flame, ChevronRight, Globe } from 'lucide-react';

const MANIFESTO_SECTIONS = [
  {
    id: "01",
    title: "Корни Исхода",
    subtitle: "Орамаш / Истоки",
    content: "Понимание современной истории требует честного взгляда на истину. Мы покинули родные горы не ради экономических выгод. Нас вытолкнула за пределы родной земли (Даймохк) жестокая реальность двух разрушительных войн. Наш исход — это прежде всего инстинкт выживания, акт защиты наших семей, детей и самого нашего будущего.",
    content2: "Прибыв в Европу — во Францию, Германию, Австрию, Бельгию — наши родители столкнулись с неизвестным миром, железным языковым барьером и глубокой травмой потери. Тем не менее, они выстояли. Они построили жизнь из пепла.",
    icon: <Globe className="text-brand-blue" size={24} />
  },
  {
    id: "02",
    title: "Груз Стереотипов",
    subtitle: "Йист / Грань",
    content: "Сегодня мы стоим перед вторым фронтом. Он больше не вооружен, он социальный, медийный и административный. На наше сообщество наклеена тяжелая, несправедливая и стигматизирующая этикетка.",
    content2: "Медийный дискурс часто бывает жесток. Нас слишком часто рассматривают через призму безопасности и подозрительности. Простые действия могут вызвать дополнительные проверки, отказы в жилье или препятствия при приеме на работу. Это несправедливый груз, который мы не обязаны нести в тишине.",
    highlight: "Трагедия 1% и Молчание 99%",
    highlightContent: "Действия ничтожного меньшинства — тех 1%, кто сбился с пути — систематически используются для определения всего народа. Но кто говорит о 99%? Мир игнорирует тысячи врачей, инженеров и предпринимателей нашего происхождения, которые спасают жизни и создают ценности каждый день.",
    icon: <Shield className="text-danger" size={24} />
  },
  {
    id: "03",
    title: "Долг Гостя (Хаша)",
    subtitle: "Хьаша / Гость",
    content: "Наша традиция требует от нас безграничной благодарности и бескомпромиссного соблюдения законов обществ, которые нас приняли. Эти страны предоставили убежище нашим отцам, когда они бежали от обстрелов. Они кормили, лечили и учили наши семьи.",
    quote: '«Тот, кто не уважает крышу, которая его приютила, не является ни героем, ни человеком чести. Он — позор своего рода.»',
    icon: <Users className="text-brand-amber" size={24} />
  },
  {
    id: "04",
    title: "Преодоление Предрассудков через Совершенство",
    subtitle: "Кхиам / Успех",
    content: "Как разрушить эти стереотипы? Это не будет сделано ни через виктимизацию, ни через жалобы. Мир уважает только интеллектуальную силу, явный вклад и успех. Мы должны сокрушить предрассудки грузом нашего совершенства.",
    icon: <Flame className="text-warning" size={24} />
  },
  {
    id: "05",
    title: "Оружие Образования (Кхетам)",
    subtitle: "Дешар / Просвещение",
    content: "Образование — это наш путь к спасению. Давайте не предадим жертву наших родителей. Именно поэтому в рамках этого инструмента Наставничество является центральным. Те, кто добился успеха, имеют абсолютный моральный долг направлять молодежь.",
    icon: <GraduationCap className="text-brand-blue" size={24} />
  },
  {
    id: "06",
    title: "Функция Очага \"Вайнах\"",
    subtitle: "Кхерч / Очаг",
    content: "Это приложение — не социальная сеть для убийства времени. Это строгая цифровая инфраструктура, посвященная защите и возвышению нашего сообщества.",
    list: [
      "Юридический Щит : Защита тех, кто сталкивается с административным произволом.",
      "Реле Наставничества : Передача опыта и знаний подрастающему поколению.",
      "Экономическая Сеть : Содействие трудоустройству и решению жилищных вопросов.",
      "Священный Долг : Помощь в репатриации и поддержка традиционных ценностей."
    ],
    icon: <Briefcase className="text-success" size={24} />
  }
];

export default function Manifesto() {
  return (
    <div className="flex flex-col w-full bg-transparent text-text-primary min-h-full">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 pt-12 pb-16 text-center space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-amber/5 to-transparent opacity-30" />
        <div className="relative inline-block mb-2">
           <div className="absolute -inset-4 bg-brand-amber/10 blur-2xl rounded-full animate-pulse-slow"></div>
           <Flame size={48} className="relative text-brand-amber mx-auto" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-text-primary">
          Манифест <span className="text-brand-amber">Сообщества</span>
        </h1>
        <p className="text-xl font-bold text-text-secondary italic tracking-tight">
          Бремя и Совершенство.
        </p>
        <div className="w-16 h-1 bg-brand-amber/20 mx-auto rounded-full mt-6"></div>
      </motion.div>

      {/* Intro Text */}
      <div className="px-8 mb-12">
        <div className="p-8 bg-black/[0.02] rounded-[2.5rem] border border-black/[0.05] backdrop-blur-md shadow-sm">
          <p className="text-lg font-medium leading-relaxed text-text-secondary text-center">
            Абсолютная интроспекция нашей реальности в изгнании. Мы разрушим стигму не жалобами, а неопровержимыми доказательствами нашего профессионализма.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="px-8 pb-32 space-y-12">
        {MANIFESTO_SECTIONS.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative group"
          >
            <div className="absolute -left-4 -top-6 text-8xl font-black text-black/[0.03] select-none group-hover:text-brand-amber/[0.05] transition-all duration-700">
              {section.id}
            </div>
            
            <div className="relative z-10 bg-white rounded-[3rem] p-8 border border-black/[0.03] shadow-sm hover:shadow-md transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center border border-black/[0.03]">
                  {section.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-amber mb-1">{section.subtitle}</div>
                  <h3 className="text-2xl font-black tracking-tight leading-none uppercase text-text-primary">{section.title}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base text-text-secondary leading-relaxed font-medium">
                  {section.content}
                </p>
                {section.content2 && (
                  <p className="text-base text-text-secondary/80 leading-relaxed font-medium">
                    {section.content2}
                  </p>
                )}

                {section.highlight && (
                   <div className="p-6 bg-danger/5 rounded-3xl border border-danger/10 mt-6">
                      <h4 className="text-danger font-black text-sm uppercase mb-2 tracking-tight">{section.highlight}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">
                        {section.highlightContent}
                      </p>
                   </div>
                )}

                {section.quote && (
                  <div className="pt-6 mt-6 border-t border-black/[0.05] italic text-xl font-bold text-brand-amber leading-tight">
                    {section.quote}
                  </div>
                )}

                {section.list && (
                  <div className="space-y-4 pt-4">
                    {section.list.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center text-success text-xs shrink-0 mt-1">
                            <ChevronRight size={14} strokeWidth={3} />
                         </div>
                         <p className="text-sm font-bold text-text-secondary leading-tight">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Epilogue */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center py-20 px-4 space-y-8"
        >
          <div className="w-20 h-0.5 bg-brand-amber/20 mx-auto rounded-full"></div>
          <p className="text-2xl font-black tracking-tight leading-relaxed max-w-sm mx-auto uppercase italic text-brand-amber">
            &quot;Никто не придет спасать нас, кроме нас самих, по воле Всевышнего.&quot;
          </p>
          <div className="space-y-4">
            <p className="text-text-secondary font-medium leading-loose max-w-lg mx-auto">
              Давайте будем лучшими гражданами, самыми образованными, непоколебимо честными и бесспорно полезными для мира, который нас окружает.
            </p>
            <p className="text-lg font-black tracking-widest text-brand-amber uppercase mt-12">
              Да поможет нам Аллах.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
