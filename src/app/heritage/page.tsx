"use client";

import Link from 'next/link';
import { ChevronLeft, Shield, Scale, Network, Star, Flag, Mountain, Book, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function HeritagePage() {
  
  // Simple intersection observer to trigger animations on scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-apple-light text-apple-dark font-sans selection:bg-chechen-blue/20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-apple-light/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between pt-safe-top">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ChevronLeft size={20} />
            <span className="font-semibold text-sm">Назад</span>
          </Link>
          <span className="font-bold tracking-widest text-[10px] uppercase text-gray-400">Наследие</span>
          <div className="w-8" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 md:py-32 space-y-40">
        
        {/* Intro */}
        <section className="text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center justify-center p-5 bg-chechen-blue/5 rounded-full mb-4">
            <Mountain className="w-12 h-12 text-chechen-blue" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Нохчалла.
            <br />
            <span className="text-gray-400">Суть чеченца.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Могучие горы Кавказа выковали нацию, для которой свобода, честь и достоинство превыше жизни. Это история не просто народа, а братства.
          </p>
        </section>

        {/* Nokhchalla */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center scroll-animate opacity-0">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center">
              <Star className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Больше, чем кодекс.</h2>
            <p className="text-lg text-gray-600 leading-relaxed md:text-justify">
              <strong>Нохчалла</strong> (Чеченство) — это неписаный моральный закон. Это умение быть мужественным, оставаясь предельно скромным. Это абсолютное уважение к старшим, защита слабых и готовность проявить безусловное гостеприимство. По этому кодексу все люди рождаются равными, без царей и господ.
            </p>
          </div>
          <div className="bg-gray-100/50 rounded-[3rem] aspect-square p-12 flex flex-col justify-center items-center text-center shadow-inner">
            <Shield className="w-24 h-24 text-gray-300 mb-6" strokeWidth={1} />
            <p className="font-bold text-gray-400 text-lg uppercase tracking-widest">Честь. Уважение. Равенство.</p>
          </div>
        </section>

        {/* Teips & Tukhums */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row-reverse border-t border-black/5 pt-32 scroll-animate opacity-0 mt-32">
          <div className="space-y-6 md:col-start-2">
            <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center">
              <Network className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Тайп и Тукхум.</h2>
            <p className="text-lg text-gray-600 leading-relaxed md:text-justify">
              <strong>Тайп (Клан)</strong> — основа общества. Это патриархальная структура, связывающая людей общим предком. Тайп защищает своих и определяет идентичность, не разрушая равенства.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed md:text-justify">
              <strong>Тукхум</strong> — это дипломатический и военно-политический союз нескольких тайпов. Исторически созданные для региональной защиты, 9 тукхумов составляют весь чеченский народ.
            </p>
          </div>
          <div className="bg-chechen-blue/5 rounded-[3rem] aspect-square p-12 flex flex-col justify-center items-center text-center shadow-inner md:col-start-1 md:row-start-1">
            <Network className="w-24 h-24 text-chechen-blue/40 mb-6" strokeWidth={1} />
            <p className="font-bold text-chechen-blue/50 text-lg uppercase tracking-widest">Единство через братство.</p>
          </div>
        </section>

        {/* Adat */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-t border-black/5 pt-32 scroll-animate opacity-0 mt-32">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-black/5 flex items-center justify-center">
              <Scale className="w-8 h-8 text-black" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Адат. Закон гор.</h2>
            <p className="text-lg text-gray-600 leading-relaxed md:text-justify">
              <strong>Адат</strong> — традиционное обычное право. Веками, до появления современной юриспруденции, именно Адат регулировал все сферы конфликтов: от правил гостеприимства и земельных споров до примирения кровников. Это фундамент социального баланса.
            </p>
          </div>
          <div className="bg-gray-100/50 rounded-[3rem] aspect-square p-12 flex flex-col justify-center items-center text-center shadow-inner">
            <Scale className="w-24 h-24 text-gray-300 mb-6" strokeWidth={1} />
            <p className="font-bold text-gray-400 text-lg uppercase tracking-widest">Справедливость и Баланс.</p>
          </div>
        </section>

        {/* Dictionary Link */}
        <section className="scroll-animate opacity-0 mt-32">
          <Link href="/heritage/dictionary" className="block group">
            <div className="bg-black text-white p-12 rounded-[3.5rem] relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Book className="w-48 h-48" strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest">
                  Беркат — Новое
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                  Дошлор.
                  <br />
                  <span className="text-gray-400">Словарь предков.</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                  Accède à l'archive complète de la langue tchétchène. Des milliers de mots conservés pour ne jamais oublier qui nous sommes.
                </p>
                <div className="pt-4 flex items-center gap-3 font-bold text-lg">
                  Entrer dans l'archive <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* History Outline */}
        <section className="border-t border-black/5 pt-32 pb-32 scroll-animate opacity-0 mt-32">
          <div className="text-center space-y-6 mb-24">
            <Flag className="w-12 h-12 text-black mx-auto" strokeWidth={1.5} />
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Непокоренная история.</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Тысячелетия испытаний сформировали дух народа, который никогда не сдавался.
            </p>
          </div>

          <div className="space-y-16 max-w-3xl mx-auto">
            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-4 gap-8 items-start">
                <div className="md:text-right font-bold text-xl text-gray-400 pb-2 md:pb-0 pt-1">XVIII - XIX В.</div>
                <div className="md:col-span-3 space-y-3 bg-white p-6 rounded-3xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold">Кавказская война</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Более чем столетняя война за независимость против Российской Империи, ведомая легендарными лидерами, такими как Шейх Мансур и Имам Шамиль. Эпоха величайшего сопротивления.</p>
                </div>
              </div>
            </div>

            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-4 gap-8 items-start">
                <div className="md:text-right font-bold text-xl text-red-500 pb-2 md:pb-0 pt-1">1944 Год</div>
                <div className="md:col-span-3 space-y-3 bg-red-50/50 p-6 rounded-3xl border border-red-100 hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold text-red-900">Операция «Чечевица» (Аардах)</h3>
                  <p className="text-red-800/80 text-lg leading-relaxed">Трагичная депортация всего чечено-ингушского народа в Среднюю Азию. Сотни тысяч людей погибли от холода и голода в вагонах. Возвращение состоялось лишь через 13 долгих лет.</p>
                </div>
              </div>
            </div>

            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-4 gap-8 items-start">
                <div className="md:text-right font-bold text-xl text-chechen-blue pb-2 md:pb-0 pt-1">Наши дни</div>
                <div className="md:col-span-3 space-y-3 bg-white p-6 rounded-3xl shadow-sm border border-chechen-blue/20 hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold text-chechen-blue">Возрождение и Диаспора</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Пройдя через две разрушительные войны в новейшей истории, Грозный восстал из пепла. А сотни тысяч чеченцев сформировали крепкую глобальную диаспору, сохраняющую свои корни вдали от гор.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
