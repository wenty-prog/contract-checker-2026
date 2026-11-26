import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/PageIntro";
import { UploadForm } from "@/components/UploadForm";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "開始審查｜AI 合約審查器" };

async function UploadSection() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className={`flex flex-col items-center gap-5 px-6 py-14 text-center ${card}`}>
        <span className="flex size-14 items-center justify-center rounded-full border border-line-strong font-serif text-xl text-seal">
          鎖
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="font-serif text-lg font-semibold text-ink">請先登入會員，再上傳合約</p>
          <p className="text-sm text-muted">你的合約與審查結果只有你自己看得到</p>
        </div>
        <div className="flex gap-3">
          <Link href="/login?next=%2Freview" className={btnGhost}>
            登入
          </Link>
          <Link href="/register?next=%2Freview" className={btnPrimary}>
            免費註冊
          </Link>
        </div>
      </div>
    );
  }

  return <UploadForm />;
}

export default function ReviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-20">
      <PageIntro
        eyebrow="New review"
        title="上傳一份合約"
        body="AI 會逐條審閱，找出風險條款與缺漏條款，並提供修改建議。"
      />
      <Suspense fallback={<div className="h-80 animate-pulse rounded-[1.75rem] bg-paper-deep" />}>
        <UploadSection />
      </Suspense>
    </div>
  );
}
