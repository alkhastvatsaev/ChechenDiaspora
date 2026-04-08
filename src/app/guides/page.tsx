"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, FileText, ShieldCheck, MapPin, Clock, ArrowRight } from "lucide-react";

type GuideCategory = "france_admin" | "legal" | "housing" | "work";

type GuideDifficulty = "basic" | "advanced";

interface GuideItem {
  id: string;
  title: string;
  summary: string;
  country: string;
  city?: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  updatedAt: number;
}

const CATEGORY_META: Record<GuideCategory, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  france_admin: { label: "Франция: Админ", icon: ShieldCheck, color: "text-blue-700 bg-blue-50" },
  legal: { label: "Юридическое", icon: FileText, color: "text-indigo-700 bg-indigo-50" },
  housing: { label: "Жилье", icon: MapPin, color: "text-orange-700 bg-orange-50" },
  work: { label: "Работа", icon: ArrowRight, color: "text-emerald-700 bg-emerald-50" },
};

function formatDate(ts: number) {
  try {
    return new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

const SAMPLE_GUIDES: GuideItem[] = [
  {
    id: "G1",
    title: "Франция: продление документов — чеклист",
    summary: "Список документов, ошибки, порядок действий и сроки.",
    country: "Франция",
    category: "france_admin",
    difficulty: "basic",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "G2",
    title: "Как найти присяжного переводчика",
    summary: "Где искать, как проверить статус, какие форматы принимают администрации.",
    country: "Франция",
    category: "legal",
    difficulty: "basic",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "G3",
    title: "Жилье: поручительство и безопасные договоры",
    summary: "Что проверять в договоре, как не попасть на мошенников.",
    country: "Германия",
    category: "housing",
    difficulty: "advanced",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: "G4",
    title: "Работа: резюме и собеседование (Европа)",
    summary: "Как упаковать опыт, какие ошибки чаще всего мешают получить оффер.",
    country: "Австрия",
    category: "work",
    difficulty: "basic",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
];

export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GuideCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_GUIDES.filter((g) => {
      const matchesCategory = category === "all" || g.category === category;
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.country.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-black/5 pt-safe-top">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Гайды</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">память общины</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: Франция, перевод, жилье..."
              className="w-full bg-white border border-black/5 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-black/10 outline-none shadow-sm"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setCategory("all")}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                category === "all" ? "bg-black text-white border-black shadow-lg" : "bg-white text-gray-500 border-black/5 hover:border-black/10"
              }`}
            >
              Все
            </button>
            {(Object.keys(CATEGORY_META) as GuideCategory[]).map((c) => {
              const meta = CATEGORY_META[c];
              const Icon = meta.icon;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    category === c ? "bg-black text-white border-black shadow-lg" : "bg-white text-gray-500 border-black/5 hover:border-black/10"
                  }`}
                >
                  <Icon size={16} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Документы</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">превью</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-black/5 rounded-[2rem] p-8 text-center text-gray-500 font-medium">
              Ничего не найдено
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((g) => {
                const meta = CATEGORY_META[g.category];
                const Icon = meta.icon;
                return (
                  <div key={g.id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${meta.color}`}>
                            <span className="inline-flex items-center gap-2">
                              <Icon size={14} />
                              {meta.label}
                            </span>
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${g.difficulty === "basic" ? "text-gray-700 bg-gray-50" : "text-black bg-black/5"}`}>
                            {g.difficulty === "basic" ? "Базовый" : "Продвинутый"}
                          </span>
                        </div>

                        <div className="text-xl font-black tracking-tight leading-tight">{g.title}</div>
                        <div className="text-sm text-gray-600 font-medium leading-relaxed">{g.summary}</div>

                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={14} /> {g.country}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock size={14} /> {formatDate(g.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <button className="px-4 py-2 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all">
                        Читать
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
