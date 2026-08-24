import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaBrounicSchemaReady?: Promise<void>;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);

/**
 * Idempotently creates the application tables.
 *
 * Deployments may point at a fresh database where `drizzle-kit push` has never
 * been run. Running this on first use guarantees the dashboard boots instead of
 * throwing a 500 on the first page load.
 */
const DDL = `
  CREATE TABLE IF NOT EXISTS "projects" (
    "id" serial PRIMARY KEY,
    "type" text NOT NULL,
    "name" text NOT NULL,
    "client_name" text NOT NULL DEFAULT '',
    "location" text NOT NULL DEFAULT '',
    "contract_date" date NOT NULL,
    "status" text NOT NULL DEFAULT 'active',
    "progress" integer NOT NULL DEFAULT 0,
    "tasks" jsonb NOT NULL DEFAULT '[]'::jsonb,
    "completed_tasks" jsonb NOT NULL DEFAULT '[]'::jsonb,
    "notes" text NOT NULL DEFAULT '',
    "parent_project_id" integer REFERENCES projects("id") ON DELETE SET NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS "amc_visits" (
    "id" serial PRIMARY KEY,
    "project_id" integer NOT NULL REFERENCES projects("id") ON DELETE CASCADE,
    "visit_number" integer NOT NULL,
    "visit_date" date NOT NULL,
    "status" text NOT NULL DEFAULT 'pending',
    "notes" text NOT NULL DEFAULT '',
    "completed_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS "amc_visits_project_id_idx" ON "amc_visits" ("project_id");
`;

export function ensureSchema(): Promise<void> {
  if (!globalForDb.__arenaBrounicSchemaReady) {
    globalForDb.__arenaBrounicSchemaReady = (async () => {
      await pool.query(DDL);
    })().catch((err: unknown) => {
      // Allow a later request to retry instead of caching the failure forever.
      globalForDb.__arenaBrounicSchemaReady = undefined;
      throw err;
    });
  }
  return globalForDb.__arenaBrounicSchemaReady;
}
