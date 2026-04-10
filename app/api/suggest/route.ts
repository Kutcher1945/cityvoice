import { NextRequest, NextResponse } from "next/server";

const YANDEX_KEY = "c5dd4ece-8085-4dd1-8040-119aa0a6e64a";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ results: [] });

  const url = new URL("https://suggest-maps.yandex.ru/v1/suggest");
  url.searchParams.set("apikey", YANDEX_KEY);
  url.searchParams.set("text", query);
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("results", "5");
  url.searchParams.set("bbox", "76.6,43.0,77.2,43.5"); // Almaty bbox
  url.searchParams.set("add_coords", "true"); // ask Yandex to include point coords

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
