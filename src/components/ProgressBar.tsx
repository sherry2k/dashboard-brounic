export default function ProgressBar({
  value,
  color = "brand",
  size = "md",
}: {
  value: number;
  color?: "brand" | "red" | "amber" | "emerald" | "sky" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  const clamped = Math.max(0, Math.min(100, value || 0));
  const colors: Record<string, string> = {
    brand: "from-[#F7941D] to-[#FFB347]",
    red: "from-[#F7941D] to-[#FFB347]",
    amber: "from-[#FFB347] to-[#F7941D]",
    emerald: "from-[#111111] to-[#2E2E2E]",
    sky: "from-[#2E2E2E] to-[#111111]",
    dark: "from-[#111111] to-[#2E2E2E]",
  };
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };
  return (
    <div className="w-full">
      <div className={`${heights[size]} w-full overflow-hidden rounded-full bg-[#EDEDED]`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color] ?? colors.brand} transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
