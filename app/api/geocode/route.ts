import { NextRequest, NextResponse } from "next/server";

const YANDEX_KEY = "1f1bdb59-89d5-4568-b73d-b705aba93104";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon) return NextResponse.json({ address: null });

  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", YANDEX_KEY);
  url.searchParams.set("geocode", `${lon},${lat}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("results", "1");
  url.searchParams.set("lang", "ru_RU");

  const res = await fetch(url.toString());
  const data = await res.json();

  const found =
    data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

  const address = found?.metaDataProperty?.GeocoderMetaData?.text ?? null;

  return NextResponse.json({ address });
}
