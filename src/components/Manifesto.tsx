"use client";

import { motion } from 'framer-motion';
import { Shield, Users, Briefcase, GraduationCap, Flame, ChevronRight, Globe } from 'lucide-react';

const MANIFESTO_SECTIONS = [
  {
    id: "01",
    title: "Les Racines de l'Exode",
    subtitle: "Орамаш / Корни",
    content: "Comprendre la diaspora tchétchène moderne nécessite de regarder la vérité en face. Nous n'avons pas quitté les montagnes du Caucase par pur opportunisme économique. Nous avons été propulsés hors de nos terres (Daimohk) par la violence inouïe de deux guerres dévastatrices. Notre exil est avant tout un instinct de survie, un acte de protection pour nos familles, nos enfants et notre patrimoine génétique même.",
    content2: "Arrivés en Europe – en France, en Allemagne, en Autriche, en Belgique – nos parents ont dû affronter un monde inconnu, une barrière linguistique de fer, et le traumatisme sourd de la perte. Pourtant, ils ont construit. Ils ont bâti des vies à partir des cendres.",
    icon: <Globe className="text-brand-blue" size={24} />
  },
  {
    id: "02",
    title: "Le Poids du Stigmate",
    subtitle: "Йист / Грань",
    content: "Aujourd'hui, nous faisons face à un second front. Il n'est plus armé, il est sociétal, médiatique et administratif. En Europe et ailleurs, une étiquette lourde, injuste et stigmatisante a été collée sur le front de notre communauté.",
    content2: "Le récit médiatique est brutal. La communauté est trop souvent observée à travers le prisme de la sécurité, de la suspicion, et de la criminalisation collective. Dans certains pays hôtes, le simple fait de porter un nom à consonance nord-caucasienne peut déclencher des vérifications supplémentaires, des refus de logement, des obstacles à l'embauche, voire un harcèlement administratif ou le spectre terrifiant d'une déportation.",
    highlight: "La Tragédie du 1% et le Silence des 99%",
    highlightContent: "Les actions d'une infime minorité — le 1% qui s'égare — sont systématiquement instrumentalisées pour définir l'ensemble de notre peuple. Mais qui parle des 99% ? Le monde ignore délibérément les milliers de médecins, d'ingénieurs et d'entrepreneurs d'origine tchétchène qui sauvent des vies et créent de la valeur chaque jour.",
    icon: <Shield className="text-danger" size={24} />
  },
  {
    id: "03",
    title: "Le Devoir de l'Invité (Le Haasha)",
    subtitle: "Хьаша / Гость",
    content: "Notre tradition, le Nokhchalla, exige de nous une gratitude sans borne et un respect intransigeant des lois de nos sociétés d'accueil. Ces pays ont accordé l'asile à nos pères quand ils fuyaient les bombes. Ils ont nourri, soigné et scolarisé nos familles.",
    quote: '« Celui qui ne respecte pas le toit qui l\'abrite n\'est ni un héros, ni un homme d\'honneur. Il est la honte de son Teip. »',
    icon: <Users className="text-brand-amber" size={24} />
  },
  {
    id: "04",
    title: "Détruire les Préjugés par l'Excellence",
    subtitle: "Кхиам / Успех",
    content: "Comment détruire ces stéréotypes ? Ce ne sera ni par la victimisation, ni par la plainte. Le monde ne respecte que la force intellectuelle, la contribution manifeste et le succès. Nous devons écraser le préjugé sous le poids de notre excellence.",
    icon: <Flame className="text-warning" size={24} />
  },
  {
    id: "05",
    title: "L'Arme de l'Éducation (Кхетам)",
    subtitle: "Дешар / Просвещение",
    content: "L'éducation est notre porte de salut. Ne trahisons pas le sacrifice de nos parents. C'est pourquoi, au sein de cet outil, le Mentorat est central. Ceux qui ont réussi ont le devoir moral absolu de guider la jeunesse qui doute.",
    icon: <GraduationCap className="text-brand-blue" size={24} />
  },
  {
    id: "06",
    title: "La Fonction du Foyer \"Вайнах\"",
    subtitle: "Кхерч / Очаг",
    content: "Cette application n'est pas un réseau social pour tuer le temps. C'est une infrastructure numérique stricte, dédiée à la protection et à l'ascension de notre communauté.",
    list: [
      "Un Bouclier Juridique : Protéger ceux menacés d'abus administratifs.",
      "Un Relais de Mentorat : Transmettre l'excellence aux plus jeunes.",
      "Un Réseau Économique : Favoriser l'emploi et le logement entre nous.",
      "Un Devoir Sacré : Faciliter le rapatriement funéraire de nos anciens."
    ],
    icon: <Briefcase className="text-success" size={24} />
  }
];

