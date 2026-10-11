import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "geo_lat" numeric;
  ALTER TABLE "projects" ADD COLUMN "geo_lng" numeric;
  ALTER TABLE "_projects_v" ADD COLUMN "version_geo_lat" numeric;
  ALTER TABLE "_projects_v" ADD COLUMN "version_geo_lng" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "umami_website_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "umami_script_url" varchar DEFAULT 'http://localhost:3001/script.js';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "geo_lat";
  ALTER TABLE "projects" DROP COLUMN "geo_lng";
  ALTER TABLE "_projects_v" DROP COLUMN "version_geo_lat";
  ALTER TABLE "_projects_v" DROP COLUMN "version_geo_lng";
  ALTER TABLE "site_settings" DROP COLUMN "umami_website_id";
  ALTER TABLE "site_settings" DROP COLUMN "umami_script_url";`)
}
