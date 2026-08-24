"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  User,
  CalendarCheck,
  Link2,
  Save,
  X,
  Repeat,
  Search,
} from "lucide-react";
import Modal from "./Modal";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/dates";
import type { Project, AmcVisit } from "@/db/schema";

type AmcProject = Project & { visits?: AmcVisit[] };

const inputCls =
  "w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20";

export default function AmcManager() {
  const [projects, setProjects] = useState<AmcProject[]>([]);
  const [parents, setParents] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AmcProject | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingVisit, setEditingVisit] = useState<AmcVisit | null>(null);
  const [query, setQuery] = useState("");
  const [visitDraft, setVisitDraft] = useState<{
    visitDate: string;
    status: string;
    notes: string;
  }>({ visitDate: "", status: "pending", notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data: AmcProject[] = await res.json();
      const amc = data.filter((p) => p.type === "amc");
      setProjects(amc);
      setParents(
        data
          .filter((p) => p.type !== "amc")
          .map((p) => ({ id: p.id, name: p.name }))
      );
    } catch {
      setError("Failed to load AMC projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
          body: JSON.stringify({ ...data, type: "amc" }),
        });
        if (!res.ok) throw new Error();
      }
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch {
      setError("Failed to save AMC project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this AMC project and all of its visits?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  };

  const openVisitEditor = (visit: AmcVisit) => {
    setEditingVisit(visit);
    setVisitDraft({
      visitDate: visit.visitDate,
      status: visit.status,
      notes: visit.notes,
    });
  };

  const saveVisit = async () => {
    if (!editingVisit) return;
    const res = await fetch(`/api/amc/visits/${editingVisit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitDraft),
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingVisit.projectId
            ? {
                ...p,
                visits: p.visits?.map((v) => (v.id === updated.id ? updated : v)),
              }
            : p
        )
      );
      setEditingVisit(null);
    }
  };

  const deleteVisit = async (project: AmcProject, visit: AmcVisit) => {
    if (!window.confirm("Delete this AMC visit?")) return;
    const res = await fetch(`/api/amc/visits/${visit.id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, visits: p.visits?.filter((v) => v.id !== visit.id) }
            : p
        )
      );
    }
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

  const totalVisits = projects.reduce((s, p) => s + (p.visits?.length ?? 0), 0);
  const completedVisits = projects.reduce(
    (s, p) => s + (p.visits?.filter((v) => v.status === "complete").length ?? 0),
    0
  );

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-[#FFF3E0] px-4 py-2 text-sm text-[#7A3E00]">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">AMC Contracts</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Manage annual maintenance contracts and their scheduled visits.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AMC…"
              className="w-full rounded-xl border border-[#E5E5E5] bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[#A3A3A3] focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20"
            />
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F7941D] px-4 py-2.5 text-sm font-semibold text-[#111111] shadow-sm hover:bg-[#FFB347]"
          >
            <Plus className="h-4 w-4" /> New AMC
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            AMC Contracts
          </p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">{projects.length}</p>
        </div>
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            Visits Done
          </p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-2xl font-bold text-[#111111]">
              {completedVisits}/{totalVisits}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            Active Contracts
          </p>
          <p className="mt-1 text-2xl font-bold text-[#111111]">
            {projects.filter((p) => p.status !== "completed").length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-[#EDEDED]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-white p-12 text-center">
          <p className="text-4xl">🛠️</p>
          <p className="mt-3 font-semibold text-[#111111]">No AMC contracts yet</p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Click “New AMC” to add your first annual maintenance contract.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug text-[#111111]">{p.name}</h3>
                <StatusBadge status={p.status} />
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-[#2E2E2E]">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#F7941D]" />
                  {p.clientName || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#F7941D]" />
                  {p.location || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-[#F7941D]" />
                  Contract: {formatDate(p.contractDate)}
                </p>
                {p.parentProjectId != null && (
                  <p className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#F7941D]" />
                    Linked: {parents.find((pp) => pp.id === p.parentProjectId)?.name ?? "—"}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
                  <Repeat className="h-3.5 w-3.5 text-[#F7941D]" /> 4 Annual Visits
                </p>
                <div className="space-y-2">
                  {(p.visits ?? []).map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-2"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#111111] text-xs font-bold text-white">
                        Q{v.visitNumber}
                      </span>
                      {editingVisit?.id === v.id ? (
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          <input
                            type="date"
                            value={visitDraft.visitDate}
                            onChange={(e) =>
                              setVisitDraft((d) => ({ ...d, visitDate: e.target.value }))
                            }
                            className={inputCls}
                          />
                          <select
                            value={visitDraft.status}
                            onChange={(e) =>
                              setVisitDraft((d) => ({ ...d, status: e.target.value }))
                            }
                            className={`${inputCls} !w-auto`}
                          >
                            <option value="pending">Pending</option>
                            <option value="complete">Complete</option>
                          </select>
                          <button
                            onClick={saveVisit}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2E2E2E]"
                          >
                            <Save className="h-3.5 w-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditingVisit(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#2E2E2E] hover:bg-[#F5F5F5]"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#111111]">
                              {formatDate(v.visitDate)}
                            </p>
                            {v.notes && (
                              <p className="text-xs text-[#6B6B6B]">{v.notes}</p>
                            )}
                          </div>
                          <StatusBadge status={v.status} />
                          <button
                            onClick={() => openVisitEditor(v)}
                            className="grid h-7 w-7 place-items-center rounded-lg text-[#6B6B6B] hover:bg-white hover:text-[#111111]"
                            aria-label="Edit visit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteVisit(p, v)}
                            className="grid h-7 w-7 place-items-center rounded-lg text-[#A3A3A3] hover:bg-white hover:text-[#111111]"
                            aria-label="Delete visit"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {(p.visits ?? []).length === 0 && (
                    <p className="text-sm text-[#6B6B6B]">No visits scheduled.</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-[#F0F0F0] pt-4">
                <button
                  onClick={() => {
                    setEditing(p);
                    setModalOpen(true);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#111111] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2E2E2E]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Contract
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-semibold text-[#2E2E2E] hover:bg-[#F5F5F5]"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit AMC Contract" : "New AMC Contract"}
      >
        <ProjectForm
          type="amc"
          project={editing}
          parentProjects={parents}
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
