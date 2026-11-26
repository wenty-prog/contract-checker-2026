import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReviewReport } from "@/components/ReviewReport";
import { btnGhost } from "@/components/ui";
import { getMyReview } from "@/lib/reviews";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Taipei",
});

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function ReviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await getMyReview(id);
  if (!review) notFound();

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="eyebrow inline-flex items-center gap-3 text-muted">
            <span className="h-px w-8 bg-seal" />
            Review report
          </span>
          <h1 className="font-serif text-2xl leading-snug font-semibold break-all text-ink sm:text-3xl">
            {review.originalFileName}
          </h1>
          <p className="text-sm text-muted">
            {dateFormatter.format(new Date(review.createdAt))}・{formatSize(review.fileSize)}・{review.model}
          </p>
        </div>
        <a href={review.blobUrl} target="_blank" rel="noopener noreferrer" className={`${btnGhost} shrink-0`}>
          查看原始檔案 ↗
        </a>
      </div>
      <ReviewReport result={review.result} />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-paper-deep" />
      <div className="h-48 animate-pulse rounded-[1.75rem] bg-paper-deep" />
      <div className="h-72 animate-pulse rounded-[1.75rem] bg-paper-deep" />
    </div>
  );
}

export default function ReviewPage(props: PageProps<"/history/[id]">) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6 md:py-16">
      <Link href="/history" className="w-fit text-sm text-muted transition-colors hover:text-ink">
        ← 回到審查紀錄
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        <ReviewDetail params={props.params} />
      </Suspense>
    </div>
  );
}
