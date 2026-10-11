import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { pl } from "@payloadcms/translations/languages/pl";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Inquiries } from "./cms/collections/Inquiries";
import { Media } from "./cms/collections/Media";
import { Projects } from "./cms/collections/Projects";
import { Reviews } from "./cms/collections/Reviews";
import { Users } from "./cms/collections/Users";
import { SiteSettings } from "./cms/globals/SiteSettings";
import { seedIfEmpty } from "./cms/seed";
import { migrations } from "./migrations";

const configDir = path.dirname(fileURLToPath(import.meta.url));

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Brak zmiennej środowiskowej ${name}. Skopiuj .env.example do .env i uzupełnij.`);
  }
  return value;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(configDir) },
    meta: { titleSuffix: " · panel piotrulla.dev" },
  },
  collections: [Projects, Reviews, Inquiries, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: requireEnv("PAYLOAD_SECRET"),
  typescript: { outputFile: path.resolve(configDir, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: requireEnv("DATABASE_URL") },
    prodMigrations: migrations,
  }),
  sharp,
  i18n: {
    supportedLanguages: { pl, en },
    fallbackLanguage: "pl",
  },
  onInit: async (payload) => {
    if (process.env.SEED_ON_INIT !== "false") {
      await seedIfEmpty(payload);
    }
  },
});
