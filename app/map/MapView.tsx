"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ThumbsUp, Clock, Share2, MapPin,
  Construction, Trash2, Lightbulb, Bus, Trees, HelpCircle,
  LocateFixed,
} from "lucide-react";
import ReportButton from "@/app/components/ReportButton";
import {
  fetchReports,
  upvoteReport,
  type Report,
  type ReportCategory,
  type ReportStatus,
} from "@/src/services/cityvoiceService";

// ── Category colors ──────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  roads:     "#f87171",
  trash:     "#fbbf24",
  lighting:  "#a78bfa",
  transport: "#38bdf8",
  parks:     "#4ade80",
  other:     "#94a3b8",
};

const CAT_LABEL: Record<string, string> = {
  roads: "Дороги", trash: "Мусор", lighting: "Освещение",
  transport: "Транспорт", parks: "Парки", other: "Другое",
};

const CAT_ICONS: Record<string, React.ElementType> = {
  roads: Construction, trash: Trash2, lighting: Lightbulb,
  transport: Bus, parks: Trees, other: HelpCircle,
};

const STATUS_COLOR: Record<string, string> = {
  new:         "#f87171",
  in_progress: "#fbbf24",
  resolved:    "#4ade80",
};

// Create SVG pin marker per category
function makeIcon(category: string) {
  const color = CAT_COLOR[category] ?? "#3772ff";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="16" r="7" fill="rgba(0,0,0,0.25)"/>
      <circle cx="16" cy="16" r="5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize:   [32, 40],
    iconAnchor: [16, 40],
    popupAnchor:[0, -44],
  });
}

// Fly to user location
function LocateButton() {
  const map = useMap();
  return (
    <button
      onClick={() => {
        navigator.geolocation?.getCurrentPosition(({ coords }) => {
          map.flyTo([coords.latitude, coords.longitude], 15, { duration: 1.2 });
        });
      }}
      title="Моё местоположение"
      style={{
        position: "absolute",
        bottom: 100,
        right: 10,
        zIndex: 1000,
        width: 36,
        height: 36,
        borderRadius: 8,
        background: "#1a2240",
        border: "1px solid rgba(55,114,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <LocateFixed size={16} color="#3772ff" />
    </button>
  );
}

// ── Filter bar ────────────────────────────────────────────────────
const CATEGORY_FILTERS: { key: ReportCategory | "all"; label: string }[] = [
  { key: "all",       label: "Все" },
  { key: "roads",     label: "Дороги" },
  { key: "trash",     label: "Мусор" },
  { key: "lighting",  label: "Освещение" },
  { key: "transport", label: "Транспорт" },
  { key: "parks",     label: "Парки" },
  { key: "other",     label: "Другое" },
];

const STATUS_FILTERS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "all",         label: "Все" },
  { key: "new",         label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "resolved",    label: "Решённые" },
];

