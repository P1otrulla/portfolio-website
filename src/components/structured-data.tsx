import type { SiteSetting } from "@/payload-types";
import { SITE_URL } from "@/lib/constants";
import type { ReviewsBundle } from "@/lib/reviews/review-service";
import { isNonEmpty } from "@/lib/utils";

const PERSON_NAME = "Piotr Zych";

/** Dane strukturalne dla Google: osoba + działalność elektryczna. */
export function StructuredData({ settings, reviews }: { readonly settings: SiteSetting; readonly reviews: ReviewsBundle }) {
  const sameAs = [settings.githubUrl, settings.linkedinUrl].filter(isNonEmpty);
  const graph = [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: PERSON_NAME,
      alternateName: "Piotrulla",
      url: SITE_URL,
      jobTitle: "Elektryk i programista",
      sameAs,
    },
    {
      "@type": "Electrician",
      "@id": `${SITE_URL}#business`,
      name: `${PERSON_NAME} – instalacje elektryczne`,
      url: SITE_URL,
      email: settings.email,
      ...(isNonEmpty(settings.phone) ? { telephone: settings.phone } : {}),
      ...(isNonEmpty(settings.serviceArea) ? { areaServed: settings.serviceArea } : {}),
      ...(reviews.googleSummary?.mapsUrl ? { hasMap: reviews.googleSummary.mapsUrl } : {}),
      founder: { "@id": `${SITE_URL}#person` },
    },
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
