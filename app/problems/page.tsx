"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Construction, Trash2, Lightbulb, Bus, Trees, HelpCircle,
  ArrowLeft,
} from "lucide-react";
import ReportButton from "@/app/components/ReportButton";
import ReportCard from "@/app/components/ReportCard";
import {
  fetchReports,
  upvoteReport,
  type Report,
  type ReportOrdering,
  type ReportCategory,
  type ReportStatus,
} from "@/src/services/cityvoiceService";

const PAGE_SIZE = 100;

const CATEGORY_FILTERS: { key: ReportCategory | "all"; label: string; Icon: React.ElementType }[] = [
  { key: "all",       label: "Все",        Icon: SlidersHorizontal },
  { key: "roads",     label: "Дороги",     Icon: Construction },
  { key: "trash",     label: "Мусор",      Icon: Trash2 },
  { key: "lighting",  label: "Освещение",  Icon: Lightbulb },
  { key: "transport", label: "Транспорт",  Icon: Bus },
  { key: "parks",     label: "Парки",      Icon: Trees },
  { key: "other",     label: "Другое",     Icon: HelpCircle },
];

const STATUS_FILTERS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "all",         label: "Все статусы" },
  { key: "new",         label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "resolved",    label: "Решённые" },
];

const SORT_OPTIONS: { key: ReportOrdering; label: string }[] = [
  { key: "-created_at", label: "Сначала новые" },
  { key: "-upvotes",    label: "По популярности" },
  { key: "created_at",  label: "Давно не решаются" },
];

export default function ProblemsPage() {
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory]   = useState<ReportCategory | "all">("all");
  const [status, setStatus]       = useState<ReportStatus | "all">("all");
  const [ordering, setOrdering]   = useState<ReportOrdering>("-created_at");
  const [upvoted, setUpvoted]     = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("cv_upvoted");
      return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>();
    } catch { return new Set<number>(); }
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        ordering,
        page,
        page_size: PAGE_SIZE,
      };
      if (category !== "all") params.category = category;
      if (status !== "all")   params.status   = status;
      if (debouncedSearch)    params.search    = debouncedSearch;

      const { data } = await fetchReports(params as never);
      // Django may return paginated {count, results} or plain array
      if (Array.isArray(data)) {
        setReports(data);
        setTotal(data.length);
      } else {
        const paged = data as unknown as { count: number; results: Report[] };
        setReports(paged.results ?? []);
        setTotal(paged.count ?? 0);
      }
    } catch {
      setReports([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, category, status, ordering, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [category, status, ordering, debouncedSearch]);

  const handleUpvote = async (id: number) => {
    if (upvoted.has(id)) return;
    const next = new Set(upvoted).add(id);
    setUpvoted(next);
    try { localStorage.setItem("cv_upvoted", JSON.stringify([...next])); } catch { /* ignore */ }
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    await upvoteReport(id);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen" style={{ background: "#0e121d", color: "#fff" }}>

      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-50 px-6 sm:px-10 py-3"
        style={{
          background: "rgba(14,18,29,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(55,114,255,0.1)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm" style={{ color: "#bcc0ca" }}>
              <ArrowLeft size={16} />
              На главную
            </Link>
            <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.1)" }} />
            <Link href="/">
              <Image src="/images/logo.png" alt="CityVoice" width={120} height={36} style={{ width: "auto", height: 32 }} />
            </Link>
          </div>
          <ReportButton
            label="Сообщить проблему"
            style={{ background: "linear-gradient(to right, #001E80, #3A50FF)", padding: "8px 16px", fontSize: "13px" }}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10">

        {/* ── Page title ── */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#3772ff" }}>
            Все проблемы
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Проблемы города
            {total > 0 && (
              <span className="ml-3 text-lg font-normal" style={{ color: "#bcc0ca" }}>
                {total}
              </span>
            )}
          </h1>
        </div>

        {/* ── Filters bar ── */}
        <div className="flex flex-col gap-4 mb-8">

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#bcc0ca" }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по описанию или адресу..."
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(40,51,83,0.5)",
                  border: "1px solid rgba(55,114,255,0.15)",
                  color: "#fff",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(55,114,255,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(55,114,255,0.15)")}
              />
            </div>

            <select
              value={ordering}
              onChange={e => setOrdering(e.target.value as ReportOrdering)}
              className="rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
              style={{
                background: "rgba(40,51,83,0.5)",
                border: "1px solid rgba(55,114,255,0.15)",
                color: "#dfe0e5",
                minWidth: 180,
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.key} value={o.key} style={{ background: "#1a2240" }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map(({ key, label, Icon }) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={
                    active
                      ? { background: "linear-gradient(to right, #001E80, #3A50FF)", color: "#fff", border: "1px solid rgba(55,114,255,0.6)" }
                      : { background: "rgba(40,51,83,0.4)", color: "#bcc0ca", border: "1px solid rgba(55,114,255,0.12)" }
                  }
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ key, label }) => {
              const active = status === key;
              return (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={
                    active
                      ? { background: "rgba(55,114,255,0.2)", color: "#ebf1ff", border: "1px solid rgba(55,114,255,0.5)" }
                      : { background: "transparent", color: "#bcc0ca", border: "1px solid rgba(55,114,255,0.1)" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{
                  background: "rgba(40,51,83,0.4)",
                  border: "1px solid rgba(55,114,255,0.08)",
                  height: 280,
                  opacity: Math.max(0.1, 0.5 - i * 0.03),
                }}
              />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ border: "1px dashed rgba(55,114,255,0.2)", background: "rgba(14,18,29,0.4)" }}
          >
            <Search size={40} color="#3772ff" strokeWidth={1.25} />
            <p className="mt-4 text-base font-semibold text-white">Ничего не найдено</p>
            <p className="text-sm mt-1" style={{ color: "#bcc0ca" }}>
              Попробуйте изменить фильтры или сбросить поиск
            </p>
            <button
              onClick={() => { setCategory("all"); setStatus("all"); setSearch(""); }}
              className="mt-4 text-sm px-4 py-2 rounded-lg"
              style={{ background: "rgba(55,114,255,0.15)", color: "#3772ff", border: "1px solid rgba(55,114,255,0.3)" }}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {reports.map(r => (
              <ReportCard
                key={r.id}
                report={r}
                upvoted={upvoted.has(r.id)}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{
                background: "rgba(40,51,83,0.5)",
                border: "1px solid rgba(55,114,255,0.15)",
                color: "#dfe0e5",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={16} />
              Назад
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | "...")[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: "#bcc0ca" }}>…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                      style={
                        page === n
                          ? { background: "#3772ff", color: "#fff" }
                          : { background: "rgba(40,51,83,0.4)", color: "#bcc0ca", border: "1px solid rgba(55,114,255,0.1)" }
                      }
                    >
                      {n}
                    </button>
                  )
                )
              }
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{
                background: "rgba(40,51,83,0.5)",
                border: "1px solid rgba(55,114,255,0.15)",
                color: "#dfe0e5",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Вперёд
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
