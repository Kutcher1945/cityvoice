import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://city.smartalmaty.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CityVoice — Голос города | Сообщить о проблеме в Алматы",
    template: "%s | CityVoice",
  },
  description:
    "CityVoice — платформа для жителей Алматы, Астаны и Ташкента: сообщайте о ямах на дорогах, мусоре, сломанных фонарях и других городских проблемах. Проблемы становятся публичными и решаются быстрее.",
  keywords: [
    "городские проблемы Алматы",
    "сообщить о проблеме Алматы",
    "ямы на дорогах Алматы",
    "мусор Алматы",
    "CityVoice",
    "голос города",
    "городские жалобы",
    "проблемы города",
    "Алматы дороги",
    "Астана проблемы",
    "Ташкент жалобы",
    "civic tech Казахстан",
    "городская платформа",
  ],
  authors: [{ name: "CityVoice" }],
  creator: "CityVoice",
  publisher: "CityVoice",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ru-KZ": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "CityVoice",
    title: "CityVoice — Голос города | Сообщить о проблеме в Алматы",
    description:
      "Сообщайте о городских проблемах в Алматы и Астане — ямы, мусор, освещение, транспорт. Проблемы становятся публичными и решаются быстрее.",
    locale: "ru_KZ",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "CityVoice — Голос города",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CityVoice — Голос города",
    description:
      "Сообщайте о городских проблемах в Алматы и Астане. Ямы, мусор, освещение — всё становится публичным.",
    images: ["/images/og-image.png"],
    creator: "@cityvoicekz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "48x48",   type: "image/x-icon" },
      { url: "/favicon-16x16.png",  sizes: "16x16",   type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32",   type: "image/png" },
    ],
    apple:   [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other:   [{ url: "/android-chrome-192x192.png", sizes: "192x192", rel: "icon" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  category: "civic technology",
  other: {
    "theme-color": "#3772ff",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CityVoice",
  url: BASE_URL,
  description:
    "Платформа для жителей Алматы и Казахстана: сообщайте о городских проблемах — ямы, мусор, освещение, транспорт.",
  inLanguage: "ru",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "CityVoice",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/logo.png`,
    },
    areaServed: [
      { "@type": "City", name: "Алматы" },
      { "@type": "City", name: "Астана" },
      { "@type": "City", name: "Ташкент" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
