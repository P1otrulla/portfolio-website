import "server-only";
import type { Review } from "@/payload-types";
import { REVIEW_SOURCE } from "@/lib/constants";
import { isNonEmpty } from "@/lib/utils";
import { GooglePlacesClient } from "./google-places-client";

const GOOGLE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const WRITE_REVIEW_BASE_URL = "https://search.google.com/local/writereview";

export type ReviewOrigin = "google" | "manual";

export interface ReviewView {
  readonly id: string;
  readonly origin: ReviewOrigin;
  readonly sourceLabel: string;
  readonly author: string;
  readonly authorPhotoUrl?: string;
  readonly authorUrl?: string;
  readonly rating: number;
  readonly text: string;
  readonly dateLabel?: string;
}

export interface ReviewSummary {
  readonly rating: number;
  readonly totalCount: number;
  readonly mapsUrl?: string;
}

export interface ReviewsBundle {
  readonly googleSummary: ReviewSummary | null;
  readonly reviews: readonly ReviewView[];
  readonly writeReviewUrl: string | null;
}

const MANUAL_SOURCE_LABEL: Readonly<Record<string, string>> = Object.freeze({
  [REVIEW_SOURCE.GOOGLE]: "Google",
  [REVIEW_SOURCE.FACEBOOK]: "Facebook",
  [REVIEW_SOURCE.DISCORD]: "Discord",
  [REVIEW_SOURCE.DIRECT]: "Klient",
});

const DATE_FORMAT = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" });

let googleClient: GooglePlacesClient | null | undefined;

function getGoogleClient(): GooglePlacesClient | null {
  if (googleClient === undefined) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    googleClient = isNonEmpty(apiKey) ? new GooglePlacesClient(apiKey, GOOGLE_CACHE_TTL_MS) : null;
  }
  return googleClient;
}

function toManualView(review: Review): ReviewView {
  return {
    id: `manual-${review.id}`,
    origin: "manual",
    sourceLabel: MANUAL_SOURCE_LABEL[review.source ?? REVIEW_SOURCE.DIRECT] ?? MANUAL_SOURCE_LABEL[REVIEW_SOURCE.DIRECT],
    author: review.author,
    rating: review.rating,
    text: review.text,
    dateLabel: review.date ? DATE_FORMAT.format(new Date(review.date)) : undefined,
  };
}

export function buildWriteReviewUrl(placeId: string | null | undefined): string | null {
  return isNonEmpty(placeId) ? `${WRITE_REVIEW_BASE_URL}?placeid=${encodeURIComponent(placeId)}` : null;
}

export async function getReviewsBundle(
  placeId: string | null | undefined,
  manualReviews: readonly Review[],
): Promise<ReviewsBundle> {
  const manualViews = manualReviews.map(toManualView);
  const writeReviewUrl = buildWriteReviewUrl(placeId);
  const client = getGoogleClient();

  if (!client || !isNonEmpty(placeId)) {
    return { googleSummary: null, reviews: manualViews, writeReviewUrl };
  }

  try {
    const place = await client.getPlaceReviews(placeId);
    const googleViews: ReviewView[] = place.reviews
      .filter((review) => isNonEmpty(review.text))
      .map((review) => ({
        id: `google-${review.id}`,
        origin: "google",
        sourceLabel: "Google",
        author: review.author,
        authorPhotoUrl: review.authorPhotoUrl,
        authorUrl: review.authorUrl,
        rating: review.rating,
        text: review.text,
        dateLabel: review.relativeTime,
      }));
    const googleSummary =
      place.rating !== null && place.totalCount > 0
        ? { rating: place.rating, totalCount: place.totalCount, mapsUrl: place.mapsUrl }
        : null;
    return { googleSummary, reviews: [...googleViews, ...manualViews], writeReviewUrl };
  } catch (error) {
    console.error("[reviews] Nie udało się pobrać opinii z Google:", error);
    return { googleSummary: null, reviews: manualViews, writeReviewUrl };
  }
}