export default function Manifesto() {
  return (
    <div className="flex flex-col w-full bg-bg-dark text-text-on-dark min-h-full">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 pt-12 pb-16 text-center space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-amber/10 to-transparent opacity-50" />
        <div className="relative inline-block mb-2">
           <div className="absolute -inset-4 bg-brand-amber/20 blur-2xl rounded-full animate-pulse-slow"></div>
           <Flame size={48} className="relative text-brand-amber mx-auto" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
          Manifeste de la <span className="text-brand-amber">Diaspora</span>
        </h1>
        <p className="text-xl font-bold text-text-on-dark/60 italic tracking-tight">
          Le Fardeau et l&apos;Excellence.
        </p>
        <div className="w-16 h-1 bg-brand-amber/30 mx-auto rounded-full mt-6"></div>
      </motion.div>

      {/* Intro Text */}
      <div className="px-8 mb-12">
        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/20 backdrop-blur-md">
          <p className="text-lg font-medium leading-relaxed text-text-on-dark/95 text-center">
            Une introspection absolue sur notre réalité en exil. Détruire le stigmate, non pas par la plainte, mais par l&apos;irréfutable preuve de notre excellence.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="px-8 pb-32 space-y-8">
        {MANIFESTO_SECTIONS.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative group"
          >
            <div className="absolute -left-4 -top-4 text-7xl font-black text-white/[0.04] select-none group-hover:text-brand-amber/[0.08] transition-all duration-700">
              {section.id}
            </div>
            
            <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  {section.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-amber/80 mb-1">{section.subtitle}</div>
                  <h3 className="text-2xl font-black tracking-tight leading-none uppercase text-text-on-dark">{section.title}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base text-text-on-dark/85 leading-relaxed font-medium">
                  {section.content}
                </p>
                {section.content2 && (
                  <p className="text-base text-text-on-dark/80 leading-relaxed font-medium">
                    {section.content2}
                  </p>
                )}

                {section.highlight && (
                   <div className="p-6 bg-danger/10 rounded-3xl border border-danger/20 mt-6">
                      <h4 className="text-danger font-black text-sm uppercase mb-2 tracking-tight">{section.highlight}</h4>
                      <p className="text-sm text-text-on-dark/70 leading-relaxed font-medium">
                        {section.highlightContent}
                      </p>
                   </div>
                )}

                {section.quote && (
                  <div className="pt-6 mt-6 border-t border-white/10 italic text-xl font-bold text-brand-amber leading-tight">
                    {section.quote}
                  </div>
                )}

                {section.list && (
                  <div className="space-y-4 pt-4">
                    {section.list.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center text-success text-xs shrink-0 mt-1 shadow-inner">
                            <ChevronRight size={14} strokeWidth={3} />
                         </div>
                         <p className="text-sm font-bold text-text-on-dark/90 leading-tight">{item}</p>
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
            &quot;Personne ne viendra nous sauver, si ce n&apos;est nous-mêmes, par la grâce de Dieu.&quot;
          </p>
          <div className="space-y-4">
            <p className="text-text-on-dark/60 font-medium leading-loose max-w-lg mx-auto">
              Soyons les meilleurs citoyens, soyons les plus éduqués, soyons d&apos;une droiture inébranlable et d&apos;une utilité incontestable pour le monde qui nous entoure.
            </p>
            <p className="text-lg font-black tracking-widest text-brand-amber uppercase mt-12">
              Далла аьтто бойла вай.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
