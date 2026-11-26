// 內頁共用的標題區：小標 + 襯線大標 + 說明
export function PageIntro({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      <span className="eyebrow inline-flex items-center gap-3 text-muted">
        <span className="h-px w-8 bg-seal" />
        {eyebrow}
      </span>
      <h1 className="font-serif text-3xl leading-snug font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {body && <p className={`leading-7 text-ink-soft ${center ? "max-w-md" : "max-w-xl"}`}>{body}</p>}
    </div>
  );
}
