import { RiskBadge } from "@/components/RiskBadge";
import { card } from "@/components/ui";
import type { ReviewResult } from "@/lib/review-schema";

const RISK_ORDER = { high: 0, medium: 1, low: 2 } as const;

function scoreTone(score: number): { text: string; ring: string; label: string } {
  if (score >= 70) return { text: "text-seal", ring: "border-seal", label: "高度不利" };
  if (score >= 40) return { text: "text-ochre", ring: "border-ochre", label: "需要留意" };
  return { text: "text-jade", ring: "border-jade", label: "大致合理" };
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline gap-4 border-b border-line pb-3">
        <span className="font-mono text-xs text-seal">{eyebrow}</span>
        <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ReviewReport({ result }: { result: ReviewResult }) {
  const clauses = [...result.riskyClauses].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel],
  );
  const tone = scoreTone(result.riskScore);

  return (
    <div className="flex flex-col gap-14">
      <div className={`grid overflow-hidden sm:grid-cols-[1fr_auto] ${card}`}>
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-faint">合約類型</span>
            <span className="font-serif text-lg font-semibold text-ink">{result.contractType}</span>
            <RiskBadge level={result.overallRisk} />
          </div>
          {result.parties.length > 0 && (
            <p className="text-sm text-muted">當事人：{result.parties.join("、")}</p>
          )}
          <p className="leading-8 text-ink-soft">{result.summary}</p>
        </div>
        {/* 像印章一樣的風險分數 */}
        <div className="flex flex-col items-center justify-center gap-3 border-t border-line bg-paper/60 px-10 py-8 sm:border-t-0 sm:border-l">
          <div
            className={`flex size-28 rotate-[-6deg] flex-col items-center justify-center rounded-full border-2 ${tone.ring} ${tone.text}`}
          >
            <span className="font-serif text-4xl leading-none font-bold">{result.riskScore}</span>
            <span className="mt-1 text-[0.65rem] tracking-[0.2em]">{tone.label}</span>
          </div>
          <span className="text-xs text-faint">風險分數・滿分 100</span>
        </div>
      </div>

      <Section eyebrow="01" title={`風險條款（${clauses.length}）`}>
        {clauses.length === 0 ? (
          <p className="text-muted">沒有發現明顯的風險條款。</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {clauses.map((clause, index) => (
              <li key={index} className={`flex flex-col gap-4 p-6 sm:p-7 ${card}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold text-ink">{clause.title}</h3>
                  <RiskBadge level={clause.riskLevel} />
                </div>
                <blockquote className="border-l-2 border-line-strong bg-paper/70 px-4 py-3 font-serif text-[0.95rem] leading-7 whitespace-pre-wrap text-ink-soft">
                  {clause.originalText}
                </blockquote>
                <div className="flex flex-col gap-1">
                  <span className="eyebrow text-faint">風險說明</span>
                  <p className="leading-7 text-ink-soft">{clause.explanation}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-jade/20 bg-jade-tint px-4 py-3">
                  <span className="eyebrow text-jade/80">修改建議</span>
                  <p className="leading-7 text-jade">{clause.suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {result.missingClauses.length > 0 && (
        <Section eyebrow="02" title={`缺漏條款（${result.missingClauses.length}）`}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {result.missingClauses.map((item, index) => (
              <li key={index} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
                <p className="font-serif font-semibold text-ink">{item.title}</p>
                <p className="text-sm leading-7 text-muted">{item.reason}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.recommendations.length > 0 && (
        <Section eyebrow="03" title="整體建議">
          <ol className="flex flex-col">
            {result.recommendations.map((item, index) => (
              <li key={index} className="flex gap-5 border-b border-line py-4 last:border-b-0">
                <span className="font-serif text-lg font-semibold text-line-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="leading-7 text-ink-soft">{item}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}
