import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const rawDatabaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!rawDatabaseUrl) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL is required");
}

const databaseUrl: string = rawDatabaseUrl;

function isLocalPostgres(url: string) {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("0.0.0.0")
  );
}

function shouldUseNeon(url: string) {
  return (
    process.env.DATABASE_PROVIDER === "neon" ||
    Boolean(process.env.NEON_DATABASE_URL) ||
    /\.neon\.tech/i.test(url)
  );
}

const useNeon = shouldUseNeon(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __brounicPgPool?: Pool;
  __brounicDb?: NodePgDatabase<typeof schema>;
};

function createDb(): NodePgDatabase<typeof schema> {
  if (useNeon) {
    // Neon/serverless deployments use HTTPS through Neon's serverless driver.
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema }) as unknown as NodePgDatabase<typeof schema>;
  }

  const pool =
    globalForDb.__brounicPgPool ??
    new Pool({
      connectionString: databaseUrl,
      // Keep local Postgres simple, but support SSL for non-local managed Postgres.
      ssl:
        !isLocalPostgres(databaseUrl) && databaseUrl.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : undefined,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__brounicPgPool = pool;
  }

  return drizzleNode(pool, { schema });
}

export const db = globalForDb.__brounicDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__brounicDb = db;
}

export const databaseProvider = useNeon ? "neon" : "postgres";
