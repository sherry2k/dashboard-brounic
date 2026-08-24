"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  MapPin,
  User,
  CalendarCheck,
  ListChecks,
  ExternalLink,
} from "lucide-react";
import Modal from "./Modal";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import TaskChecklist from "./TaskChecklist";
import { formatDate } from "@/lib/dates";
import type { Project } from "@/db/schema";
import type { Task } from "@/lib/tasks";

type Patch = Partial<{
  name: string;
  clientName: string;
  location: string;
  status: string;
  shopDrawingsStatus: string;
  notes: string;
  tasks: Task[];
  completedTasks: string[];
}>;

export default function ProjectManager({
  type,
  title,
  subtitle,
}: {
  type: "supply" | "maintenance";
  title: string;
  subtitle: string;
  accent?: "brand" | "dark";
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?type=${type}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  const applyPatch = async (id: number, patch: Patch) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (detail?.id === id) setDetail(updated);
    }
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await fetch(`/api/projects/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, type }),
        });
        if (!res.ok) throw new Error();
      }
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch {
      setError("Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      setDetail(null);
    }
  };

  const toggleTask = (p: Project, key: string) => {
    const next = p.completedTasks.includes(key)
      ? p.completedTasks.filter((k) => k !== key)
      : [...p.completedTasks, key];
    applyPatch(p.id, { completedTasks: next });
  };

  const addTask = (p: Project, label: string) => {
    const key = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now()}`;
    applyPatch(p.id, { tasks: [...p.tasks, { key, label }] });
  };

  const removeTask = (p: Project, key: string) => {
    applyPatch(p.id, { tasks: p.tasks.filter((t) => t.key !== key) });
  };

  const filtered = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  const avgProgress =
    type === "supply" && projects.length
      ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
      : 0;

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-[#FFF3E0] px-4 py-2 text-sm text-[#7A3E00]">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">{title}</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-64 rounded-xl border border-[#E5E5E5] bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[#A3A3A3] focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20"
            />
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F7941D] px-4 py-2.5 text-sm font-semibold text-[#111111] shadow-sm hover:bg-[#FFB347]"
          >
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            Total {type === "supply" ? "Installation" : "Maintenance"} Projects
          </p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">{projects.length}</p>
        </div>
        {type === "supply" && (
          <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
              Average Progress
            </p>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-2xl font-bold text-[#111111]">{avgProgress}%</p>
              <div className="w-28">
                <ProgressBar value={avgProgress} color="brand" size="sm" />
              </div>
            </div>
          </div>
        )}
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            Active
          </p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">
            {projects.filter((p) => p.status !== "completed").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F5F5F5] text-xs uppercase tracking-wide text-[#2E2E2E]">
                <th className="px-5 py-3 font-semibold">Project</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Contract</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                {type === "supply" && (
                  <th className="px-5 py-3 font-semibold">Shop Drawings</th>
                )}
                {type === "supply" && (
                  <th className="px-5 py-3 font-semibold">Progress</th>
                )}
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={type === "supply" ? 8 : 6} className="px-5 py-4">
                      <div className="h-5 w-full rounded bg-[#F5F5F5]" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={type === "supply" ? 8 : 6} className="px-5 py-12 text-center">
                    <p className="text-3xl">🚒</p>
                    <p className="mt-2 font-semibold text-[#111111]">No projects found</p>
                    <p className="mt-1 text-sm text-[#6B6B6B]">
                      {query ? "Try a different search." : "Click “New Project” to add your first project."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setDetail(p)}
                    className="group cursor-pointer transition-colors hover:bg-[#FFF8EF]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#111111] text-[11px] font-bold text-white">
                          {type === "supply" ? "SI" : "MT"}
                        </span>
                        <div>
                          <p className="font-medium leading-tight text-[#111111] group-hover:text-[#F7941D]">
                            {p.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B6B6B]">
                            <ListChecks className="h-3 w-3" />
                            {p.completedTasks.length}/{p.tasks.length} tasks
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#2E2E2E]">{p.clientName || "—"}</td>
                    <td className="px-5 py-4 text-[#2E2E2E]">{p.location || "—"}</td>
                    <td className="px-5 py-4 text-[#2E2E2E]">{formatDate(p.contractDate)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    {type === "supply" && (
                      <td className="px-5 py-4">
                        <StatusBadge status={p.shopDrawingsStatus} />
                      </td>
                    )}
                    {type === "supply" && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20">
                            <ProgressBar value={p.progress} color="brand" size="sm" />
                          </div>
                          <span className="text-xs font-bold text-[#111111]">
                            {p.progress}%
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetail(p);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5E5E5] bg-white text-[#2E2E2E] hover:border-[#F7941D]/40 hover:bg-[#FFF8EF] hover:text-[#F7941D]"
                          title="View details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(p);
                            setModalOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5E5E5] bg-white text-[#2E2E2E] hover:border-[#111111] hover:bg-[#111111] hover:text-white"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-[#E5E5E5] bg-white text-[#A3A3A3] hover:border-[#111111]/20 hover:bg-[#111111] hover:text-white"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail popup - card view */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name ?? "Project Details"}
        wide
      >
        {detail && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[#2E2E2E]">
                  <User className="h-4 w-4 text-[#F7941D]" />
                  <span className="font-medium text-[#111111]">Client:</span> {detail.clientName || "—"}
                </p>
                <p className="flex items-center gap-2 text-[#2E2E2E]">
                  <MapPin className="h-4 w-4 text-[#F7941D]" />
                  <span className="font-medium text-[#111111]">Location:</span> {detail.location || "—"}
                </p>
                <p className="flex items-center gap-2 text-[#2E2E2E]">
                  <CalendarCheck className="h-4 w-4 text-[#F7941D]" />
                  <span className="font-medium text-[#111111]">Contract:</span> {formatDate(detail.contractDate)}
                </p>
                {type === "supply" && (
                  <div className="flex items-center gap-2 text-[#2E2E2E]">
                    <ListChecks className="h-4 w-4 text-[#F7941D]" />
                    <span className="font-medium text-[#111111]">Shop Drawings:</span>
                    <StatusBadge status={detail.shopDrawingsStatus} />
                  </div>
                )}
              </div>
              <StatusBadge status={detail.status} />
            </div>

            {type === "supply" ? (
              <>
                <div className="rounded-xl bg-[#F5F5F5] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
                      Installation Progress
                    </p>
                    <span className="text-sm font-bold text-[#111111]">{detail.progress}%</span>
                  </div>
                  <ProgressBar value={detail.progress} color="brand" size="md" />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
                    Tasks — click to toggle (progress auto-updates)
                  </p>
                  <TaskChecklist
                    tasks={detail.tasks}
                    completed={detail.completedTasks}
                    onToggle={(key) => toggleTask(detail, key)}
                    onAdd={(label) => addTask(detail, label)}
                    onRemove={(key) => removeTask(detail, key)}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3 text-sm text-[#2E2E2E]">
                <p className="font-medium text-[#111111]">Maintenance Project</p>
                <p className="mt-1 text-xs text-[#6B6B6B]">Status can be updated anytime via Edit.</p>
                {detail.notes && <p className="mt-2 text-sm">{detail.notes}</p>}
              </div>
            )}

            {detail.notes && type === "supply" && (
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">Notes</p>
                <p className="mt-1 text-sm text-[#2E2E2E]">{detail.notes}</p>
              </div>
            )}

            <div className="flex gap-2 border-t border-[#F0F0F0] pt-4">
              <button
                onClick={() => {
                  setEditing(detail);
                  setModalOpen(true);
                  setDetail(null);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2E2E2E]"
              >
                <Pencil className="h-4 w-4" /> Edit Project
              </button>
              <button
                onClick={() => {
                  if (detail) handleDelete(detail.id);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm font-semibold text-[#2E2E2E] hover:bg-[#F5F5F5]"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button
                onClick={() => setDetail(null)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5E5E5] bg-white text-[#6B6B6B] hover:bg-[#F5F5F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Project" : "New Project"}
        wide={type === "supply"}
      >
        <ProjectForm
          type={type}
          project={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}
