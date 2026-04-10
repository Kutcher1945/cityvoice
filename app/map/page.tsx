"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import ReportButton from "@/app/components/ReportButton";

// Leaflet must be loaded client-side only — no SSR
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e121d",
        color: "#bcc0ca",
        fontSize: 14,
      }}
    >
      Загрузка карты...
    </div>
  ),
});

export default function MapPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0e121d" }}>

      {/* ── Header ── */}
      <header
        style={{
          flexShrink: 0,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          background: "rgba(14,18,29,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(55,114,255,0.1)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
          zIndex: 50,
          minWidth: 0,
        }}
      >
        {/* Left: back + logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <Link
            href="/"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "#bcc0ca",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">На главную</span>
          </Link>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image
              src="/images/logo.png"
              alt="CityVoice"
              width={120}
              height={36}
              style={{ width: "auto", height: 26 }}
            />
          </Link>
          {/* Title — hidden on very small screens */}
          <span
            className="hidden md:inline"
            style={{ fontSize: 12, fontWeight: 600, color: "#ebf1ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            Карта проблем — Алматы
          </span>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link
            href="/problems"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#bcc0ca",
              textDecoration: "none",
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid rgba(55,114,255,0.2)",
              background: "rgba(55,114,255,0.05)",
              whiteSpace: "nowrap",
            }}
          >
            Список
          </Link>
          <ReportButton
            label="+ Сообщить"
            style={{
              background: "linear-gradient(to right, #001E80, #3A50FF)",
              padding: "6px 12px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          />
        </div>
      </header>

      {/* ── Map fills the rest ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <MapView />
      </div>
    </div>
  );
}
