"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, FileText, MapPin, User } from "lucide-react";
import ProgressBar from "./ProgressBar";
import TaskChecklist from "./TaskChecklist";
import {
  DEFAULT_SUPPLY_TASKS,
  PROJECT_STATUSES,
  SHOP_DRAWING_STATUSES,
  statusLabel,
  shopDrawingStatusLabel,
  computeProgress,
  type Task,
} from "@/lib/tasks";
import { todayISO } from "@/lib/dates";
import type { Project } from "@/db/schema";

export type ProjectFormData = {
  name: string;
  clientName: string;
  location: string;
  contractDate: string;
  status: string;
  shopDrawingStatus: string;
  notes: string;
  tasks: Task[];
  completedTasks: string[];
  parentProjectId: number | null;
};

const inputCls =
  "w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20";

function makeKey(label: string) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${slug || "task"}_${Date.now()}`;
}

export default function ProjectForm({
  type,
  project,
  parentProjects = [],
  onSubmit,
  onCancel,
  submitting = false,
}: {
  type: "supply" | "maintenance" | "amc";
  project?: Project | null;
  parentProjects?: { id: number; name: string }[];
  onSubmit: (data: ProjectFormData) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const [name, setName] = useState(project?.name ?? "");
  const [clientName, setClientName] = useState(project?.clientName ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [contractDate, setContractDate] = useState(project?.contractDate ?? todayISO());
  const [status, setStatus] = useState(project?.status ?? "active");
  const [shopDrawingStatus, setShopDrawingStatus] = useState(
    project?.shopDrawingStatus ?? "pending"
  );
  const [notes, setNotes] = useState(project?.notes ?? "");
  const [parentProjectId, setParentProjectId] = useState<number | null>(
    project?.parentProjectId ?? null
  );
  const [tasks, setTasks] = useState<Task[]>(
    project && project.tasks?.length
      ? project.tasks
      : type === "supply"
        ? DEFAULT_SUPPLY_TASKS
        : []
  );
  const [completedTasks, setCompletedTasks] = useState<string[]>(
    project?.completedTasks ?? []
  );

  const progress = useMemo(
    () => computeProgress(tasks, completedTasks),
    [tasks, completedTasks]
  );

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !contractDate) return;
    onSubmit({
      name: name.trim(),
      clientName: clientName.trim(),
      location: location.trim(),
      contractDate,
      status,
      shopDrawingStatus,
      notes: notes.trim(),
      tasks,
      completedTasks,
      parentProjectId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            Project Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Palm Residency – Fire Safety"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            <User className="h-3 w-3" /> Client
          </label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client name"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            <MapPin className="h-3 w-3" /> Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Site location"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            <CalendarCheck className="h-3 w-3" /> Contract Date
          </label>
          <input
            type="date"
            value={contractDate}
            onChange={(e) => setContractDate(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputCls}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        {type === "supply" && (
          <div className="sm:col-span-2">
            <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
              <FileText className="h-3 w-3" /> Shop Drawings Status
            </label>
            <select
              value={shopDrawingStatus}
              onChange={(e) => setShopDrawingStatus(e.target.value)}
              className={inputCls}
            >
              {SHOP_DRAWING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {shopDrawingStatusLabel(s)}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "amc" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
              Linked Project (optional)
            </label>
            <select
              value={parentProjectId ?? ""}
              onChange={(e) =>
                setParentProjectId(e.target.value ? Number(e.target.value) : null)
              }
              className={inputCls}
            >
              <option value="">— None —</option>
              {parentProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[#6B6B6B]">
              4 AMC visits per year are auto-generated from the contract date.
            </p>
          </div>
        )}

        {type === "supply" && (
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
              Installation Tasks &amp; Progress
            </label>
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#F5F5F5] p-3">
              <div className="flex-1">
                <ProgressBar value={progress} color="brand" size="md" />
              </div>
              <span className="text-sm font-bold text-[#111111]">{progress}%</span>
            </div>
            <TaskChecklist
              tasks={tasks}
              completed={completedTasks}
              onToggle={toggleTask}
              onAdd={(label) =>
                setTasks((prev) => [...prev, { key: makeKey(label), label }])
              }
              onRemove={(key) =>
                setTasks((prev) => prev.filter((t) => t.key !== key))
              }
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#2E2E2E]">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Additional details…"
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#2E2E2E] hover:bg-[#F5F5F5]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !contractDate}
          className="rounded-lg bg-[#F7941D] px-5 py-2 text-sm font-semibold text-[#111111] shadow-sm hover:bg-[#FFB347] disabled:opacity-50"
        >
          {submitting ? "Saving…" : project ? "Save Changes" : "Add Project"}
        </button>
      </div>
    </div>
  );
}
