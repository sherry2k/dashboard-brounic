import { db } from "@/db";
import { projects, amcVisits, type AmcVisit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { computeProgress, type Task } from "@/lib/tasks";
import { generateAmcVisits } from "@/lib/amc";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function loadVisits(id: number): Promise<AmcVisit[]> {
  return db
    .select()
    .from(amcVisits)
    .where(eq(amcVisits.projectId, id))
    .orderBy(amcVisits.visitNumber);
}

export async function GET(_req: Request, { params }: Ctx) {
  const id = Number((await params).id);
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });

  const project = rows[0];
  const visits = project.type === "amc" ? await loadVisits(id) : undefined;
  return NextResponse.json(visits ? { ...project, visits } : project);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const id = Number((await params).id);
  const body = await req.json();

  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  const current = rows[0];

  const updates: Record<string, unknown> = {};
  const scalarFields = [
    "name",
    "clientName",
    "location",
    "status",
    "shopDrawingStatus",
    "notes",
    "parentProjectId",
  ];
  for (const f of scalarFields) {
    if (f in body) updates[f] = body[f];
  }

  let tasks: Task[] = current.tasks ?? [];
  let completed: string[] = current.completedTasks ?? [];
  if (Array.isArray(body.tasks)) tasks = body.tasks;
  if (Array.isArray(body.completedTasks)) completed = body.completedTasks;
  updates.tasks = tasks;
  updates.completedTasks = completed;
  updates.progress = computeProgress(tasks, completed);

  if (body.contractDate && body.contractDate !== current.contractDate) {
    updates.contractDate = body.contractDate;
    if (current.type === "amc") {
      await db.delete(amcVisits).where(eq(amcVisits.projectId, id));
      const gen = generateAmcVisits(body.contractDate);
      await db.insert(amcVisits).values(
        gen.map((v) => ({
          projectId: id,
          visitNumber: v.visitNumber,
          visitDate: v.visitDate,
          status: v.status,
        }))
      );
    }
  }

  const [updated] = await db
    .update(projects)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  const visits = updated.type === "amc" ? await loadVisits(id) : undefined;
  return NextResponse.json(visits ? { ...updated, visits } : updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const id = Number((await params).id);
  await db.delete(amcVisits).where(eq(amcVisits.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
