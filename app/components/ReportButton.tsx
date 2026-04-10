"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { createReport } from "@/src/services/cityvoiceService";
import {
  X,
  Plus,
  Camera,
  MapPin,
  ArrowRight,
  CheckCircle,
  Share2,
  Map,
  Construction,
  Trash2,
  Lightbulb,
  Bus,
  Trees,
  HelpCircle,
  LocateFixed,
  Loader2,
} from "lucide-react";

const CATEGORY_MAP: Record<string, string> = {
  "Дороги":    "roads",
  "Мусор":     "trash",
  "Освещение": "lighting",
  "Транспорт": "transport",
  "Парки":     "parks",
  "Другое":    "other",
};

const CATEGORIES = [
  { label: "Дороги",     Icon: Construction },
  { label: "Мусор",      Icon: Trash2 },
  { label: "Освещение",  Icon: Lightbulb },
  { label: "Транспорт",  Icon: Bus },
  { label: "Парки",      Icon: Trees },
  { label: "Другое",     Icon: HelpCircle },
];

type Step = "form" | "success";

interface Props {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ReportButton({ label = "Сообщить о проблеме", className, style }: Props) {
  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState<Step>("form");
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [category, setCategory]   = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto]         = useState<string | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [address, setAddress]               = useState("");
  const [coords, setCoords]                 = useState<{ lat: number; lon: number } | null>(null);
  const [suggestions, setSuggestions]       = useState<{ label: string; lat?: number; lon?: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [locating, setLocating]             = useState(false);
  const [locateError, setLocateError]       = useState<string | null>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressRef   = useRef<HTMLInputElement>(null);
  const [mounted, setMounted]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const items = (data.results ?? []).map((r: {
          title?: { text?: string };
          subtitle?: { text?: string };
          point?: { lat?: number; lon?: number };
        }) => {
          const title    = r.title?.text ?? "";
          const subtitle = r.subtitle?.text ?? "";
          return {
            label: subtitle ? `${title}, ${subtitle}` : title,
            lat:   r.point?.lat,
            lon:   r.point?.lon,
          };
        });
        setSuggestions(items);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300);
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/geocode?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          if (data.address) {
            const kz = /казахстан|алматы|астана|шымкент|алма-ата/i;
            if (kz.test(data.address)) {
              setAddress(data.address);
              setCoords({ lat: coords.latitude, lon: coords.longitude });
            } else {
              setLocateError("Не удалось определить адрес. Введите вручную.");
            }
          } else {
            setLocateError("Не удалось определить адрес. Введите вручную.");
          }
        } catch {
          setLocateError("Не удалось определить адрес. Введите вручную.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocateError("Геолокация недоступна.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append("category", CATEGORY_MAP[category] ?? "other");
      if (category === "Другое" && customCategory.trim()) {
        fd.append("custom_category", customCategory.trim());
      }
      fd.append("description", description.trim());
      fd.append("address", address.trim());
      fd.append("city", "almaty");
      if (coords) {
        fd.append("lat", String(coords.lat));
        fd.append("lon", String(coords.lon));
      }

      // Convert base64 photo to Blob without fetch() (avoids CSP connect-src)
      if (photo) {
        const [header, b64] = photo.split(",");
        const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
        const bytes = atob(b64);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        fd.append("photo", new Blob([arr], { type: mime }), "photo.jpg");
      }

      const res = await createReport(fd);
      setCreatedId(res.data.id);
      setStep("success");
    } catch {
      setSubmitError("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setCategory(null);
      setDescription("");
      setPhoto(null);
      setCustomCategory("");
      setAddress("");
      setCoords(null);
      setSuggestions([]);
      setLocating(false);
      setLocateError(null);
      setSubmitError(null);
      setCreatedId(null);
    }, 300);
  };

  const isOther = category === "Другое";
  const canSubmit = !!category && description.trim().length > 0 && (!isOther || customCategory.trim().length > 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ?? "btn-primary text-base"}
        style={style ?? { background: "linear-gradient(to right, #001E80, #3A50FF)" }}
      >
        <Plus size={15} />
        {label}
      </button>

      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl"
            style={{
              background: "linear-gradient(160deg, #1a2240 0%, #0e121d 100%)",
              border: "1px solid rgba(55,114,255,0.25)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(55,114,255,0.05)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
              style={{
                background: "linear-gradient(160deg, #1a2240 0%, #131929 100%)",
                borderBottom: "1px solid rgba(55,114,255,0.12)",
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-lg"
                    style={{ background: "linear-gradient(to right, #001E80, #3A50FF)" }}
                  >
                    <Plus size={14} color="#fff" />
                  </div>
                  <span className="font-bold text-white">Сообщить о проблеме</span>
                </div>
                <p className="text-xs mt-0.5 ml-9" style={{ color: "#3772ff" }}>
                  Займёт не больше 10 секунд
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={{ color: "#bcc0ca", background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {step === "form" ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* ── Photo ── */}
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: "#dfe0e5" }}>
                      <Camera size={15} color="#3772ff" />
                      Фото проблемы
                      <span className="text-xs font-normal ml-1" style={{ color: "#bcc0ca" }}>
                        — ускорит решение
                      </span>
                    </label>

                    {photo ? (
                      <div className="relative rounded-xl overflow-hidden" style={{ height: 180 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="preview" className="w-full h-full object-cover" />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
                        />
                        <button
                          type="button"
                          onClick={() => setPhoto(null)}
                          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full"
                          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                        >
                          <X size={13} color="#fff" />
                        </button>
                        <span
                          className="absolute bottom-2 left-3 text-xs font-medium"
                          style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          Фото добавлено
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all"
                        style={{
                          height: 130,
                          border: `2px dashed ${dragging ? "#3772ff" : "rgba(55,114,255,0.35)"}`,
                          background: dragging
                            ? "rgba(55,114,255,0.1)"
                            : "rgba(14,18,29,0.6)",
                        }}
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                      >
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-xl"
                          style={{ background: "rgba(55,114,255,0.12)", border: "1px solid rgba(55,114,255,0.25)" }}
                        >
                          <Camera size={20} color="#3772ff" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold" style={{ color: "#ebf1ff" }}>
                            Добавьте фото — так решат быстрее
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "#bcc0ca" }}>
                            Нажмите или перетащите · PNG, JPG до 10 МБ
                          </p>
                        </div>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                      </div>
                    )}
                  </div>

                  {/* ── Category ── */}
                  <div>
                    <label className="text-sm font-semibold mb-2.5 block" style={{ color: "#dfe0e5" }}>
                      Категория <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map(({ label: cat, Icon }) => {
                        const active = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`category-pill flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${active ? "active" : ""}`}
                            style={
                              active
                                ? {
                                    background: "linear-gradient(to right, rgba(0,30,128,0.8), rgba(58,80,255,0.8))",
                                    border: "1px solid rgba(55,114,255,0.6)",
                                    color: "#fff",
                                  }
                                : {
                                    background: "rgba(14,18,29,0.6)",
                                    border: "1px solid rgba(55,114,255,0.15)",
                                    color: "#bcc0ca",
                                  }
                            }
                          >
                            <Icon size={15} color={active ? "#fff" : "#3772ff"} />
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom category input */}
                    {isOther && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Укажите свою категорию..."
                          autoFocus
                          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                          style={{
                            background: "rgba(14,18,29,0.7)",
                            border: "1px solid rgba(55,114,255,0.4)",
                            color: "#fff",
                          }}
                          onFocus={e => (e.target.style.borderColor = "rgba(55,114,255,0.7)")}
                          onBlur={e => (e.target.style.borderColor = "rgba(55,114,255,0.4)")}
                        />
                      </div>
                    )}
                  </div>

                  {/* ── Description ── */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: "#dfe0e5" }}>
                      Описание <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Например: яма на дороге у перекрёстка Абая — Байтурсынова"
                      rows={3}
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                      style={{
                        background: "rgba(14,18,29,0.7)",
                        border: "1px solid rgba(55,114,255,0.2)",
                        color: "#fff",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(55,114,255,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(55,114,255,0.2)")}
                    />
                  </div>

                  {/* ── Location ── */}
                  <div className="relative z-20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "#dfe0e5" }}>
                        <MapPin size={14} color={coords ? "#4ade80" : "#3772ff"} />
                        Адрес
                        {coords && (
                          <span className="text-xs font-normal" style={{ color: "#4ade80" }}>
                            · координаты получены
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locating}
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
                        style={{
                          background: "rgba(55,114,255,0.1)",
                          border: "1px solid rgba(55,114,255,0.25)",
                          color: "#3772ff",
                          cursor: locating ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e => !locating && (e.currentTarget.style.background = "rgba(55,114,255,0.2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(55,114,255,0.1)")}
                      >
                        {locating
                          ? <Loader2 size={12} className="animate-spin" />
                          : <LocateFixed size={12} />}
                        {locating ? "Определяю..." : "Моё местоположение"}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        ref={addressRef}
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setCoords(null);
                          fetchSuggestions(e.target.value);
                          if (locateError) setLocateError(null);
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(55,114,255,0.6)";
                          if (suggestions.length) setShowSuggestions(true);
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(55,114,255,0.2)";
                          setTimeout(() => setShowSuggestions(false), 150);
                        }}
                        placeholder="Начните вводить адрес..."
                        className="w-full rounded-xl pl-4 pr-10 py-3 text-sm outline-none"
                        style={{
                          background: "rgba(14,18,29,0.7)",
                          border: "1px solid rgba(55,114,255,0.2)",
                          color: "#fff",
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {loadingSuggest ? (
                          <div
                            className="w-4 h-4 rounded-full border-2 animate-spin"
                            style={{ borderColor: "rgba(55,114,255,0.6)", borderTopColor: "transparent" }}
                          />
                        ) : address ? (
                          <button type="button" onClick={() => { setAddress(""); setCoords(null); setSuggestions([]); }}>
                            <X size={14} color="#bcc0ca" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {locateError && (
                      <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
                        {locateError}
                      </p>
                    )}
                  </div>

                  {/* ── Validation hint ── */}
                  {!canSubmit && !submitError && (
                    <p className="text-xs text-center" style={{ color: "#bcc0ca" }}>
                      {!category && !description.trim()
                        ? "Выберите категорию и добавьте описание"
                        : !category
                        ? "Выберите категорию"
                        : "Добавьте описание проблемы"}
                    </p>
                  )}

                  {submitError && (
                    <p className="text-xs text-center" style={{ color: "#f87171" }}>
                      {submitError}
                    </p>
                  )}

                  {/* ── Submit ── */}
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="submit-btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white"
                    style={{
                      background: canSubmit && !submitting
                        ? "linear-gradient(to right, #001E80, #3A50FF)"
                        : "rgba(55,114,255,0.2)",
                      cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                      opacity: canSubmit && !submitting ? 1 : 0.6,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Отправляю...
                      </>
                    ) : (
                      <>
                        Опубликовать проблему
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ── Success ── */
                <div className="flex flex-col items-center text-center gap-5 py-6">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-20 h-20 rounded-full"
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      border: "2px solid rgba(34,197,94,0.35)",
                      boxShadow: "0 0 32px rgba(34,197,94,0.15)",
                    }}
                  >
                    <CheckCircle size={40} color="#4ade80" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Проблема опубликована!</h3>
                    <p className="text-sm" style={{ color: "#4ade80" }}>Теперь её видят все жители города</p>
                  </div>

                  {/* Share CTA */}
                  <div
                    className="w-full rounded-xl px-5 py-4"
                    style={{ background: "rgba(14,18,29,0.6)", border: "1px solid rgba(55,114,255,0.12)" }}
                  >
                    <p className="text-sm font-semibold text-white mb-1">
                      Поделитесь — ускорьте решение
                    </p>
                    <p className="text-xs" style={{ color: "#bcc0ca" }}>
                      Чем больше жителей поддержат проблему, тем сложнее её игнорировать
                    </p>
                  </div>

                  {/* Share buttons */}
                  <div className="flex flex-col gap-2.5 w-full">
                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        createdId
                          ? `https://city.smartalmaty.com/report/${createdId}`
                          : "https://city.smartalmaty.com"
                      )}&text=${encodeURIComponent(
                        `Проблема в Алматы: ${description.trim() || "смотрите на CityVoice"}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold text-white"
                      style={{ background: "linear-gradient(to right, #0088cc, #229ed9)", textDecoration: "none" }}
                    >
                      {/* Telegram icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.09l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.268.47z"/>
                      </svg>
                      Поделиться в Telegram
                    </a>

                    <div className="flex gap-2.5">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                        style={{
                          background: "rgba(55,114,255,0.12)",
                          border: "1px solid rgba(55,114,255,0.25)",
                          color: "#3772ff",
                        }}
                        onClick={() => {
                          const url = createdId
                            ? `https://city.smartalmaty.com/report/${createdId}`
                            : "https://city.smartalmaty.com";
                          navigator.clipboard?.writeText(url);
                        }}
                      >
                        <Share2 size={14} />
                        Скопировать ссылку
                      </button>
                      <a
                        href="/map"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
                        style={{
                          background: "rgba(14,18,29,0.6)",
                          border: "1px solid rgba(55,114,255,0.15)",
                          color: "#bcc0ca",
                          textDecoration: "none",
                        }}
                        onClick={handleClose}
                      >
                        <Map size={14} />
                        На карту
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Suggestions dropdown — separate portal so it escapes overflow:auto */}
      {mounted && showSuggestions && suggestions.length > 0 && createPortal(
        <SuggestDropdown
          inputRef={addressRef}
          suggestions={suggestions}
          onSelect={async (s) => {
            setAddress(s.label);
            setSuggestions([]);
            setShowSuggestions(false);
            if (s.lat !== undefined && s.lon !== undefined) {
              setCoords({ lat: s.lat, lon: s.lon });
            } else {
              // Suggest didn't return coords — forward-geocode the address
              try {
                const res = await fetch(`/api/geocode?q=${encodeURIComponent(s.label)}`);
                const data = await res.json();
                if (data.lat !== null && data.lon !== null) {
                  setCoords({ lat: data.lat, lon: data.lon });
                }
              } catch {
                // coords stay null — not critical
              }
            }
          }}
        />,
        document.body
      )}
    </>
  );
}

type Suggestion = { label: string; lat?: number; lon?: number };

/* ── Dropdown rendered separately so it can recalculate rect on every paint ── */
function SuggestDropdown({
  inputRef,
  suggestions,
  onSelect,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  suggestions: Suggestion[];
  onSelect: (s: Suggestion) => void;
}) {
  const rect = inputRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const openUp     = spaceBelow < 150 && spaceAbove > spaceBelow;
  const maxHeight  = Math.min(240, openUp ? spaceAbove : spaceBelow);

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: "fixed",
        left: rect.left,
        width: rect.width,
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
        zIndex: 10000,
        background: "#1a2240",
        border: "1px solid rgba(55,114,255,0.25)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        maxHeight,
        overflowY: "auto",
      }}
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors"
          style={{
            color: "#dfe0e5",
            borderBottom: i < suggestions.length - 1 ? "1px solid rgba(55,114,255,0.08)" : "none",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(55,114,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          onClick={() => onSelect(s)}
        >
          <MapPin size={13} color={s.lat ? "#4ade80" : "#3772ff"} className="flex-shrink-0" />
          {s.label}
        </button>
      ))}
    </div>
  );
}

