// 品牌標誌：一枚朱紅色的方形印章
export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-11 text-xl" : "size-9 text-base";
  return (
    <span
      aria-hidden
      className={`${box} relative inline-flex shrink-0 -rotate-3 items-center justify-center rounded-[0.6rem] bg-seal font-serif font-bold text-surface shadow-[inset_0_0_0_2px_rgba(255,253,248,0.35)]`}
    >
      契
    </span>
  );
}
