"use client";

import {
  MapPin, Clock, ThumbsUp, Share2,
  Construction, Trash2, Lightbulb, Bus, Trees, HelpCircle,
} from "lucide-react";
import type { Report } from "@/src/services/cityvoiceService";

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  roads:     Construction,
  trash:     Trash2,
  lighting:  Lightbulb,
  transport: Bus,
  parks:     Trees,
  other:     HelpCircle,
};

export const CATEGORY_LABELS: Record<string, string> = {
  roads:     "Дороги",
  trash:     "Мусор",
  lighting:  "Освещение",
  transport: "Транспорт",
  parks:     "Парки",
  other:     "Другое",
};

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cls =
    status === "new"          ? "badge-new"
    : status === "in_progress" ? "badge-progress"
    : "badge-done";
  return (
    <span className={`${cls} text-xs font-medium px-2.5 py-1 rounded-full`}>
      {label}
    </span>
  );
}

interface Props {
  report: Report;
  upvoted: boolean;
  onUpvote: (id: number) => void;
}

export default function ReportCard({ report: r, upvoted, onUpvote }: Props) {
  const Icon = CATEGORY_ICONS[r.category] ?? HelpCircle;

  return (
    <div
      className="card-hover rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(135deg, rgba(40,51,83,0.6), rgba(30,38,62,0.6))",
        border: "1px solid rgba(55,114,255,0.12)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ height: 140, background: "rgba(14,18,29,0.6)" }}
      >
        {r.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.photo_url} alt={r.description} className="w-full h-full object-cover" />
        ) : (
          <Icon size={52} color="#3772ff" strokeWidth={1.25} />
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(55,114,255,0.12)",
              color: "#ebf1ff",
              border: "1px solid rgba(55,114,255,0.2)",
            }}
          >
            {r.custom_category || CATEGORY_LABELS[r.category] || r.category}
          </span>
          <StatusBadge status={r.status} label={r.status_display} />
        </div>

        <p className="text-base font-semibold leading-snug text-white line-clamp-2 flex-1">
          {r.description}
        </p>

        <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "#bcc0ca" }}>
          {r.address && (
            <span className="flex items-center gap-1 truncate max-w-[60%]">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{r.address}</span>
            </span>
          )}
          <span
            className="flex items-center gap-1 font-semibold flex-shrink-0 ml-auto"
            style={{ color: r.days_open > 30 ? "#f87171" : r.days_open > 7 ? "#fbbf24" : "#4ade80" }}
          >
            <Clock size={12} />
            {r.days_open === 0 ? "Сегодня" : `${r.days_open} дн.`}
          </span>
        </div>

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(55,114,255,0.1)" }}
        >
          <button
            onClick={() => onUpvote(r.id)}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{
              color: upvoted ? "#4ade80" : "#3772ff",
              background: "none",
              border: "none",
              cursor: upvoted ? "default" : "pointer",
            }}
          >
            <ThumbsUp size={14} />
            {r.upvotes} поддержали
          </button>
          <button
            onClick={() =>
              navigator.clipboard?.writeText(`https://city.smartalmaty.com/report/${r.id}`)
            }
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: "#bcc0ca", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ebf1ff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#bcc0ca")}
          >
            <Share2 size={14} />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
}
