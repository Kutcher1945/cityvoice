"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import ReportButton from "./ReportButton";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setIsScrolled(y > 50);

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    setScrollProgress(Math.min((y / maxScroll) * 100, 100));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }, []);

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-500 ease-out"
      style={
        isScrolled
          ? {
              backgroundColor: "rgba(14,18,29,0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      <div className="container mx-auto flex items-center justify-between px-6 sm:px-10 py-3 max-w-7xl">
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none" }}>
          <Image
            src="/images/logo.png"
            alt="CityVoice"
            width={160}
            height={48}
            className="h-8 sm:h-10 lg:h-12 w-auto transition-transform hover:scale-105"
            style={{ width: "auto" }}
            priority
          />
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-white">
          {[
            { label: "Возможности", id: "features" },
            { label: "Как работает", id: "how" },
            { label: "Лента",        id: "feed"     },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="group relative px-4 py-1.5 rounded-full border transition-all duration-200 text-white hover:text-[#0e121d] focus:outline-none"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <span className="relative z-10">{label}</span>
              <div className="absolute inset-0 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200" />
            </button>
          ))}
          <Link
            href="/problems"
            className="group relative px-4 py-1.5 rounded-full border transition-all duration-200 text-white hover:text-[#0e121d] focus:outline-none"
            style={{ borderColor: "rgba(55,114,255,0.6)", background: "rgba(55,114,255,0.1)" }}
          >
            <span className="relative z-10">Проблемы</span>
            <div className="absolute inset-0 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200" />
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden sm:block text-sm font-medium text-white px-4 py-1.5 rounded-full border transition-all duration-200 hover:bg-white hover:text-[#0e121d]"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Войти
          </button>

          <ReportButton
            label="Сообщить проблему"
            style={{ background: "linear-gradient(to right, #001E80, #3A50FF)", padding: "10px 20px", fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Scroll progress bar */}
      {isScrolled && scrollProgress > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(to right, #001E80, #3A50FF)",
          }}
        />
      )}
    </header>
  );
}
