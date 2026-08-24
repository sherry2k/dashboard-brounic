import { db } from "@/db";
import { projects, amcVisits } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  PackageOpen,
  Wrench,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, daysUntil } from "@/lib/dates";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  supply: "New Project — Supply and Installation",
  maintenance: "Maintenance",
  amc: "AMC",
};

export default async function OverviewPage() {
  const all = await db.select().from(projects).orderBy(desc(projects.createdAt));
  const visits = await db.select().from(amcVisits).orderBy(asc(amcVisits.visitDate));

  const supply = all.filter((p) => p.type === "supply");
  const maintenance = all.filter((p) => p.type === "maintenance");
  const amc = all.filter((p) => p.type === "amc");
  const total = all.length;
  const active = all.filter((p) => p.status !== "completed").length;
  const completed = all.filter((p) => p.status === "completed").length;
  const avgSupply = supply.length
    ? Math.round(supply.reduce((s, p) => s + p.progress, 0) / supply.length)
    : 0;
  const pendingVisits = visits.filter((v) => v.status === "pending");
  const completedVisits = visits.filter((v) => v.status === "complete");
  const projectMap = new Map(all.map((p) => [p.id, p]));
  const recent = all.slice(0, 5);
  const upcoming = pendingVisits.slice(0, 5);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#F7941D]">
            <Flame className="h-4 w-4" /> Brounic Group | Fire and Safety
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
            Project Overview
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Monitor installations, maintenance jobs and annual AMC schedules at a glance.
          </p>
        </div>
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">Today</p>
          <p className="mt-0.5 text-sm font-semibold text-[#111111]">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Clickable stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/supply"
          className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F7941D]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F7941D]/10 text-[#F7941D]">
              <Layers className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-[#D4D4D4] transition-colors group-hover:text-[#F7941D]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#111111]">{total}</p>
          <p className="text-sm font-medium text-[#6B6B6B]">Total Projects</p>
          <div className="mt-2 flex gap-1.5 text-[11px] font-semibold text-[#6B6B6B]">
            <span className="rounded-full bg-[#111111] px-2 py-0.5 text-white">
              {active} active
            </span>
            <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[#2E2E2E]">
              {completed} done
            </span>
          </div>
        </Link>

        <Link
          href="/supply"
          className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F7941D]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F7941D]/10 text-[#F7941D]">
              <PackageOpen className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-[#D4D4D4] transition-colors group-hover:text-[#F7941D]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#111111]">{supply.length}</p>
          <p className="text-sm font-semibold text-[#111111]">New Project</p>
          <p className="text-xs font-medium text-[#6B6B6B]">Supply and Installation</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <ProgressBar value={avgSupply} color="brand" size="sm" />
            </div>
            <span className="text-xs font-bold text-[#111111]">{avgSupply}%</span>
          </div>
        </Link>

        <Link
          href="/maintenance"
          className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F7941D]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#111111] text-white">
              <Wrench className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-[#D4D4D4] transition-colors group-hover:text-[#F7941D]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#111111]">{maintenance.length}</p>
          <p className="text-sm font-medium text-[#6B6B6B]">Maintenance Projects</p>
          <p className="mt-2 text-[11px] font-semibold text-[#6B6B6B]">
            Fully editable after creation
          </p>
        </Link>

        <Link
          href="/amc"
          className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F7941D]/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#2E2E2E] text-white">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-5 w-5 text-[#D4D4D4] transition-colors group-hover:text-[#F7941D]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#111111]">{amc.length}</p>
          <p className="text-sm font-medium text-[#6B6B6B]">AMC Contracts</p>
          <p className="mt-2 text-[11px] font-semibold text-[#6B6B6B]">
            {completedVisits.length}/{visits.length} annual visits done
          </p>
        </Link>
      </div>

      {/* Second row */}
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {/* Recent projects */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">Recent Projects</h2>
            <Link
              href="/supply"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#F7941D] hover:text-[#FFB347]"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6B6B6B]">No projects yet.</p>
          ) : (
            <div className="divide-y divide-[#F0F0F0]">
              {recent.map((p) => (
                <Link
                  href={p.type === "amc" ? "/amc" : p.type === "maintenance" ? "/maintenance" : "/supply"}
                  key={p.id}
                  className="group flex items-center gap-3 py-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#111111] text-xs font-bold text-white">
                    {p.type === "supply" ? "SI" : p.type === "maintenance" ? "MT" : "AMC"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#111111] group-hover:text-[#F7941D]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {TYPE_LABEL[p.type]} · {formatDate(p.contractDate)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming AMC */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">Upcoming AMC Visits</h2>
            <Link
              href="/amc"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#F7941D] hover:text-[#FFB347]"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6B6B6B]">No pending AMC visits. 🎉</p>
          ) : (
            <div className="divide-y divide-[#F0F0F0]">
              {upcoming.map((v) => {
                const proj = projectMap.get(v.projectId);
                const days = daysUntil(v.visitDate);
                return (
                  <Link href="/amc" key={v.id} className="group flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FFF3E0] text-[#F7941D]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#111111] group-hover:text-[#F7941D]">
                        {proj?.name ?? "AMC"} · Q{v.visitNumber}
                      </p>
                      <p className="text-xs text-[#6B6B6B]">{formatDate(v.visitDate)}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        days < 0
                          ? "bg-[#111111] text-white"
                          : days <= 7
                            ? "bg-[#F7941D]/15 text-[#7A3E00]"
                            : "bg-[#F5F5F5] text-[#2E2E2E]"
                      }`}
                    >
                      {days < 0 ? `Overdue ${Math.abs(days)}d` : days === 0 ? "Today" : `In ${days}d`}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance / completed snapshot */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#6B6B6B]">
            <CheckCircle2 className="h-4 w-4 text-[#F7941D]" />
            <span className="text-sm font-medium">Completed AMC Visits</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#111111]">{completedVisits.length}</p>
          <p className="text-xs text-[#6B6B6B]">of {visits.length} scheduled this year</p>
        </div>
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-[#6B6B6B]">Maintenance Projects</p>
          <p className="mt-2 text-2xl font-bold text-[#111111]">{maintenance.length}</p>
          <p className="text-xs text-[#6B6B6B]">
            {maintenance.filter((m) => m.status !== "completed").length} currently in progress
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#111111]">New Project</p>
          <p className="text-xs font-medium text-[#6B6B6B]">Supply and Installation</p>
          <p className="mt-2 text-2xl font-bold text-[#111111]">{avgSupply}%</p>
          <p className="text-xs text-[#6B6B6B]">average progress across projects</p>
        </div>
      </div>
    </div>
  );
}
