import type { RiskLevel } from "@/lib/review-schema";

const STYLES: Record<RiskLevel, { label: string; className: string; dot: string }> = {
  low: { label: "低風險", className: "border-jade/25 bg-jade-tint text-jade", dot: "bg-jade" },
  medium: { label: "中風險", className: "border-ochre/25 bg-ochre-tint text-ochre", dot: "bg-ochre" },
  high: { label: "高風險", className: "border-seal/25 bg-seal-tint text-seal", dot: "bg-seal" },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const style = STYLES[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
