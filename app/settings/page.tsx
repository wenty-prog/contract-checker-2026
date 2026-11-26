import type { Metadata } from "next";
import { Suspense } from "react";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { PageIntro } from "@/components/PageIntro";
import { safeRedirectPath } from "@/lib/session";

export const metadata: Metadata = { title: "API 金鑰｜AI 合約審查器" };

async function SettingsContent({ searchParams }: { searchParams: PageProps<"/settings">["searchParams"] }) {
  const raw = (await searchParams).next;
  const next = raw === undefined ? null : safeRedirectPath(raw);
  return <ApiKeySettings next={next} />;
}

export default function SettingsPage(props: PageProps<"/settings">) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-20">
      <PageIntro
        eyebrow="Bring your own key"
        title="設定你的 OpenAI API 金鑰"
        body="本服務採 BYOK 模式：審查使用你自己的 OpenAI 金鑰與額度。金鑰只存在你的瀏覽器，不會儲存在我們的伺服器。"
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-[1.75rem] bg-paper-deep" />}>
        <SettingsContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
