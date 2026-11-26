import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/PageIntro";
import { RiskBadge } from "@/components/RiskBadge";
import { btnPrimary, card } from "@/components/ui";
import { listMyReviews } from "@/lib/reviews";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Taipei",
});

async function ReviewList() {
  const reviews = await listMyReviews();

  if (reviews.length === 0) {
    return (
      <div className={`flex flex-col items-center gap-5 px-6 py-16 text-center ${card}`}>
        <p className="font-serif text-lg font-semibold text-ink">還沒有任何審查紀錄</p>
        <p className="text-sm text-muted">上傳第一份合約，報告會保存在這裡。</p>
        <Link href="/review" className={btnPrimary}>
          上傳第一份合約 →
        </Link>
      </div>
    );
  }

  return (
    <ul className={`divide-y divide-line overflow-hidden ${card}`}>
      {reviews.map((review) => (
        <li key={review.id}>
          <Link
            href={`/history/${review.id}`}
            className="group flex items-center gap-4 px-5 py-5 transition-colors duration-300 hover:bg-paper/70 sm:px-7"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate font-serif font-semibold text-ink transition-colors group-hover:text-seal">
                {review.originalFileName}
              </span>
              <span className="text-sm text-muted">
                {review.contractType}・{dateFormatter.format(new Date(review.createdAt))}
              </span>
            </div>
            <span className="hidden font-serif text-ink-soft tabular-nums sm:inline">
              {review.riskScore}
              <span className="ml-0.5 text-xs text-faint">分</span>
            </span>
            <RiskBadge level={review.overallRisk} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-paper-deep" />
      ))}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageIntro eyebrow="History" title="審查紀錄" body="你上傳過的合約與審查報告，只有你自己看得到。" />
        <Link href="/review" className={`${btnPrimary} shrink-0`}>
          新的審查 +
        </Link>
      </div>
      <Suspense fallback={<ListSkeleton />}>
        <ReviewList />
      </Suspense>
    </div>
  );
}
