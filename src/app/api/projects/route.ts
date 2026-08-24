import { db } from "@/db";
import { projects, amcVisits, type AmcVisit } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { DEFAULT_SUPPLY_TASKS, computeProgress, type Task } from "@/lib/tasks";
import { generateAmcVisits } from "@/lib/amc";

export const dynamic = "force-dynamic";

function groupBy<T>(arr: T[], key: keyof T): Record<number, T[]> {
  return arr.reduce<Record<number, T[]>>((acc, item) => {
    const k = item[key] as unknown as number;
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const list = type
    ? await db.select().from(projects).where(eq(projects.type, type)).orderBy(desc(projects.createdAt))
    : await db.select().from(projects).orderBy(desc(projects.createdAt));

  const amcIds = list.filter((p) => p.type === "amc").map((p) => p.id);
  let visitsByProject: Record<number, AmcVisit[]> = {};
  if (amcIds.length) {
    const visits = await db
      .select()
      .from(amcVisits)
      .where(inArray(amcVisits.projectId, amcIds))
      .orderBy(amcVisits.visitNumber);
    visitsByProject = groupBy(visits, "projectId");
  }

  const payload = list.map((p) =>
    p.type === "amc"
      ? { ...p, visits: visitsByProject[p.id] ?? [] }
      : p
  );

  return NextResponse.json(payload);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      name,
      clientName = "",
      location = "",
      contractDate,
      status = "active",
      notes = "",
      tasks,
      completedTasks = [],
      parentProjectId = null,
    } = body;

    if (!type || !name || !contractDate) {
      return NextResponse.json(
        { error: "name, type and contractDate are required" },
        { status: 400 }
      );
    }

    const taskList: Task[] =
      tasks ??
      (type === "supply" ? DEFAULT_SUPPLY_TASKS : []);
    const completed: string[] = Array.isArray(completedTasks) ? completedTasks : [];
    const progress = computeProgress(taskList, completed);

    const [created] = await db
      .insert(projects)
      .values({
        type,
        name,
        clientName,
        location,
        contractDate,
        status,
        progress,
        tasks: taskList,
        completedTasks: completed,
        notes,
        parentProjectId: parentProjectId || null,
      })
      .returning();

    if (type === "amc") {
      const gen = generateAmcVisits(contractDate);
      await db.insert(amcVisits).values(
        gen.map((v) => ({
          projectId: created.id,
          visitNumber: v.visitNumber,
          visitDate: v.visitDate,
          status: v.status,
        }))
      );
      const visits = await db
        .select()
        .from(amcVisits)
        .where(eq(amcVisits.projectId, created.id))
        .orderBy(amcVisits.visitNumber);
      return NextResponse.json({ ...created, visits }, { status: 201 });
    }

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
