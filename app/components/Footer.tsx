"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail, Send, ArrowUpRight, CheckCircle, FileText,
  MapPin, Users, TrendingUp, MessageCircle,
} from "lucide-react";

const TELEGRAM_BOT_TOKEN = "8364913089:AAG5rK07-jHVgf1Uspgyf1sgXnkrKXH0ngw";
const TELEGRAM_CHAT_ID   = "@zhancareai";

const STATS = [
  { value: "60+",  label: "Проблем на карте",   Icon: MapPin },
  { value: "3",    label: "Города",              Icon: Users },
  { value: "100%", label: "Открытых данных",     Icon: TrendingUp },
];

const NAV_LINKS = [
  { label: "Главная",        href: "/" },
  { label: "Карта проблем",  href: "/map" },
  { label: "Все проблемы",   href: "/problems" },
  { label: "Сообщить",       href: "/#report" },
];

const LEGAL_LINKS = [
  { label: "Политика данных",  href: "#" },
  { label: "Условия использования", href: "#" },
  { label: "О проекте",        href: "#" },
];

const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/cityvoice_almaty",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.09l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.268.47z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError(true); return; }
    setSubmitting(true);
    setError(false);
    try {
      const msg = `📧 CityVoice подписка\n✉️ ${email}\n⏰ ${new Date().toLocaleString("ru-RU")}`;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg }),
      });
      setSent(true);
      setEmail("");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-pulse-slow absolute top-0 left-1/4 w-96 h-96 rounded-full"
          style={{ background: "rgba(55,114,255,0.06)", filter: "blur(80px)" }} />
        <div className="animate-pulse-slow-2 absolute bottom-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "rgba(99,60,255,0.06)", filter: "blur(80px)" }} />
        {/* Grid */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
          <path d="M0,30 C300,60 900,0 1200,30 L1200,0 L0,0 Z" fill="#0e121d" />
        </svg>
      </div>

      <div className="relative z-10 pt-16 pb-10">
        {/* Stats bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-14">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {STATS.map(({ value, label, Icon }) => (
              <div key={label} className="relative group">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(55,114,255,0.12), rgba(99,60,255,0.12))", filter: "blur(12px)" }} />
                <div className="relative rounded-2xl p-4 sm:p-6 flex items-center justify-between"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
                    <div className="text-xs sm:text-sm" style={{ color: "#8892a4" }}>{label}</div>
                  </div>
                  <Icon size={28} style={{ color: "rgba(55,114,255,0.4)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Brand */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <Link href="/">
                <Image src="/images/logo.png" alt="CityVoice" width={180} height={54}
                  style={{ height: 40, width: "auto" }} />
              </Link>
              <p className="text-sm leading-relaxed" style={{ color: "#8892a4" }}>
                Платформа общественного контроля городской среды. Часть экосистемы{" "}
                <a href="https://zhancare.ai" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#3772ff" }}>ZhanCare AI</a>.
              </p>
              <a href="mailto:support@zhancare.ai"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: "#3772ff", textDecoration: "none" }}>
                <Mail size={15} />
                support@zhancare.ai
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                Навигация
                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)" }} />
              </h3>
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-blue-400"
                    style={{ color: "#8892a4", textDecoration: "none" }}>
                    <CheckCircle size={11} style={{ color: "rgba(55,114,255,0.5)", flexShrink: 0 }} />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                Документы
                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent)" }} />
              </h3>
              <nav className="flex flex-col gap-2">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <a key={label} href={href}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-blue-400"
                    style={{ color: "#8892a4", textDecoration: "none" }}>
                    <FileText size={11} style={{ color: "rgba(55,114,255,0.5)", flexShrink: 0 }} />
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(55,114,255,0.08), rgba(99,60,255,0.05))", filter: "blur(20px)" }} />
                <div className="relative rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ background: "linear-gradient(135deg, rgba(55,114,255,0.2), rgba(99,60,255,0.2))" }}>
                      <Mail size={18} style={{ color: "#3772ff" }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Следите за обновлениями</h3>
                      <p className="text-xs" style={{ color: "#8892a4" }}>Новости платформы и изменения в городе</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(false); setSent(false); }}
                      placeholder="your@email.com"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.15)"}`,
                        color: "#fff",
                      }}
                    />
                    <button type="submit" disabled={submitting}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: "linear-gradient(to right, #001E80, #3A50FF)", flexShrink: 0 }}>
                      {submitting ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <><Send size={15} /><span className="hidden sm:inline">Подписаться</span></>
                      )}
                    </button>
                  </form>

                  {sent && <p className="text-xs mb-4" style={{ color: "#4ade80" }}>Подписка оформлена!</p>}
                  {error && <p className="text-xs mb-4" style={{ color: "#f87171" }}>Введите корректный email.</p>}

                  {/* Socials */}
                  <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8892a4" }}>Мы в соцсетях</p>
                    <div className="flex gap-2">
                      {SOCIALS.map(({ label, href, svg }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#3772ff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(55,114,255,0.4)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8892a4"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                        >
                          {svg}
                        </a>
                      ))}
                      {/* Telegram channel shortcut */}
                      <a href="https://t.me/cityvoice_almaty" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: "rgba(0,136,204,0.12)", border: "1px solid rgba(0,136,204,0.25)", color: "#38bdf8", textDecoration: "none" }}>
                        <MessageCircle size={13} />
                        Telegram-канал
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-10">
            <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 rounded-full"
              style={{ background: "linear-gradient(to right, #3772ff, #6338ff)" }} />
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "#8892a4" }}>
              © {new Date().getFullYear()} CityVoice. Голос города.
            </p>
            <p className="text-sm" style={{ color: "#8892a4" }}>
              Часть экосистемы{" "}
              <a href="https://zhancare.ai" target="_blank" rel="noopener noreferrer"
                style={{ color: "#3772ff", textDecoration: "none" }}>
                ZhanCare AI
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
