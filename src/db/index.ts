import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool: Pool | undefined = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
      }))
  : undefined;

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

const configuredDb = pool ? drizzle(pool) : undefined;

type DbClient = NonNullable<typeof configuredDb>;

function missingDatabaseUrlError() {
  return new Error(
    "DATABASE_URL is required. Add a PostgreSQL connection string to your deployment environment variables."
  );
}

export function isDatabaseConfigured() {
  return Boolean(databaseUrl);
}

export const db: DbClient =
  configuredDb ??
  (new Proxy(
    {},
    {
      get() {
        throw missingDatabaseUrlError();
      },
    }
  ) as DbClient);
