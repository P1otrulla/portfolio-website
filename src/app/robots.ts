import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/constants";

/** Dynamicznie, żeby SITE_URL brał się z env w runtime, a nie z momentu buildu. */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ROUTES.ADMIN, "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
