import { ButtonLink } from "@/components/ui/button";
import { ROUTES, SECTION_ID } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
      <div className="border-t border-ink pt-6">
        <p className="heading text-ink-soft">404</p>
        <h1 className="display mt-2 text-[clamp(2rem,4.4vw,3.2rem)]">Tu nic nie ma – obwód otwarty.</h1>
        <p className="mt-4 max-w-[52ch] text-ink-soft">
          Strona mogła zostać przeniesiona albo usunięta. Wróć na start albo przejrzyj realizacje.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.HOME}>Strona główna</ButtonLink>
          <ButtonLink href={`/#${SECTION_ID.PROJECTS}`} variant="outline">
            Realizacje
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
