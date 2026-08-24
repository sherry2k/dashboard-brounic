import { db } from "@/db";
import { amcVisits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ visitId: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const id = Number((await params).visitId);
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if ("visitDate" in body) updates.visitDate = body.visitDate;
  if ("status" in body) updates.status = body.status;
  if ("notes" in body) updates.notes = body.notes;
  if (body.status === "complete") updates.completedAt = new Date();
  if (body.status === "pending") updates.completedAt = null;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(amcVisits)
    .set(updates)
    .where(eq(amcVisits.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const id = Number((await params).visitId);
  await db.delete(amcVisits).where(eq(amcVisits.id, id));
  return NextResponse.json({ ok: true });
}
