import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowLeft, ExternalLink as ExternalIcon, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/project/before-after";
import { Gallery, type GalleryItem } from "@/components/project/gallery";
import { CategoryMark } from "@/components/project/project-card";
import { ButtonLink, ExternalLink, buttonClass } from "@/components/ui/button";
import { projectStatsFacts } from "@/components/project/project-stats";
import { getProjectBySlug } from "@/lib/cms/queries";
import { getProjectStats } from "@/lib/project-stats/project-stats-service";
import {
  ANALYTICS_EVENT,
  CATEGORY_QUERY_PARAM,
  PROJECT_CATEGORY,
  PROJECT_CATEGORY_SLUG,
  SECTION_ID,
} from "@/lib/constants";
import { objectPosition, resolveImage } from "@/lib/media";
import { formatMonthYear, isNonEmpty } from "@/lib/utils";

interface ProjectPageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {};
  }
  const cover = resolveImage(project.cover, "wide");
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: cover ? [cover.url] : undefined },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const isElectrical = project.category === PROJECT_CATEGORY.ELECTRICAL;
  const cover = resolveImage(project.cover, "wide");
  const before = resolveImage(project.beforeAfter?.before, "wide");
  const after = resolveImage(project.beforeAfter?.after, "wide");
  const dateLabel = formatMonthYear(project.completedAt);
  const stats = await getProjectStats(project);
  const facts = [
    ...(isNonEmpty(project.location) ? [{ label: "Miejscowość", value: project.location }] : []),
    ...(dateLabel ? [{ label: "Termin", value: dateLabel }] : []),
    ...(project.facts ?? []).map((fact) => ({ label: fact.label, value: fact.value })),
    ...(stats ? projectStatsFacts(stats) : []),
  ];
  const galleryItems: GalleryItem[] = (project.gallery ?? []).flatMap((entry) => {
    const thumb = resolveImage(entry.image, "card");
    const full = resolveImage(entry.image, "wide");
    return thumb && full ? [{ key: entry.id ?? thumb.url, thumb, full, caption: entry.caption ?? undefined }] : [];
  });
  const categorySlug = PROJECT_CATEGORY_SLUG[project.category];
  const contactHref = `/?${CATEGORY_QUERY_PARAM}=${categorySlug}#${SECTION_ID.CONTACT}`;
  const backHref = `/?${CATEGORY_QUERY_PARAM}=${categorySlug}#${SECTION_ID.PROJECTS}`;

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-8 pt-8 sm:px-6 md:pt-12">
      <Link href={backHref} className="inline-flex items-center gap-2 text-[0.95rem] text-ink-soft hover:text-ink">
        <ArrowLeft size={16} aria-hidden="true" />
        Wszystkie realizacje
      </Link>

      <header className="mt-8 grid gap-8 border-t border-ink pt-6 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <div>
          <CategoryMark category={project.category} />
          <h1 className="display mt-3 text-[clamp(2rem,4.6vw,3.4rem)] text-balance">{project.title}</h1>
          <p className="mt-5 max-w-[60ch] text-[1.12rem] text-ink-soft">{project.summary}</p>
          {(project.links?.repository || project.links?.demo) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {isNonEmpty(project.links?.repository) && (
                <ExternalLink href={project.links.repository} className={buttonClass("outline")} data-umami-event={ANALYTICS_EVENT.PROJECT_REPOSITORY}>
                  <Github size={17} aria-hidden="true" />
                  Kod źródłowy
                </ExternalLink>
              )}
              {isNonEmpty(project.links?.demo) && (
                <ExternalLink href={project.links.demo} className={buttonClass("outline")} data-umami-event={ANALYTICS_EVENT.PROJECT_DEMO}>
                  <ExternalIcon size={17} aria-hidden="true" />
                  Prezentacja
                </ExternalLink>
              )}
            </div>
          )}
        </div>

        {(facts.length > 0 || (project.tags?.length ?? 0) > 0) && (
          <aside aria-label="Parametry realizacji" className="self-start rounded-lg border border-rule bg-surface p-6">
            {facts.length > 0 && (
              <dl className="divide-y divide-rule">
                {facts.map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="flex justify-between gap-6 py-2.5 first:pt-0">
                    <dt className="text-ink-soft">{fact.label}</dt>
                    <dd className="text-right font-semibold tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {(project.tags?.length ?? 0) > 0 && (
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={isElectrical ? "Materiały" : "Technologie"}>
                {project.tags?.map((tag) => (
                  <li key={tag} className="rounded border border-rule px-2 py-0.5 text-[0.85rem] text-ink-soft">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.url}
          alt={cover.alt}
          className="mt-10 aspect-[2/1] w-full max-w-[860px] rounded-lg border border-rule object-cover"
          style={{ objectPosition: objectPosition(cover) }}
        />
      )}

      <div className="mt-12 max-w-[860px] space-y-12">
          {project.body && (
            <div className="prose-content text-[1.05rem]">
              <RichText data={project.body as Parameters<typeof RichText>[0]["data"]} />
            </div>
          )}
          {before && after && (
            <section aria-labelledby="before-after-title">
              <h2 id="before-after-title" className="heading mb-4 text-xl">
                Przed i po
              </h2>
              <BeforeAfter before={before} after={after} />
            </section>
          )}
      </div>

      {galleryItems.length > 0 && (
        <section aria-labelledby="gallery-title" className="mt-14">
          <h2 id="gallery-title" className="heading mb-5 text-xl">
            Zdjęcia
          </h2>
          <Gallery items={galleryItems} />
        </section>
      )}

      <section className="mt-16 flex flex-col items-start gap-5 rounded-lg border border-rule bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="heading text-xl">
          {isElectrical ? "Planujesz podobną instalację?" : "Potrzebujesz podobnego rozwiązania?"}
        </p>
        <ButtonLink href={contactHref} data-umami-event={ANALYTICS_EVENT.PROJECT_QUOTE}>Zapytaj o wycenę</ButtonLink>
      </section>
    </main>
  );
}
