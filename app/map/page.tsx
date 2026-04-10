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
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: "rgba(14,18,29,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(55,114,255,0.1)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#bcc0ca",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} />
            На главную
          </Link>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="CityVoice"
              width={120}
              height={36}
              style={{ width: "auto", height: 30 }}
            />
          </Link>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#ebf1ff" }}>
            Карта проблем — Алматы
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/problems"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#bcc0ca",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(55,114,255,0.2)",
              background: "rgba(55,114,255,0.05)",
            }}
          >
            Список проблем
          </Link>
          <ReportButton
            label="Сообщить"
            style={{
              background: "linear-gradient(to right, #001E80, #3A50FF)",
              padding: "7px 16px",
              fontSize: "13px",
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
