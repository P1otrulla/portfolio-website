import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_schematic_circuits_kind" AS ENUM('sockets', 'lighting', 'three-phase', 'server');
  CREATE TABLE "site_settings_schematic_circuits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_site_settings_schematic_circuits_kind" NOT NULL,
  	"label" varchar NOT NULL,
  	"breaker" varchar NOT NULL,
  	"description" varchar
  );
  
  ALTER TABLE "site_settings_schematic_circuits" ADD CONSTRAINT "site_settings_schematic_circuits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_schematic_circuits_order_idx" ON "site_settings_schematic_circuits" USING btree ("_order");
  CREATE INDEX "site_settings_schematic_circuits_parent_id_idx" ON "site_settings_schematic_circuits" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_schematic_circuits" CASCADE;
  DROP TYPE "public"."enum_site_settings_schematic_circuits_kind";`)
}
