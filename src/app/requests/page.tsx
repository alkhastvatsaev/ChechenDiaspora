"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Search,
  Gavel,
  Languages,
  Home,
  Briefcase,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";

type RequestCategory = "legal" | "administrative" | "translation" | "housing" | "job";

type Urgency = "low" | "medium" | "high";

interface RequestItem {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  ville: string;
  pays: string;
  urgency: Urgency;
  createdAt: number;
  status: "open" | "taken" | "resolved";
}

interface Expert {
  id: string;
  name: string;
  tags: RequestCategory[];
  ville: string;
  pays: string;
  available: "now" | "today" | "weekend";
}

const CATEGORY_META: Record<
  RequestCategory,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }
> = {
  legal: { label: "Юрист", icon: Gavel, color: "text-indigo-600 bg-indigo-50" },
  administrative: { label: "Админ. помощь", icon: ShieldCheck, color: "text-blue-600 bg-blue-50" },
  translation: { label: "Перевод", icon: Languages, color: "text-emerald-600 bg-emerald-50" },
  housing: { label: "Жилье", icon: Home, color: "text-orange-600 bg-orange-50" },
  job: { label: "Работа", icon: Briefcase, color: "text-purple-600 bg-purple-50" },
};

const URGENCY_META: Record<Urgency, { label: string; color: string }> = {
  low: { label: "Спокойно", color: "text-gray-600 bg-gray-50" },
  medium: { label: "Важно", color: "text-amber-700 bg-amber-50" },
  high: { label: "Срочно", color: "text-red-700 bg-red-50" },
};

const SAMPLE_EXPERTS: Expert[] = [
  {
    id: "E1",
    name: "Аслан Б.",
    tags: ["legal", "administrative"],
    ville: "Страсбург",
    pays: "Франция",
    available: "now",
  },
  {
    id: "E2",
    name: "Амина И.",
    tags: ["translation", "administrative"],
    ville: "Вена",
    pays: "Австрия",
    available: "today",
  },
  {
    id: "E3",
    name: "Зелим У.",
    tags: ["job"],
    ville: "Берлин",
    pays: "Германия",
    available: "weekend",
  },
  {
    id: "E4",
    name: "Лиана Т.",
    tags: ["job"],
    ville: "Париж",
    pays: "Франция",
    available: "today",
  },
  {
    id: "E5",
    name: "Беслан Ц.",
    tags: ["housing"],
    ville: "Ницца",
    pays: "Франция",
    available: "weekend",
  },
];

