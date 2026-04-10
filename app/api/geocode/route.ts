import { NextRequest, NextResponse } from "next/server";

const YANDEX_KEY = "1f1bdb59-89d5-4568-b73d-b705aba93104";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  const q   = req.nextUrl.searchParams.get("q");

  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", YANDEX_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("results", "1");
  url.searchParams.set("lang", "ru_RU");

  if (q) {
    // Forward geocode: address → coords
    url.searchParams.set("geocode", q);
  } else if (lat && lon) {
    // Reverse geocode: coords → address
    url.searchParams.set("geocode", `${lon},${lat}`);
  } else {
    return NextResponse.json({ address: null, lat: null, lon: null });
  }

  const res  = await fetch(url.toString());
  const data = await res.json();

  const found =
    data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

  const address = found?.metaDataProperty?.GeocoderMetaData?.text ?? null;

  // Extract coordinates from the Point field ("lon lat" string)
  const pos = found?.Point?.pos as string | undefined;
  let parsedLat: number | null = null;
  let parsedLon: number | null = null;
  if (pos) {
    const [lonStr, latStr] = pos.split(" ");
    parsedLon = parseFloat(lonStr);
    parsedLat = parseFloat(latStr);
  }

  return NextResponse.json({ address, lat: parsedLat, lon: parsedLon });
}
