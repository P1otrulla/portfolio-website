import { Star } from "lucide-react";
import { RATING, SECTION_ID } from "@/lib/constants";
import type { ReviewsBundle, ReviewView } from "@/lib/reviews/review-service";
import { cn, pluralizePl } from "@/lib/utils";
import { ExternalLink, buttonClass } from "@/components/ui/button";
import { Section } from "./section";

const RATING_FORMAT = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const STAR_INDEXES = Array.from({ length: RATING.MAX }, (_, index) => index);

function Stars({ rating, size = 16 }: { readonly rating: number; readonly size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`Ocena ${RATING_FORMAT.format(rating)} na ${RATING.MAX}`}>
      {STAR_INDEXES.map((index) => (
        <Star
          key={index}
          size={size}
          aria-hidden="true"
          className={index < rounded ? "fill-pe-yellow text-pe-yellow" : "fill-rule text-rule"}
        />
      ))}
    </span>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function ReviewCard({ review }: { readonly review: ReviewView }) {
  return (
    <figure className="mb-5 break-inside-avoid rounded-lg border border-rule bg-surface p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 whitespace-pre-line text-[1rem] leading-relaxed">{review.text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-rule pt-4">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorPhotoUrl}
            alt=""
            width={36}
            height={36}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-sm font-semibold text-ink-soft" aria-hidden="true">
            {initials(review.author)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate font-semibold">
            {review.authorUrl ? (
              <ExternalLink href={review.authorUrl} className="hover:underline">
                {review.author}
              </ExternalLink>
            ) : (
              review.author
            )}
          </span>
          <span className="block text-sm text-ink-soft">
            {review.sourceLabel}
            {review.dateLabel ? `, ${review.dateLabel}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews({ bundle }: { readonly bundle: ReviewsBundle }) {
  const { googleSummary, reviews, writeReviewUrl } = bundle;
  if (reviews.length === 0 && !writeReviewUrl) {
    return null;
  }

  const lead = googleSummary ? (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
      <span className="display text-[3.2rem] leading-none text-ink">{RATING_FORMAT.format(googleSummary.rating)}</span>
      <span className="flex flex-col gap-1 pb-1">
        <Stars rating={googleSummary.rating} size={18} />
        <span className="text-[0.95rem]">
          {googleSummary.totalCount} {pluralizePl(googleSummary.totalCount, "opinia", "opinie", "opinii")} w Google
          {googleSummary.mapsUrl && (
            <>
              {" "}
              <ExternalLink href={googleSummary.mapsUrl} className="link">
                zobacz wszystkie
              </ExternalLink>
            </>
          )}
        </span>
      </span>
    </div>
  ) : (
    "Co mówią osoby, dla których pracowałem."
  );

  return (
    <Section id={SECTION_ID.REVIEWS} title="Opinie" lead={lead}>
      {reviews.length > 0 && (
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
      {writeReviewUrl && (
        <div
          className={cn(
            "flex flex-col items-start gap-4 rounded-lg border border-dashed border-rule p-6 sm:flex-row sm:items-center sm:justify-between",
            reviews.length > 0 && "mt-6",
          )}
        >
          <p className="text-[1.02rem]">Pracowaliśmy razem? Kilka zdań w Google bardzo mi pomoże.</p>
          <ExternalLink href={writeReviewUrl} className={buttonClass("outline")}>
            Wystaw opinię w Google
          </ExternalLink>
        </div>
      )}
    </Section>
  );
}
