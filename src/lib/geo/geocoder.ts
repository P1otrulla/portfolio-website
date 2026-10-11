import { z } from "zod";
import { TtlCache } from "@/lib/cache/ttl-cache";

export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
}

const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";
/** Zasady Nominatim: identyfikujący User-Agent, max 1 zapytanie na sekundę – przy zapisie w panelu to z zapasem. */
const USER_AGENT = "piotrulla-portfolio/1.0 (+https://piotrulla.dev)";
const REQUEST_TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** 3 miejsca po przecinku ≈ 100 m – wystarcza do pinezki miejscowości, nie zdradza adresu. */
const COORDINATE_PRECISION = 3;

const resultSchema = z.array(z.object({ lat: z.string(), lon: z.string() }));

const cache = new TtlCache<string, GeoPoint | null>(CACHE_TTL_MS);

const round = (value: number): number => Number(value.toFixed(COORDINATE_PRECISION));

async function queryNominatim(town: string): Promise<GeoPoint | null> {
  const params = new URLSearchParams({
    q: town,
    format: "json",
    limit: "1",
    countrycodes: "pl",
    "accept-language": "pl",
  });
  const response = await fetch(`${NOMINATIM_SEARCH}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Nominatim HTTP ${response.status}`);
  }
  const [first] = resultSchema.parse(await response.json());
  return first ? { lat: round(Number(first.lat)), lng: round(Number(first.lon)) } : null;
}

/** Zamienia nazwę miejscowości na współrzędne. Brak sieci albo wyniku = null (pinezka po prostu się nie pojawi). */
export async function geocodeTown(town: string): Promise<GeoPoint | null> {
  const key = town.trim().toLowerCase();
  if (key.length === 0) {
    return null;
  }
  try {
    // Błędy sieci nie trafiają do cache – przy następnym zapisie spróbujemy ponownie.
    return await cache.getOrLoad(key, () => queryNominatim(town.trim()));
  } catch (error) {
    console.warn(`[geo] Nie udało się znaleźć „${town}”: ${(error as Error).message}`);
    return null;
  }
}
