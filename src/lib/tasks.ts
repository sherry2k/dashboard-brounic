export type Task = { key: string; label: string };

export const DEFAULT_SUPPLY_TASKS: Task[] = [
  { key: "facp_installation", label: "FACP Installation" },
  { key: "pvc_piping", label: "PVC Piping" },
  {
    key: "device_installation",
    label: "Device Installation (Alarm & Emergency Light)",
  },
  { key: "fire_pump_installation", label: "Fire Pump Installation" },
  { key: "mcp", label: "MCP" },
  { key: "fire_pump_power_supply", label: "Fire Pump Power Supply" },
];

export const PROJECT_TYPES = [
  { value: "supply", label: "New Project — Supply and Installation" },
  { value: "maintenance", label: "Maintenance" },
  { value: "amc", label: "AMC" },
] as const;

export const PROJECT_STATUSES = ["active", "pending", "completed", "on_hold"] as const;

export const SHOP_DRAWING_STATUSES = [
  "pending",
  "in_progress",
  "submitted",
  "approved",
  "revision_required",
  "not_required",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ShopDrawingStatus = (typeof SHOP_DRAWING_STATUSES)[number];

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    completed: "Completed",
    on_hold: "On Hold",
    complete: "Complete",
  };
  return map[status] ?? status;
}

export function shopDrawingStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    submitted: "Submitted",
    approved: "Approved",
    revision_required: "Revision Required",
    not_required: "Not Required",
  };
  return map[status] ?? status;
}

export function computeProgress(
  tasks: Task[] | null | undefined,
  completed: string[] | null | undefined
): number {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter((t) => (completed ?? []).includes(t.key)).length;
  return Math.round((done / tasks.length) * 100);
}
