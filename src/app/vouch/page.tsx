"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Users, Search, BadgeCheck, MapPin, UserPlus, AlertTriangle } from "lucide-react";

type TrustLevel = "passphrase" | "vouched" | "council";

interface Member {
  id: string;
  name: string;
  ville: string;
  pays: string;
  teip?: string;
  trust: TrustLevel;
  vouchedBy?: string;
}

const TRUST_META: Record<TrustLevel, { label: string; color: string }> = {
  passphrase: { label: "Сессия", color: "text-gray-700 bg-gray-50" },
  vouched: { label: "Поручено", color: "text-emerald-700 bg-emerald-50" },
  council: { label: "Совет", color: "text-indigo-700 bg-indigo-50" },
};

const SAMPLE_MEMBERS: Member[] = [
  {
    id: "M1",
    name: "Иса М.",
    ville: "Страсбург",
    pays: "Франция",
    teip: "Шолой",
    trust: "council",
  },
  {
    id: "M2",
    name: "Амина И.",
    ville: "Вена",
    pays: "Австрия",
    teip: "Белтой",
    trust: "vouched",
    vouchedBy: "Иса М.",
  },
  {
    id: "M3",
    name: "Зелим У.",
    ville: "Берлин",
    pays: "Германия",
    teip: "Гехой",
    trust: "passphrase",
  },
];

export default function VouchPage() {
  const [query, setQuery] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [invite, setInvite] = useState({ name: "", ville: "", pays: "Франция", note: "" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_MEMBERS;
    return SAMPLE_MEMBERS.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.ville.toLowerCase().includes(q) ||
        m.pays.toLowerCase().includes(q) ||
        (m.teip || "").toLowerCase().includes(q)
      );
    });
  }, [query]);

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite.name.trim() || !invite.ville.trim()) return;
    setIsInviting(false);
    setInvite({ name: "", ville: "", pays: "Франция", note: "" });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-black/5 pt-safe-top">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Доверие</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">поручительство</p>
          </div>
          <button
            onClick={() => setIsInviting(true)}
            className="p-2 bg-black text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <UserPlus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-emerald-50 border border-emerald-100/50 rounded-[2rem] p-6 flex gap-4 items-start">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <div className="font-black text-emerald-900 tracking-tight">Сеть доверия</div>
            <div className="text-sm text-emerald-900/70 font-medium leading-relaxed">
              Превью механики: passphrase даёт доступ, а поручительство делает доверие видимым.
            </div>
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: имя, город, тайп..."
            className="w-full bg-white border border-black/5 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-black/10 outline-none shadow-sm"
          />
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Участники</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">превью</span>
          </div>

          <div className="space-y-4">
            {filtered.map((m) => {
              const trust = TRUST_META[m.trust];
              return (
                <div key={m.id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-black tracking-tight">{m.name}</div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${trust.color}`}>
                          <span className="inline-flex items-center gap-2">
                            <BadgeCheck size={14} />
                            {trust.label}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="inline-flex items-center gap-2">
                          <MapPin size={14} /> {m.ville}, {m.pays}
                        </span>
                        {m.teip && (
                          <span className="inline-flex items-center gap-2">
                            <Users size={14} /> {m.teip}
                          </span>
                        )}
                      </div>

                      {m.vouchedBy && (
                        <div className="text-sm text-gray-600 font-medium">
                          Поручился: <span className="font-bold">{m.vouchedBy}</span>
                        </div>
                      )}
                    </div>

                    <button className="px-4 py-2 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all">
                      Профиль
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-100/50 rounded-[2rem] p-6 flex gap-4 items-start">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-700">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <div className="font-black text-amber-900 tracking-tight">Анти-WhatsApp смысл</div>
            <div className="text-sm text-amber-900/70 font-medium leading-relaxed">
              Здесь доверие не «в чате» и не «по знакомству». Оно становится структурой: кто поручился, когда, и с какой ответственностью.
            </div>
          </div>
        </section>
      </main>

      {isInviting && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-black/10 overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <div className="text-2xl font-black tracking-tight">Пригласить / поручиться</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">превью без базы данных</div>
            </div>

            <form onSubmit={submitInvite} className="p-6 space-y-4">
              <input
                value={invite.name}
                onChange={(e) => setInvite((d) => ({ ...d, name: e.target.value }))}
                placeholder="Имя (как в общине)"
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={invite.ville}
                  onChange={(e) => setInvite((d) => ({ ...d, ville: e.target.value }))}
                  placeholder="Город"
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none"
                />
                <input
                  value={invite.pays}
                  onChange={(e) => setInvite((d) => ({ ...d, pays: e.target.value }))}
                  placeholder="Страна"
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none"
                />
              </div>

              <textarea
                value={invite.note}
                onChange={(e) => setInvite((d) => ({ ...d, note: e.target.value }))}
                placeholder="Короткая заметка (опционально)"
                rows={3}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 text-sm font-medium outline-none resize-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviting(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-2xl bg-black text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
