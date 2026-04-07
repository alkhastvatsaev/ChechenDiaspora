"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Flame, Shield, BookOpen, Scaling as Scale, GraduationCap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ManifestoPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Animation on scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });

    const elements = document.querySelectorAll('.fade-up-text');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-black selection:text-white">
      {/* Immersive Header */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fbfbfd] to-transparent z-40 pointer-events-none"
        style={{ opacity }}
      />
      
      <header className="fixed top-0 z-50 w-full">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center pt-safe-top">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors bg-[#fbfbfd]/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 shadow-sm">
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span className="font-bold text-xs uppercase tracking-widest">Кхерч / Хаб</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-40">
        
        {/* Title Section */}
        <div className="space-y-8 mb-32 fade-up-text">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-2xl">
            <Flame className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            <h4 className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Манифест Диаспоры</h4>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-black">
              Бремя <br/> и Превосходство.
            </h1>
          </div>
          <p className="text-2xl font-medium text-gray-500 leading-relaxed border-l-4 border-black pl-6">
            Абсолютный самоанализ нашей реальности в изгнании. Уничтожить стигму не жалобами, а неопровержимым доказательством нашего превосходства.
          </p>
        </div>

        {/* Section 1 */}
        <article className="prose prose-lg md:prose-xl prose-gray max-w-none space-y-24">
          
          <section className="space-y-8 fade-up-text">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">01.</span> Корни Исхода
            </h2>
            <p>
              Чтобы понять современную чеченскую диаспору, необходимо посмотреть правде в глаза. Мы не покидали горы Кавказа из-за жажды экономической выгоды. Мы были выброшены за пределы наших земель <em>(Даймохк)</em> неслыханной жестокостью двух разрушительных войн. Наше изгнание — это, прежде всего, инстинкт самосохранения, акт защиты наших семей, наших детей и даже нашего генофонда.
            </p>
            <p>
              Прибыв в Европу — во Францию, Германию, Австрию, Бельгию — наши родители столкнулись с неведомым миром, железным языковым барьером и глухой травмой потери. И все же они строили. Они воздвигли жизни из пепла.
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">02.</span> Тяжесть Стигмы
            </h2>
            <p>
              Сегодня мы стоим перед вторым фронтом. Он больше не вооружен, он социальный, медийный и административный. В Европе и не только, на нашу общину был повешен тяжелый, несправедливый и стигматизирующий ярлык.
            </p>
            <p>
              <strong>Освещение в СМИ брутально.</strong> Общество слишком часто рассматривается через призму безопасности, подозрений и коллективной криминализации. В некоторых принимающих странах один лишь факт ношения северокавказской фамилии может стать причиной дополнительных проверок, отказов в жилье, препятствий при найме на работу, вплоть до административных притеснений или пугающего призрака депортации.
            </p>
            <p>
              Мы зажаты в тисках. С одной стороны, угроза злоупотреблений красными циркулярами Интерпола, инициируемыми мстительными государственными структурами. С другой стороны, недоверие принимающих стран, которые упрощают сложную тысячелетнюю историю до ксенофобских ярлыков. Это бремя тяжело для молодежи, которая здесь растет.
            </p>
          </section>

          <section className="space-y-12 fade-up-text">
            <div className="bg-black text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <Shield className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black text-white">Трагедия 1% <br/><span className="text-gray-400">и Молчание 99%</span></h3>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  Это математическая трагедия общественного внимания. Действия крошечного меньшинства — того 1%, который сбился с пути, который предал воспитание наших отцов, который скатился в преступность или смертоносные идеологии — систематически используются для определения всего нашего народа.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  Когда оступается один, его происхождение попадает в заголовки. Но кто говорит о 99%? Мир намеренно игнорирует молчаливое большинство нашей диаспоры.
                </p>
              </div>
            </div>
            
            <div className="pl-6 border-l-2 border-black/10 space-y-6">
              <p>
                Кто говорит о тысячах врачей, медсестер, хирургов чеченского происхождения, которые ежедневно спасают жизни в больницах Европы? Кто говорит о наших блестящих инженерах, о наших студентах-выпускниках крупнейших университетов, о наших предпринимателях, создающих рабочие места в самом сердце общества Франции, Германии или Австрии? Кто подчеркивает, что подавляющее большинство нашего народа живет честно, платит налоги, соблюдает законы и воспитывает своих детей в строгом уважении и чести?
              </p>
              <p className="font-bold text-black text-xl">
                Наши успехи невидимы, наши ошибки ярко освещены. Это удел изгнанников, и мы должны признать это, чтобы лучше с этим бороться.
              </p>
            </div>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">03.</span> Долг Гостя (Хьаша)
            </h2>
            <p>
              Наша традиция, <em>Нохчалла</em>, — это не пустые слова. Это строгий кодекс поведения, высеченный в скале. На вершине этого кодекса находится священное понятие: гостеприимство.
            </p>
            <p>
              Но гостеприимство обоюдно. Если хозяин должен отдать все гостю, <strong>гость (Хьаша) имеет абсолютный долг быть безупречным.</strong> В Европе мы — гости. Эти страны предоставили убежище нашим отцам, когда они бежали от бомб. Они накормили, вылечили и дали образование нашим семьям. Нохчалла требует от нас безграничной благодарности и бескомпромиссного соблюдения законов принимающих нас стран.
            </p>
            <p className="p-6 bg-gray-50 rounded-2xl italic text-gray-600 font-medium">
              "Тот, кто не уважает крышу, которая его укрывает, не является ни героем, ни человеком чести. Он — позор своего тайпа."
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">04.</span> Уничтожать Предрассудки Превосходством
            </h2>
            <p>
              Как уничтожить те стереотипы, что нависают над будущим наших детей? Не путем постоянных упреков или нескончаемых жалоб. Мир уважает только интеллектуальную силу, очевидный вклад и успех.
            </p>
            <p>
              <strong>Мы должны раздавить предрассудки тяжестью нашего превосходства.</strong> 
            </p>
            <p>
              Сегодня самый мощный акт сопротивления, самый высокий патриотизм для молодого вайнаха — это не бессмысленная агитация. Это получение диплома, создание процветающего бизнеса, становление выдающимся адвокатом, признанным исследователем или блестящим художником. Когда местные институты будут взаимодействовать с нами, они увидят не проблемы, они увидят решения, компетентность и благородство манер (<em>Оьздангалла</em>).
            </p>
          </section>

          <section className="space-y-12 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">05.</span> Оружие Образования (Кхетам)
            </h2>
            
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-chechen-blue/10 rounded-2xl shrink-0 mt-2">
                <GraduationCap className="w-8 h-8 text-chechen-blue" />
              </div>
              <p>
                Образование — наш единственный путь к спасению. Родители из нашей общины пожертвовали здоровьем на фабриках и стройках Европы не для того, чтобы их дети повторили их участь или сбились с пути под иллюзией легкой уличной жизни, а для того, чтобы они сели за парты величайших школ. Мы не должны предать их жертву.
              </p>
            </div>
            
            <p>
              Именно поэтому на нашей платформе **Менторство занимает центральное место**. Те представители первой волны, кто смог пробить стеклянный потолок (инженеры, юристы, управленцы), имеют абсолютный моральный долг — продиктованный братством — протянуть руку помощи и направить сомневающуюся молодежь.
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">06.</span> Назначение Дома "Вайнах"
            </h2>
            <p>
              В этом заключается суть нашего приложения. Это не социальная сеть, созданная для того, чтобы убивать время или льстить чьему-то эго. Это **строгая, функциональная цифровая инфраструктура, посвященная защите и возвышению** нашего сообщества.
            </p>
            <ul className="space-y-6 mt-8 p-0 list-none">
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Юридический Щит:</strong> Мгновенно находить наших юристов и присяжных переводчиков для защиты тех из нас, кому грозит административный произвол, а также для обеспечения нашего законного постоянного проживания.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Сеть Наставничества:</strong> Соединять техническое, медицинское или интеллектуальное превосходство одного члена с обоснованными амбициями другого.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Экономическая Сеть:</strong> Способствовать бизнесу, найму на работу и гарантировать жилье через поручительство наших экономически крепких братьев и сестер.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Священный Долг:</strong> Облегчать логистику и сбор средств для решения самых сложных испытаний, в частности, для достойного уважения и репатриации умерших.</p>
              </li>
            </ul>
          </section>

          <section className="space-y-8 fade-up-text pb-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-4xl font-black text-black tracking-tighter">Эпилог</h2>
            <p className="text-2xl font-medium leading-relaxed">
              Никто не придет нас спасать, кроме нас самих, по милости Всевышнего.
            </p>
            <p className="text-xl text-gray-500 font-medium">
              Будем лучшими гражданами, будем самыми образованными, будем обладать непоколебимой честностью и быть безусловной пользой для мира, который нас окружает.<br/><br/>
              Почерпнем из нашей тысячелетней идентичности гордость — не для высокомерия, а для того, чтобы найти в ней силы быть безупречными. У нас не должно быть ни терпения, ни снисхождения к тем из нас, кто оступается и порочит историю своих предков. Будем возвышать других.
            </p>
            <p className="text-2xl font-black pt-8">
              Далла аьтто бойла вай.
            </p>
          </section>

        </article>
      </main>
    </div>
  );
}