function formatTime(ts: number) {
  const diffMs = Date.now() - ts;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}м назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}ч назад`;
  const days = Math.floor(hours / 24);
  return `${days}д назад`;
}

export default function RequestsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | "all">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [contactExpert, setContactExpert] = useState<Expert | null>(null);

  const [items, setItems] = useState<RequestItem[]>(() => [
    {
      id: "R1",
      title: "Нужен переводчик на завтра",
      description: "Семья, встреча в администрации. Нужен перевод RU/FR.",
      category: "translation",
      ville: "Страсбург",
      pays: "Франция",
      urgency: "high",
      createdAt: Date.now() - 1000 * 60 * 35,
      status: "open",
    },
    {
      id: "R2",
      title: "Вопрос по документам (Франция)",
      description: "Как правильно собрать пакет для продления?",
      category: "administrative",
      ville: "Лион",
      pays: "Франция",
      urgency: "medium",
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
      status: "taken",
    },
  ]);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: "administrative" as RequestCategory,
    ville: "",
    pays: "Франция",
    urgency: "medium" as Urgency,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ville.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, selectedCategory]);

  const matchingExperts = useMemo(() => {
    const cats = selectedCategory === "all" ? (Object.keys(CATEGORY_META) as RequestCategory[]) : [selectedCategory];
    return SAMPLE_EXPERTS.filter((e) => cats.some((c) => e.tags.includes(c)));
  }, [selectedCategory]);

  const createRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.description.trim() || !draft.ville.trim()) return;

    const newItem: RequestItem = {
      id: `R${Math.floor(Math.random() * 1_000_000)}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
      ville: draft.ville.trim(),
      pays: draft.pays.trim() || "Франция",
      urgency: draft.urgency,
      createdAt: Date.now(),
      status: "open",
    };

    setItems((prev) => [newItem, ...prev]);
    setIsCreating(false);
    setDraft({
      title: "",
      description: "",
      category: "administrative",
      ville: "",
      pays: "Франция",
      urgency: "medium",
    });
  };

  const takeRequest = (id: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: "taken" } : r)));
  };

  const resolveRequest = (id: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-black/5 pt-safe-top">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Запросы</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Такт. помощь</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 bg-black text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: юрист, перевод, город..."
              className="w-full bg-white border border-black/5 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-black/10 outline-none shadow-sm"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                selectedCategory === "all"
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-gray-500 border-black/5 hover:border-black/10"
              }`}
            >
              Все
            </button>
            {(Object.keys(CATEGORY_META) as RequestCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    selectedCategory === cat
                      ? "bg-black text-white border-black shadow-lg"
                      : "bg-white text-gray-500 border-black/5 hover:border-black/10"
                  }`}
                >
                  <Icon size={16} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Эксперты рядом</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              превью
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchingExperts.map((e) => (
              <div key={e.id} className="bg-white border border-black/5 rounded-[2rem] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="font-black text-lg tracking-tight">{e.name}</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <MapPin size={14} />
                      {e.ville}, {e.pays}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${CATEGORY_META[t].color}`}
                        >
                          {CATEGORY_META[t].label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-700 bg-gray-50">
                      {e.available === "now" ? "Сейчас" : e.available === "today" ? "Сегодня" : "Выходные"}
                    </span>
                    <button
                      onClick={() => setContactExpert(e)}
                      className="w-11 h-11 rounded-full bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all flex items-center justify-center"
                      aria-label="Связаться"
                      title="Связаться"
                    >
                      Связаться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Открытые запросы</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-black/5 rounded-[2rem] p-8 text-center text-gray-500 font-medium">
              Нет запросов
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((r) => {
                const cat = CATEGORY_META[r.category];
                const urg = URGENCY_META[r.urgency];
                const Icon = cat.icon;
                const statusBadge =
                  r.status === "open"
                    ? { label: "Открыто", className: "text-emerald-700 bg-emerald-50" }
                    : r.status === "taken"
                      ? { label: "В работе", className: "text-blue-700 bg-blue-50" }
                      : { label: "Решено", className: "text-gray-700 bg-gray-50" };

                return (
                  <div key={r.id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cat.color}`}>
                            <span className="inline-flex items-center gap-2">
                              <Icon size={14} />
                              {cat.label}
                            </span>
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${urg.color}`}>
                            {urg.label}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className="text-xl font-black tracking-tight leading-tight">{r.title}</div>
                        <div className="text-sm text-gray-600 font-medium leading-relaxed">{r.description}</div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={14} /> {r.ville}, {r.pays}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock size={14} /> {formatTime(r.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        {r.status === "open" ? (
                          <button
                            onClick={() => takeRequest(r.id)}
                            className="px-4 py-2 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                          >
                            Взять
                          </button>
                        ) : r.status === "taken" ? (
                          <button
                            onClick={() => resolveRequest(r.id)}
                            className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                          >
                            Решено
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 text-gray-700 text-xs font-black tracking-widest uppercase">
                            <CheckCircle2 size={16} />
                            OK
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-black/10 overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <div className="text-2xl font-black tracking-tight">Новый запрос</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">превью без базы данных</div>
            </div>

            <form onSubmit={createRequest} className="p-6 space-y-4">
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Заголовок"
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10"
              />

              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Опиши ситуацию коротко и ясно"
                rows={4}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-black/10 resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as RequestCategory }))}
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                >
                  {(Object.keys(CATEGORY_META) as RequestCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_META[c].label}
                    </option>
                  ))}
                </select>

                <select
                  value={draft.urgency}
                  onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value as Urgency }))}
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                >
                  {(Object.keys(URGENCY_META) as Urgency[]).map((u) => (
                    <option key={u} value={u}>
                      {URGENCY_META[u].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={draft.ville}
                  onChange={(e) => setDraft((d) => ({ ...d, ville: e.target.value }))}
                  placeholder="Город"
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none"
                />
                <input
                  value={draft.pays}
                  onChange={(e) => setDraft((d) => ({ ...d, pays: e.target.value }))}
                  placeholder="Страна"
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contactExpert && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-black/10 overflow-hidden">
            <div className="p-6 border-b border-black/5 flex items-start justify-between gap-6">
              <div>
                <div className="text-2xl font-black tracking-tight">Связаться</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {contactExpert.name} · превью
                </div>
              </div>
              <button
                onClick={() => setContactExpert(null)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                aria-label="Закрыть"
              >
                X
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-black/5 rounded-[2rem] p-5">
                <div className="text-sm font-black tracking-tight">Быстрое сообщение</div>
                <div className="text-sm text-gray-600 font-medium leading-relaxed mt-2">
                  Привет, брат/сестра. Нужна помощь по теме: {selectedCategory === "all" ? "(выбери категорию)" : CATEGORY_META[selectedCategory].label}.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={async () => {
                    const text = `Привет, брат/сестра. Нужна помощь по теме: ${
                      selectedCategory === "all" ? "(категория)" : CATEGORY_META[selectedCategory].label
                    }. Город: ...`;
                    try {
                      await navigator.clipboard.writeText(text);
                    } catch {
                      // ignore
                    }
                    setContactExpert(null);
                  }}
                  className="px-4 py-3 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Копировать
                </button>

                <button
                  onClick={() => setContactExpert(null)}
                  className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Закрыть
                </button>
              </div>

              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Контакты (телефон/внутренние сообщения) будут подключены на следующем шаге.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