export default function MapView() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState<ReportCategory | "all">("all");
  const [status, setStatus]     = useState<ReportStatus | "all">("all");
  const [upvoted, setUpvoted]   = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("cv_upvoted");
      return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>();
    } catch { return new Set<number>(); }
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page_size: "500" };
      if (category !== "all") params.category = category;
      if (status   !== "all") params.status   = status;
      const { data } = await fetchReports(params as never);
      const list = Array.isArray(data) ? data : (data as { results: Report[] }).results ?? [];
      setReports(list.filter(r => r.latitude && r.longitude));
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [category, status]);

  useEffect(() => { load(); }, [load]);

  const handleUpvote = async (id: number) => {
    if (upvoted.has(id)) return;
    const next = new Set(upvoted).add(id);
    setUpvoted(next);
    try { localStorage.setItem("cv_upvoted", JSON.stringify([...next])); } catch { /* ignore */ }
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    await upvoteReport(id);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* ── Filter panel ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Category row */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "all",
          }}
        >
          {CATEGORY_FILTERS.map(({ key, label }) => {
            const active = category === key;
            const color  = key === "all" ? "#3772ff" : CAT_COLOR[key];
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${active ? color : "rgba(255,255,255,0.15)"}`,
                  background: active ? `${color}22` : "rgba(14,18,29,0.85)",
                  color: active ? color : "#bcc0ca",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Status row */}
        <div style={{ display: "flex", gap: 6, pointerEvents: "all" }}>
          {STATUS_FILTERS.map(({ key, label }) => {
            const active = status === key;
            const color  = key === "all" ? "#3772ff" : STATUS_COLOR[key];
            return (
              <button
                key={key}
                onClick={() => setStatus(key)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
                  background: active ? `${color}22` : "rgba(14,18,29,0.85)",
                  color: active ? color : "#8892a4",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Count badge ── */}
      {!loading && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 12,
            zIndex: 1000,
            background: "rgba(14,18,29,0.9)",
            border: "1px solid rgba(55,114,255,0.25)",
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 12,
            color: "#bcc0ca",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ color: "#3772ff", fontWeight: 700 }}>{reports.length}</span> проблем на карте
        </div>
      )}

      {/* ── Map ── */}
      <MapContainer
        center={[43.238, 76.889]}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        <LocateButton />

        {reports.map(r => {
          const Icon = CAT_ICONS[r.category] ?? HelpCircle;
          return (
            <Marker
              key={r.id}
              position={[r.latitude!, r.longitude!]}
              icon={makeIcon(r.category)}
            >
              <Popup
                minWidth={300}
                maxWidth={340}
              >
                <div style={{
                  background: "#1a2240",
                  borderRadius: 14,
                  overflow: "hidden",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}>
                  {/* Photo or icon */}
                  {r.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.photo_url}
                      alt={r.description}
                      style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{
                      height: 100,
                      background: "rgba(14,18,29,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Icon size={44} color={CAT_COLOR[r.category] ?? "#3772ff"} />
                    </div>
                  )}

                  <div style={{ padding: "16px 20px 20px" }}>
                    {/* Category + status */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: `${CAT_COLOR[r.category] ?? "#3772ff"}22`,
                        color: CAT_COLOR[r.category] ?? "#3772ff",
                        border: `1px solid ${CAT_COLOR[r.category] ?? "#3772ff"}44`,
                      }}>
                        {r.custom_category || CAT_LABEL[r.category] || r.category}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: `${STATUS_COLOR[r.status] ?? "#3772ff"}22`,
                        color: STATUS_COLOR[r.status] ?? "#3772ff",
                        border: `1px solid ${STATUS_COLOR[r.status] ?? "#3772ff"}44`,
                      }}>
                        {r.status_display}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      margin: "0 0 10px",
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {r.description}
                    </p>

                    {/* Address + days */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                      {r.address && (
                        <span style={{ fontSize: 12, color: "#8892a4", display: "flex", gap: 4, alignItems: "center", flex: 1, overflow: "hidden" }}>
                          <MapPin size={11} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.address}</span>
                        </span>
                      )}
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        flexShrink: 0,
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                        color: r.days_open > 30 ? "#f87171" : r.days_open > 7 ? "#fbbf24" : "#4ade80",
                      }}>
                        <Clock size={11} />
                        {r.days_open === 0 ? "Сегодня" : `${r.days_open} дн.`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleUpvote(r.id)}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          border: "none",
                          cursor: upvoted.has(r.id) ? "default" : "pointer",
                          background: upvoted.has(r.id) ? "rgba(74,222,128,0.15)" : "rgba(55,114,255,0.15)",
                          color: upvoted.has(r.id) ? "#4ade80" : "#3772ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <ThumbsUp size={14} />
                        {r.upvotes} поддержали
                      </button>
                      <button
                        onClick={() => navigator.clipboard?.writeText(`https://city.smartalmaty.com/report/${r.id}`)}
                        style={{
                          flex: 1,
                          padding: "9px 12px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          border: "1px solid rgba(255,255,255,0.1)",
                          cursor: "pointer",
                          background: "rgba(255,255,255,0.05)",
                          color: "#bcc0ca",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Share2 size={14} />
                        Поделиться
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
