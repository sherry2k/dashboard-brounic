import { statusLabel } from "@/lib/tasks";

const styles: Record<string, string> = {
  active: "bg-[#F7941D]/15 text-[#7A3E00] ring-[#F7941D]/30",
  pending: "bg-[#FFB347]/20 text-[#6B3F00] ring-[#FFB347]/30",
  completed: "bg-[#111111] text-white ring-[#111111]/20",
  on_hold: "bg-white text-[#2E2E2E] ring-[#2E2E2E]/15 border border-[#E5E5E5]",
  complete: "bg-[#111111] text-white ring-[#111111]/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        styles[status] ?? "bg-white text-[#2E2E2E] ring-[#2E2E2E]/15"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
