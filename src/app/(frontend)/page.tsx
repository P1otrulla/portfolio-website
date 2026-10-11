import { ProjectsExplorer } from "@/components/project/projects-explorer";
import { ProjectsMap } from "@/components/project/projects-map";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Passport } from "@/components/sections/passport";
import { Process } from "@/components/sections/process";
import { Reviews } from "@/components/sections/reviews";
import { Section } from "@/components/sections/section";
import { Services } from "@/components/sections/services";
import { StructuredData } from "@/components/structured-data";
import { getPublishedProjects, getSiteSettings, getVisibleManualReviews } from "@/lib/cms/queries";
import { CATEGORY_QUERY_PARAM, SECTION_ID } from "@/lib/constants";
import { buildMapPoints } from "@/lib/geo/map-points";
import { parseCategoryParam } from "@/lib/projects/category-param";
import { toProjectCards } from "@/lib/projects/project-card";
import { getStatsForProjects } from "@/lib/project-stats/project-stats-service";
import { getReviewsBundle } from "@/lib/reviews/review-service";

interface HomeProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const [settings, projects, manualReviews, params] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getVisibleManualReviews(),
    searchParams,
  ]);
  const initialCategory = parseCategoryParam(params[CATEGORY_QUERY_PARAM]);
  const mapPoints = buildMapPoints(projects);
  const [reviewsBundle, statsById] = await Promise.all([
    getReviewsBundle(settings.googlePlaceId, manualReviews),
    getStatsForProjects(projects),
  ]);

  return (
    <main>
      <StructuredData settings={settings} reviews={reviewsBundle} />
      <Hero settings={settings} />
      <Services settings={settings} />
      <Section
        id={SECTION_ID.PROJECTS}
        title="Realizacje"
        lead="Instalacje elektryczne i projekty programistyczne w jednym miejscu. Kliknij kafelek, żeby zobaczyć zdjęcia i szczegóły."
      >
        <ProjectsExplorer projects={toProjectCards(projects, statsById)} initialCategory={initialCategory} />
        {mapPoints.length > 0 && (
          <div className="mt-14">
            <h3 className="heading mb-4 text-xl">Gdzie pracowałem</h3>
            <ProjectsMap points={mapPoints} />
          </div>
        )}
      </Section>
      <Passport settings={settings} />
      <Process settings={settings} />
      <Reviews bundle={reviewsBundle} />
      <Contact settings={settings} initialCategory={initialCategory} />
    </main>
  );
}
