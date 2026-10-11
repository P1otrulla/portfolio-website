import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/standard.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings, getVisibleManualReviews } from "@/lib/cms/queries";
import { isNonEmpty } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.seoTitle, template: `%s · Piotr Zych` },
    description: settings.seoDescription,
    openGraph: { type: "website", locale: "pl_PL", title: settings.seoTitle, description: settings.seoDescription },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f4" },
    { media: "(prefers-color-scheme: dark)", color: "#10161d" },
  ],
};

export default async function FrontendLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, manualReviews] = await Promise.all([getSiteSettings(), getVisibleManualReviews()]);
  const showReviews = isNonEmpty(settings.googlePlaceId) || manualReviews.length > 0;
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <ThemeProvider>
          <a
            href="#tresc"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-surface focus:px-4 focus:py-2"
          >
            Przejdź do treści
          </a>
          <SiteHeader showReviews={showReviews} />
          <div id="tresc">{children}</div>
          <SiteFooter settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  );
}
