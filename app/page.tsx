import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import ReportButton from "./components/ReportButton";
import {
  MapPin,
  Zap,
  ThumbsUp,
  BarChart3,
  Construction,
  Trash2,
  Lightbulb,
  Lock,
  Frown,
  MessageSquareOff,
  Map,
  ArrowRight,
  Share2,
  Clock,
  Timer,
  TrendingUp,
  Megaphone,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CityVoice — Голос города",
  description:
    "Платформа, где проблемы города становятся публичными и начинают решаться.",
};

/* ── Types ────────────────────────────────────────────────────────── */

type Problem = {
  id: number;
  title: string;
  category: string;
  days: number;
  votes: number;
  status: "new" | "progress" | "done";
  statusLabel: string;
  Icon: LucideIcon;
  district: string;
};

type Feature = {
  Icon: LucideIcon;
  title: string;
  desc: string;
};

type Step = {
  n: string;
  title: string;
  desc: string;
};

type ProblemCard = {
  Icon: LucideIcon;
  title: string;
  desc: string;
};

type Highlight = {
  Icon: LucideIcon;
  highlight: string;
  desc: string;
};

/* ── Data ─────────────────────────────────────────────────────────── */

const problems: Problem[] = [
  {
    id: 1,
    title: "Яма на пересечении Абая / Достык",
    category: "Дороги",
    days: 17,
    votes: 124,
    status: "progress",
    statusLabel: "В работе",
    Icon: Construction,
    district: "Медеуский р-н",
  },
  {
    id: 2,
    title: "Мусор у подъезда ул. Тимирязева 42",
    category: "Мусор",
    days: 5,
    votes: 38,
    status: "new",
    statusLabel: "Новая",
    Icon: Trash2,
    district: "Алмалинский р-н",
  },
  {
    id: 3,
    title: "Фонарь не работает 3 месяца",
    category: "Освещение",
    days: 92,
    votes: 201,
    status: "progress",
    statusLabel: "В работе",
    Icon: Lightbulb,
    district: "Бостандыкский р-н",
  },
];

const features: Feature[] = [
  {
    Icon: MapPin,
    title: "Карта проблем",
    desc: "Интерактивная карта города — каждая жалоба становится точкой. Сразу виден масштаб проблем.",
  },
  {
    Icon: Zap,
    title: "За 10 секунд",
    desc: "Фото → текст → категория → геолокация. Без регистрации на старте. Максимально быстро.",
  },
  {
    Icon: ThumbsUp,
    title: "Социальный вес",
    desc: "Другие жители поддерживают проблему. Чем больше голосов — тем выше приоритет.",
  },
  {
    Icon: BarChart3,
    title: "Прозрачные статусы",
    desc: "Новая → В работе → Решена. Каждый видит, что происходит с каждой проблемой.",
  },
];

const steps: Step[] = [
  {
    n: "01",
    title: "Открыл приложение",
    desc: "Видишь карту Алматы с реальными проблемами других жителей.",
  },
  {
    n: "02",
    title: "Нажал «+» и отправил",
    desc: "Фото + короткий текст + геолокация. Не больше 10 секунд.",
  },
  {
    n: "03",
    title: "Видишь результат",
    desc: "Твоя проблема на карте. Другие поддерживают. Город реагирует.",
  },
];

const problemCards: ProblemCard[] = [
  {
    Icon: MessageSquareOff,
    title: "Жалобы теряются",
    desc: "Обращения в акимат уходят в никуда. Нет трекинга, нет ответа.",
  },
  {
    Icon: Lock,
    title: "Нет прозрачности",
    desc: "Никто не знает: взяли ли проблему в работу? Или просто проигнорировали?",
  },
  {
    Icon: Frown,
    title: "Апатия и недоверие",
    desc: "Люди перестают обращаться, потому что не видят результата. Порочный круг.",
  },
];

