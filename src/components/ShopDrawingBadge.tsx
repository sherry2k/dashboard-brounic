import { shopDrawingStatusLabel } from "@/lib/tasks";

const styles: Record<string, string> = {
  pending: "bg-[#FFB347]/18 text-[#6B3F00] ring-[#FFB347]/30",
  in_progress: "bg-[#F7941D]/16 text-[#7A3E00] ring-[#F7941D]/30",
  submitted: "bg-[#F5F5F5] text-[#2E2E2E] ring-[#2E2E2E]/15",
  approved: "bg-[#111111] text-white ring-[#111111]/20",
  revision_required: "bg-white text-[#111111] ring-[#F7941D]/40 border border-[#F7941D]/30",
  not_required: "bg-white text-[#6B6B6B] ring-[#E5E5E5] border border-[#E5E5E5]",
};

export default function ShopDrawingBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        styles[status] ?? styles.pending
      }`}
    >
      {shopDrawingStatusLabel(status)}
    </span>
  );
}
