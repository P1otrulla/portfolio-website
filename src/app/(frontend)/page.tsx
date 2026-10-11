import { ProjectsExplorer } from "@/components/project/projects-explorer";
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
import { parseCategoryParam } from "@/lib/projects/category-param";
import { toProjectCards } from "@/lib/projects/project-card";
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
  const reviewsBundle = await getReviewsBundle(settings.googlePlaceId, manualReviews);

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
        <ProjectsExplorer projects={toProjectCards(projects)} initialCategory={initialCategory} />
      </Section>
      <Passport settings={settings} />
      <Process settings={settings} />
      <Reviews bundle={reviewsBundle} />
      <Contact settings={settings} initialCategory={initialCategory} />
    </main>
  );
}
