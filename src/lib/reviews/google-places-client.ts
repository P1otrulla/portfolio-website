import "server-only";
import { z } from "zod";
import { TtlCache } from "@/lib/cache/ttl-cache";

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "rating,userRatingCount,reviews,googleMapsUri";
const LANGUAGE_CODE = "pl";
const REQUEST_TIMEOUT_MS = 8_000;

const placeResponseSchema = z.object({
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  googleMapsUri: z.string().url().optional(),
  reviews: z
    .array(
      z.object({
        name: z.string(),
        rating: z.number(),
        relativePublishTimeDescription: z.string().optional(),
        publishTime: z.string().optional(),
        text: z.object({ text: z.string() }).optional(),
        originalText: z.object({ text: z.string() }).optional(),
        authorAttribution: z
          .object({
            displayName: z.string(),
            uri: z.string().optional(),
            photoUri: z.string().optional(),
          })
          .optional(),
        googleMapsUri: z.string().optional(),
      }),
    )
    .optional(),
});

export interface GoogleReview {
  readonly id: string;
  readonly author: string;
  readonly authorUrl?: string;
  readonly authorPhotoUrl?: string;
  readonly rating: number;
  readonly text: string;
  readonly relativeTime?: string;
  readonly publishedAt?: string;
  readonly url?: string;
}

export interface GooglePlaceReviews {
  readonly rating: number | null;
  readonly totalCount: number;
  readonly mapsUrl?: string;
  readonly reviews: readonly GoogleReview[];
}

/**
 * Klient Places API (New). Google zwraca maksymalnie 5 opinii („najbardziej trafne”),
 * dlatego wynik łączymy z ręcznymi opiniami z CMS. Wynik trzymamy w pamięci przez TTL,
 * żeby nie płacić za każde wejście na stronę.
 */
export class GooglePlacesClient {
  private readonly cache: TtlCache<string, GooglePlaceReviews>;

  constructor(
    private readonly apiKey: string,
    cacheTtlMs: number,
  ) {
    if (!apiKey) {
      throw new Error("GooglePlacesClient wymaga klucza API.");
    }
    this.cache = new TtlCache(cacheTtlMs);
  }

  getPlaceReviews(placeId: string): Promise<GooglePlaceReviews> {
    return this.cache.getOrLoad(placeId, () => this.fetchPlaceReviews(placeId));
  }

  private async fetchPlaceReviews(placeId: string): Promise<GooglePlaceReviews> {
    const url = `${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=${LANGUAGE_CODE}`;
    const response = await fetch(url, {
      headers: { "X-Goog-Api-Key": this.apiKey, "X-Goog-FieldMask": FIELD_MASK },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Places API odpowiedziało ${response.status}: ${await response.text()}`);
    }
    const place = placeResponseSchema.parse(await response.json());
    return {
      rating: place.rating ?? null,
      totalCount: place.userRatingCount ?? 0,
      mapsUrl: place.googleMapsUri,
      reviews: (place.reviews ?? []).map((review) => ({
        id: review.name,
        author: review.authorAttribution?.displayName ?? "Użytkownik Google",
        authorUrl: review.authorAttribution?.uri,
        authorPhotoUrl: review.authorAttribution?.photoUri,
        rating: review.rating,
        text: review.originalText?.text ?? review.text?.text ?? "",
        relativeTime: review.relativePublishTimeDescription,
        publishedAt: review.publishTime,
        url: review.googleMapsUri,
      })),
    };
  }
}
