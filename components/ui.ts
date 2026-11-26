// 全站共用的樣式字串（Tailwind class），讓按鈕、卡片、輸入框在每一頁長得一樣

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:bg-seal hover:shadow-[0_12px_30px_-12px_rgba(168,50,30,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seal disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-surface disabled:shadow-none";

export const btnSeal =
  "inline-flex items-center justify-center gap-2 rounded-full bg-seal px-6 py-3 text-sm font-medium text-surface transition-all duration-300 hover:bg-seal-hover hover:shadow-[0_12px_30px_-12px_rgba(168,50,30,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seal disabled:cursor-not-allowed disabled:bg-line-strong disabled:shadow-none";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface/60 px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seal";

export const card = "rounded-[1.75rem] border border-line bg-surface shadow-paper";

export const input =
  "w-full rounded-xl border border-line-strong bg-paper/40 px-4 py-3 text-ink outline-none transition placeholder:text-faint focus:border-ink focus:bg-surface focus:ring-4 focus:ring-ink/5";

export const fieldLabel = "eyebrow text-muted";

export const alertError =
  "rounded-xl border border-seal/20 bg-seal-tint px-4 py-3 text-sm leading-6 text-seal-hover";

export const alertOk = "rounded-xl border border-jade/20 bg-jade-tint px-4 py-3 text-sm leading-6 text-jade";
