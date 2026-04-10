import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Map, List, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Проблема опубликована — CityVoice",
  robots: { index: false }, // not indexed, conversion page only
};

export default function SuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #0e121d 0%, #131929 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col items-center text-center gap-6 p-8"
        style={{
          background: "linear-gradient(160deg, #1a2240 0%, #0e121d 100%)",
          border: "1px solid rgba(55,114,255,0.2)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <Link href="/">
          <Image src="/images/logo.png" alt="CityVoice" width={160} height={48}
            style={{ height: 36, width: "auto" }} />
        </Link>

        <div
          className="flex items-center justify-center w-20 h-20 rounded-full"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "2px solid rgba(34,197,94,0.35)",
            boxShadow: "0 0 40px rgba(34,197,94,0.15)",
          }}
        >
          <CheckCircle size={40} color="#4ade80" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Проблема опубликована!</h1>
          <p className="text-sm" style={{ color: "#4ade80" }}>Теперь её видят все жители города</p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#bcc0ca" }}>
          Поделитесь с соседями — чем больше поддержки наберёт проблема,
          тем быстрее на неё отреагируют.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <a
            href="https://t.me/share/url?url=https%3A%2F%2Fcity.smartalmaty.com&text=%D0%9F%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B%20%D0%BD%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(to right, #0088cc, #229ed9)", textDecoration: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.09l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.268.47z"/>
            </svg>
            Поделиться в Telegram
          </a>

          <div className="flex gap-3">
            <Link href="/map"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(55,114,255,0.12)", border: "1px solid rgba(55,114,255,0.25)", color: "#3772ff", textDecoration: "none" }}>
              <Map size={15} />
              На карту
            </Link>
            <Link href="/problems"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(14,18,29,0.6)", border: "1px solid rgba(55,114,255,0.15)", color: "#bcc0ca", textDecoration: "none" }}>
              <List size={15} />
              Все проблемы
            </Link>
          </div>

          <Link href="/"
            className="text-sm transition-colors"
            style={{ color: "#8892a4", textDecoration: "none" }}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