const highlights: Highlight[] = [
  {
    Icon: Timer,
    highlight: "17 дней без решения",
    desc: "Каждый видит, как долго проблема остаётся нерешённой. Это создаёт давление.",
  },
  {
    Icon: TrendingUp,
    highlight: "124 человека поддержали",
    desc: "Социальное доказательство. Проблема становится общей, а не личной.",
  },
  {
    Icon: Megaphone,
    highlight: "Публично для всех",
    desc: "Журналисты, блогеры, акимат — все видят проблемы города в реальном времени.",
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls =
    status === "new"
      ? "badge-new"
      : status === "progress"
      ? "badge-progress"
      : "badge-done";
  return (
    <span className={`${cls} text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {label}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div style={{ backgroundColor: "#0e121d", color: "#fff", minHeight: "100vh" }}>

      {/* ━━━ NAVBAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Navbar />

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-24 pb-32"
        style={{ height: "100vh", background: "#0e121d" }}
      >
        {/* Solid dark base */}
        <div className="absolute inset-0" style={{ background: "#0a0e1a", zIndex: 0 }} />
        {/* Particle network */}
        <ParticleBackground />
        {/* Subtle blue radial glow in center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(55,114,255,0.10) 0%, transparent 70%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative max-w-3xl mx-auto" style={{ zIndex: 3 }}>
          {/* Badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8"
            style={{
              background: "rgba(55,114,255,0.15)",
              border: "1px solid rgba(55,114,255,0.35)",
              color: "#e1eaff",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping-slow absolute inline-flex h-full w-full rounded-full"
                style={{ background: "#3772ff" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#3772ff" }}
              />
            </span>
            Алматы
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Голос<br />
            <span className="text-shimmer">города</span>
          </h1>

          <p
            className="animate-fade-up delay-200 text-lg sm:text-xl leading-relaxed mb-10 mx-auto max-w-xl"
            style={{ color: "#bcc0ca" }}
          >
            Платформа, где городские проблемы становятся публичными
            и начинают решаться — через прозрачность и общественное давление.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <ReportButton label="Сообщить о проблеме" />
            <a href="#feed" className="btn-ghost text-base">
              Смотреть карту
              <Map size={18} />
            </a>
          </div>

          {/* Stats — each stat in its own glass card */}
          <div className="animate-fade-up delay-500 grid grid-cols-3 gap-4 mt-16 w-full max-w-2xl mx-auto">
            {[
              { n: "1 200+", label: "Проблем зафиксировано" },
              { n: "340",    label: "Решено городом" },
              { n: "8 500+", label: "Жителей поддержали" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 rounded-xl px-3 py-4"
                style={{
                  background: "rgba(14,18,29,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {s.n}
                </span>
                <span className="text-xs sm:text-sm text-center" style={{ color: "#bcc0ca" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PROBLEM SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="px-6 sm:px-10 py-24"
        style={{ background: "linear-gradient(180deg, #0e121d 0%, #1e263e 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#3772ff" }}>
            Проблема
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Сегодня жалобы просто <span style={{ color: "#3772ff" }}>исчезают</span>
          </h2>
          <p className="text-center mb-16 max-w-xl mx-auto" style={{ color: "#bcc0ca" }}>
            Люди видят проблемы каждый день, но система устроена так, что ничего не меняется.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {problemCards.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="card-hover rounded-2xl p-6"
                style={{
                  background: "rgba(40,51,83,0.4)",
                  border: "1px solid rgba(55,114,255,0.12)",
                }}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ background: "rgba(55,114,255,0.1)", border: "1px solid rgba(55,114,255,0.2)" }}
                >
                  <Icon size={22} color="#3772ff" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#bcc0ca" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SOLUTION BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="px-6 sm:px-10 py-10 text-center"
        style={{ background: "linear-gradient(to right, #001E80, #3A50FF)" }}
      >
        <p className="text-xl sm:text-2xl font-semibold" style={{ color: "#ebf1ff" }}>
          CityVoice делает проблемы{" "}
          <span style={{ color: "#fff", fontWeight: 800 }}>видимыми</span> — и их{" "}
          <span style={{ color: "#fff", fontWeight: 800 }}>невозможно игнорировать</span>
        </p>
      </div>

      {/* ━━━ FEATURES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="features"
        className="px-6 sm:px-10 py-24"
        style={{ backgroundColor: "#0e121d" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#3772ff" }}>
            Возможности
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Всё необходимое — в одном месте
          </h2>
          <p className="text-center mb-16 max-w-xl mx-auto" style={{ color: "#bcc0ca" }}>
            Платформа общественного контроля города. Не сайт жалоб — живой городской фид проблем.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="card-hover rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "linear-gradient(135deg, rgba(40,51,83,0.5), rgba(30,38,62,0.5))",
                  border: "1px solid rgba(55,114,255,0.12)",
                }}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ background: "rgba(55,114,255,0.12)", border: "1px solid rgba(55,114,255,0.2)" }}
                >
                  <Icon size={22} color="#3772ff" />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#bcc0ca" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="how"
        className="px-6 sm:px-10 py-24"
        style={{ background: "linear-gradient(180deg, #1e263e 0%, #283353 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#3772ff" }}>
            Как работает
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Три шага до результата
          </h2>

          <div className="flex flex-col">
            {steps.map((s, i) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold flex-shrink-0"
                    style={{ background: "#3772ff", color: "#fff", boxShadow: "0 0 20px rgba(55,114,255,0.4)" }}
                  >
                    {s.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-px flex-1 mt-2 mb-2"
                      style={{ background: "rgba(55,114,255,0.25)", minHeight: 40 }}
                    />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-base" style={{ color: "#bcc0ca" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEED PREVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="feed"
        className="px-6 sm:px-10 py-24"
        style={{ backgroundColor: "#0e121d" }}
      >
        <div className="max-w-6xl mx-auto">
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
              {["Все", "Популярные", "Долго"].map((tab, i) => (
                <span
                  key={tab}
                  className="px-4 py-2 rounded-lg cursor-pointer"
                  style={i === 1 ? { background: "#3772ff", color: "#fff" } : { color: "#bcc0ca" }}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.id}
                className="card-hover rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(40,51,83,0.6), rgba(30,38,62,0.6))",
                  border: "1px solid rgba(55,114,255,0.12)",
                }}
              >
                {/* Card thumbnail */}
                <div
                  className="flex items-center justify-center"
                  style={{ height: 140, background: "rgba(14,18,29,0.6)" }}
                >
                  <p.Icon size={52} color="#3772ff" strokeWidth={1.25} />
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(55,114,255,0.12)",
                        color: "#ebf1ff",
                        border: "1px solid rgba(55,114,255,0.2)",
                      }}
                    >
                      {p.category}
                    </span>
                    <StatusBadge status={p.status} label={p.statusLabel} />
                  </div>

                  <h3 className="text-base font-semibold leading-snug text-white">{p.title}</h3>

                  <div className="flex items-center gap-4 text-xs" style={{ color: "#bcc0ca" }}>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {p.district}
                    </span>
                    <span
                      className="flex items-center gap-1 font-semibold"
                      style={{ color: p.days > 30 ? "#f87171" : "#fbbf24" }}
                    >
                      <Clock size={12} />
                      {p.days} дн.
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid rgba(55,114,255,0.1)" }}
                  >
                    <button
                      className="flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: "#3772ff", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <ThumbsUp size={14} />
                      {p.votes} поддержали
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-sm"
                      style={{ color: "#bcc0ca", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Share2 size={14} />
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <a href="#" className="btn-ghost">
              Смотреть все проблемы на карте
              <Map size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ UX HIGHLIGHTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="px-6 sm:px-10 py-20"
        style={{ background: "linear-gradient(135deg, #1e263e, #283353)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {highlights.map(({ Icon, highlight, desc }) => (
            <div key={highlight} className="flex flex-col gap-4 text-center items-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: "rgba(55,114,255,0.12)",
                  border: "1px solid rgba(55,114,255,0.25)",
                }}
              >
                <Icon size={28} color="#3772ff" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#ebf1ff" }}>{highlight}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#bcc0ca" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 py-32 text-center"
        style={{ backgroundColor: "#0e121d" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="animate-pulse-slow absolute rounded-full blur-3xl"
            style={{
              width: 700, height: 400,
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse, rgba(55,114,255,0.2) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="grid-overlay absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#3772ff" }}>
            Присоединяйся
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Сделай свой город<br />
            <span className="text-shimmer">лучше сегодня</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "#bcc0ca" }}>
            Увидел проблему? Сообщи за 10 секунд. Чем больше нас — тем быстрее решения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ReportButton label="Сообщить о проблеме" />
            <a href="#" className="btn-ghost text-base">
              Смотреть карту
              <Map size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer
        className="px-6 sm:px-10 py-10"
        style={{ borderTop: "1px solid rgba(40,51,83,0.8)", backgroundColor: "#0e121d" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <a href="#" className="flex items-center" style={{ textDecoration: "none" }}>
            <Image
              src="/images/logo.png"
              alt="CityVoice"
              width={140}
              height={42}
              style={{ height: "36px", width: "auto" }}
            />
          </a>

          <div className="flex items-center gap-6 text-sm" style={{ color: "#bcc0ca" }}>
            <a href="#" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>Алматы</a>
            <a href="#" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>Астана</a>
            <a href="#" className="hover:text-white transition-colors" style={{ textDecoration: "none" }}>Ташкент</a>
          </div>

          <p className="text-sm" style={{ color: "#bcc0ca" }}>
            © 2025 CityVoice. Голос города.
          </p>
        </div>
      </footer>
    </div>
  );
}
