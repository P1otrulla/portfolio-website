import Link from "next/link";
import type { SiteSetting } from "@/payload-types";
import { ROUTES, SECTION_ID } from "@/lib/constants";
import { Logo } from "./logo";
import { buildContactChannels } from "./social-links";

export function SiteFooter({ settings }: { readonly settings: SiteSetting }) {
  const channels = buildContactChannels(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24">
      <div className="pe-stripe h-1.5" aria-hidden="true" />
      <div className="border-t border-rule bg-surface">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            {settings.serviceArea && (
              <p className="mt-5 max-w-sm text-[0.95rem] text-ink-soft">
                Instalacje elektryczne: {settings.serviceArea}. Programowanie: zdalnie.
              </p>
            )}
          </div>
          <nav aria-label="Stopka">
            <h2 className="heading text-sm text-ink-soft">Na stronie</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li><Link className="hover:text-wire-n" href={`/#${SECTION_ID.SERVICES}`}>Usługi</Link></li>
              <li><Link className="hover:text-wire-n" href={`/#${SECTION_ID.PROJECTS}`}>Realizacje</Link></li>
              <li><Link className="hover:text-wire-n" href={ROUTES.PRIVACY}>Polityka prywatności</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="heading text-sm text-ink-soft">Kontakt</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              {channels.map((channel) => (
                <li key={channel.key}>
                  <a
                    className="inline-flex items-center gap-2 hover:text-wire-n"
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <channel.icon size={15} aria-hidden="true" />
                    {channel.external ? channel.label : channel.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-rule">
          <p className="mx-auto max-w-[1200px] px-4 py-5 text-sm text-ink-soft sm:px-6">
            © {year} Piotr Zych
          </p>
        </div>
      </div>
    </footer>
  );
}
