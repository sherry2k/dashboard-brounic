import { db, databaseProvider } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, databaseProvider });
  } catch (error) {
    console.error("Health check failed", error);
    return Response.json(
      { ok: false, databaseProvider, error: "Database connection failed" },
      { status: 500 }
    );
  }
}
