import type { SiteSetting } from "@/payload-types";
import { SECTION_ID, type ProjectCategory } from "@/lib/constants";
import { buildContactChannels } from "@/components/social-links";
import { ContactForm } from "./contact-form";
import { Section } from "./section";

interface ContactProps {
  readonly settings: SiteSetting;
  readonly initialCategory: ProjectCategory | null;
}

export function Contact({ settings, initialCategory }: ContactProps) {
  const channels = buildContactChannels(settings);
  return (
    <Section
      id={SECTION_ID.CONTACT}
      title="Napisz, co trzeba zrobić"
      lead="Opisz krótko zakres – odpiszę z pytaniami albo wstępną wyceną. Wolisz rozmowę? Kontakt bezpośredni jest obok."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <ContactForm initialCategory={initialCategory} />
        <aside aria-label="Kontakt bezpośredni" className="space-y-8">
          <ul className="divide-y divide-rule border-y border-rule">
            {channels.map((channel) => (
              <li key={channel.key}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 py-4"
                >
                  <channel.icon size={20} className="shrink-0 text-ink-soft group-hover:text-wire-n" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-soft">{channel.label}</span>
                    <span className="block truncate font-medium group-hover:text-wire-n">{channel.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {(settings.serviceArea || settings.availability) && (
            <dl className="space-y-4 text-[0.98rem]">
              {settings.serviceArea && (
                <div>
                  <dt className="text-sm text-ink-soft">Instalacje elektryczne – obszar</dt>
                  <dd className="font-medium">{settings.serviceArea}</dd>
                </div>
              )}
              {settings.availability && (
                <div>
                  <dt className="text-sm text-ink-soft">Dostępność</dt>
                  <dd className="font-medium">{settings.availability}</dd>
                </div>
              )}
            </dl>
          )}
        </aside>
      </div>
    </Section>
  );
}
