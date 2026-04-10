"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import ReportCard from "./ReportCard";
import { fetchReports, upvoteReport, type Report, type ReportOrdering } from "@/src/services/cityvoiceService";

type Tab = "all" | "popular" | "old";

const TABS: [Tab, string][] = [
  ["all",     "Все"],
  ["popular", "Популярные"],
  ["old",     "Долго"],
];

const ORDERING: Record<Tab, ReportOrdering> = {
  all:     "-created_at",
  popular: "-upvotes",
  old:     "created_at",
};

export default function FeedSection() {
  const [tab, setTab]         = useState<Tab>("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState<Set<number>>(new Set());

  const loadReports = useCallback(async (t: Tab) => {
    setLoading(true);
    try {
      const { data } = await fetchReports({ city: "almaty", ordering: ORDERING[t] });
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReports(tab); }, [tab, loadReports]);

  const handleUpvote = async (id: number) => {
    if (upvoted.has(id)) return;
    setUpvoted(prev => new Set(prev).add(id));
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    await upvoteReport(id);
  };

  const displayed = reports.slice(0, 9);

  return (
    <section id="feed" className="px-6 sm:px-10 py-24" style={{ backgroundColor: "#0e121d" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#3772ff" }}>
              Лента
            </p>
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold">
              <Flame size={32} color="#f87171" />
              Горячие проблемы
            </h2>
          </div>

          <div
            className="flex items-center gap-1 rounded-xl p-1 text-sm font-medium"
            style={{ background: "rgba(40,51,83,0.5)", border: "1px solid rgba(55,114,255,0.12)" }}
          >
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-4 py-2 rounded-lg transition-all"
                style={
                  tab === key
                    ? { background: "#3772ff", color: "#fff" }
                    : { color: "#bcc0ca", background: "transparent", border: "none", cursor: "pointer" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(40,51,83,0.6), rgba(30,38,62,0.6))",
                  border: "1px solid rgba(55,114,255,0.12)",
                  height: 280,
                  opacity: Math.max(0.15, 0.5 - i * 0.04),
                }}
              />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ border: "1px dashed rgba(55,114,255,0.2)", background: "rgba(14,18,29,0.4)" }}
          >
            <Flame size={40} color="#3772ff" strokeWidth={1.25} />
            <p className="mt-4 text-base font-semibold text-white">Проблем пока нет</p>
            <p className="text-sm mt-1" style={{ color: "#bcc0ca" }}>
              Будьте первым — сообщите о проблеме в своём районе
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map(r => (
              <ReportCard
                key={r.id}
                report={r}
                upvoted={upvoted.has(r.id)}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Link href="/problems" className="btn-ghost">
            Все проблемы
            <ArrowRight size={18} />
          </Link>
          <Link href="/map" className="btn-ghost">
            Карта проблем
            <Map size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
