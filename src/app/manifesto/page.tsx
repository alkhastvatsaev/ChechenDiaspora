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
            <span className="font-bold text-xs uppercase tracking-widest">Le Foyer</span>
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
            <h4 className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Manifeste de la Diaspora</h4>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-black">
              Le Fardeau <br/> et l'Excellence.
            </h1>
          </div>
          <p className="text-2xl font-medium text-gray-500 leading-relaxed border-l-4 border-black pl-6">
            Une introspection absolue sur notre réalité en exil. Détruire le stigmate, non pas par la plainte, mais par l'irréfutable preuve de notre excellence.
          </p>
        </div>

        {/* Section 1 */}
        <article className="prose prose-lg md:prose-xl prose-gray max-w-none space-y-24">
          
          <section className="space-y-8 fade-up-text">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">01.</span> Les Racines de l'Exode
            </h2>
            <p>
              Comprendre la diaspora tchétchène moderne nécessite de regarder la vérité en face. Nous n'avons pas quitté les montagnes du Caucase par pur opportunisme économique. Nous avons été propulsés hors de nos terres <em>(Daimohk)</em> par la violence inouïe de deux guerres dévastatrices. Notre exil est avant tout un instinct de survie, un acte de protection pour nos familles, nos enfants et notre patrimoine génétique même.
            </p>
            <p>
              Arrivés en Europe – en France, en Allemagne, en Autriche, en Belgique – nos parents ont dû affronter un monde inconnu, une barrière linguistique de fer, et le traumatisme sourd de la perte. Pourtant, ils ont construit. Ils ont bâti des vies à partir des cendres. 
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">02.</span> Le Poids du Stigmate
            </h2>
            <p>
              Aujourd'hui, nous faisons face à un second front. Il n'est plus armé, il est sociétal, médiatique et administratif. En Europe et ailleurs, une étiquette lourde, injuste et stigmatisante a été collée sur le front de notre communauté. 
            </p>
            <p>
              <strong>Le récit médiatique est brutal.</strong> La communauté est trop souvent observée à travers le prisme de la sécurité, de la suspicion, et de la criminalisation collective. Dans certains pays hôtes, le simple fait de porter un nom à consonance nord-caucasienne peut déclencher des vérifications supplémentaires, des refus de logement, des obstacles à l'embauche, voire un harcèlement administratif ou le spectre terrifiant d'une déportation.
            </p>
            <p>
              Nous sommes pris en étau. D'un côté, la menace des abus des notices rouges d'Interpol lancées par des entités étatiques vengeresses. De l'autre, la méfiance des pays d'accueil qui simplifient une histoire millénaire complexe en un raccourci xénophobe. Ce fardeau est lourd pour la jeunesse qui grandit ici.
            </p>
          </section>

          <section className="space-y-12 fade-up-text">
            <div className="bg-black text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <Shield className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black text-white">La Tragédie du 1% <br/><span className="text-gray-400">et le Silence des 99%</span></h3>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  C'est la tragédie mathématique de l'attention publique. Les actions d'une infime minorité — le 1% qui s'égare, qui trahit l'éducation de nos pères, qui tombe dans la délinquance ou les idéologies mortifères — sont systématiquement instrumentalisées pour définir l'ensemble de notre peuple.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed font-medium">
                  Quand "l'un" commet une faute, l'origine ethnique occupe les gros titres. Mais qui parle des 99% ? Le monde ignore délibérément la majorité silencieuse de notre diaspora.
                </p>
              </div>
            </div>
            
            <div className="pl-6 border-l-2 border-black/10 space-y-6">
              <p>
                Qui parle de ces milliers de médecins, d'infirmières, de chirurgiens d'origine tchétchène qui sauvent des vies chaque jour dans les hôpitaux européens ? 
                Qui parle de nos brillants ingénieurs, de nos étudiants diplômés des plus grandes universités, de nos entrepreneurs qui créent de l'emploi et de la valeur dans la matrice même de la société française, allemande ou autrichienne ? 
                Qui souligne que la majorité écrasante de notre peuple vit honnêtement, paie ses impôts, respecte les lois et élève ses enfants dans le respect et l'honneur strict ?
              </p>
              <p className="font-bold text-black text-xl">
                Notre excellence est invisible, nos erreurs sont luminescentes. C'est le lot des exilés, et nous devons l'accepter pour mieux le combattre.
              </p>
            </div>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">03.</span> Le Devoir de l'Invité (Le Haasha)
            </h2>
            <p>
              Notre tradition, le <em>Nokhchalla</em>, n'est pas qu'un mot vide. C'est un code de conduite rigoureux, forgé dans la roche. Au sommet de ce code se trouve un concept sacré : l'hospitalité.
            </p>
            <p>
              Mais l'hospitalité va dans les deux sens. Si l'hôte se doit de tout offrir à l'invité, <strong>l'invité (le Haasha) a le devoir absolu d'être irréprochable.</strong> En Europe, c'est nous les invités. Ces pays ont accordé l'asile à nos pères quand ils fuyaient les bombes. Ils ont nourri, soigné et scolarisé nos familles. Le Nokhchalla exige de nous une gratitude sans borne et un respect intransigeant des lois de nos sociétés d'accueil.
            </p>
            <p className="p-6 bg-gray-50 rounded-2xl italic text-gray-600 font-medium">
              "Celui qui ne respecte pas le toit qui l'abrite n'est ni un héros, ni un homme d'honneur. Il est la honte de son Teip."
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">04.</span> Détruire les Préjugés par l'Excellence
            </h2>
            <p>
              Comment détruire ces stéréotypes qui pèsent sur l'avenir de nos enfants ? Ce ne sera ni par la victimisation constante, ni par la plainte incessante. Le monde ne respecte que la force intellectuelle, la contribution manifeste et le succès.
            </p>
            <p>
              <strong>Nous devons écraser le préjugé sous le poids de notre excellence.</strong> 
            </p>
            <p>
              Aujourd'hui, l'acte de résistance le plus puissant, le patriotisme le plus élevé pour un jeune Vainakh, ce n'est pas l'agitation stérile. C'est d'obtenir un master, de créer une entreprise florissante, de devenir un avocat redoutable, un chercheur reconnu, un artiste brillant. Lorsque les institutions locales interagiront avec nous, elles ne verront pas des problèmes, elles verront la solution, la compétence, le savoir-être (<em>O'zdangalla</em>). 
            </p>
          </section>

          <section className="space-y-12 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">05.</span> L'Arme de l'Éducation (Кхетам)
            </h2>
            
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-chechen-blue/10 rounded-2xl shrink-0 mt-2">
                <GraduationCap className="w-8 h-8 text-chechen-blue" />
              </div>
              <p>
                L'éducation, pure et simple, est notre porte de salut. Les parents de notre communauté ont sacrifié leur santé dans des usines et sur des chantiers en Europe, non pas pour que leurs enfants reproduisent la précarité ou s'égarent dans l'illusion de la facilité de la rue, mais pour qu'ils s'assoient sur les bancs des grandes écoles. Ne trahisons pas leur sacrifice.
              </p>
            </div>
            
            <p>
              C'est pourquoi, au sein de cet outil, de cette plateforme, **le Mentorat est central**. Ceux de la première vague qui ont réussi à percer le plafond de verre (ingénieurs, juristes, cadres) ont le devoir moral absolu, imposé par la fraternité, de tendre la main et de guider la jeunesse qui doute. 
            </p>
          </section>

          <section className="space-y-8 fade-up-text">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-gray-300 font-normal">06.</span> La Fonction du Foyer "Вайнах"
            </h2>
            <p>
              C'est la raison d'être de cette application. Elle n'est pas un réseau social conçu pour tuer le temps ou flatter des egos. C'est une **infrastructure numérique stricte, fonctionnelle, dédiée à la protection et à l'ascension** de notre communauté. 
            </p>
            <ul className="space-y-6 mt-8 p-0 list-none">
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Un Bouclier Juridique :</strong> Identifier instantanément nos avocats et traducteurs assermentés pour protéger ceux d'entre nous menacés d'abus administratifs et sécuriser notre présence légale permanente.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Un Relais de Mentorat :</strong> Mettre en relation l'excellence technique, médicale ou intellectuelle d'un membre avec l'ambition légitime d'un autre.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Un Réseau Économique :</strong> Favoriser les affaires, l'embauche, et garantir le logement par la caution de nos frères et sœurs solides économiquement.</p>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" />
                <p className="m-0"><strong className="text-black">Un Devoir Sacré :</strong> Faciliter la logistique et les fonds pour gérer les épreuves ultimes, notamment le respect digne et le rapatriement funéraire de nos anciens.</p>
              </li>
            </ul>
          </section>

          <section className="space-y-8 fade-up-text pb-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-16" />
            <h2 className="text-4xl font-black text-black tracking-tighter">Épilogue</h2>
            <p className="text-2xl font-medium leading-relaxed">
              Personne ne viendra nous sauver, si ce n'est nous-mêmes, par la grâce de Dieu.
            </p>
            <p className="text-xl text-gray-500 font-medium">
              Soyons les meilleurs citoyens, soyons les plus éduqués, soyons d'une droiture inébranlable et d'une utilité incontestable pour le monde qui nous entoure.<br/><br/>
              Puisons dans notre identité millénaire la fierté non pas pour être arrogants, mais pour trouver la force d'être irréprochables. N'ayons aucune patience, aucune complaisance envers ceux d'entre nous qui dévient et salissent l'histoire de leurs ancêtres. Elevons les autres.
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
