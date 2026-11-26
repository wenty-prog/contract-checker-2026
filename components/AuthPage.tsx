import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { PageIntro } from "@/components/PageIntro";
import { getCurrentUser, safeRedirectPath } from "@/lib/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function AuthContent({
  mode,
  searchParams,
}: {
  mode: "login" | "register";
  searchParams: SearchParams;
}) {
  const next = safeRedirectPath((await searchParams).next);
  // 已經登入的人不需要再看到登入 / 註冊頁
  if (await getCurrentUser()) redirect(next);
  return <AuthForm mode={mode} next={next} />;
}

export function AuthPage({
  mode,
  searchParams,
}: {
  mode: "login" | "register";
  searchParams: SearchParams;
}) {
  const isLogin = mode === "login";
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 py-16 sm:px-6 md:py-24">
      <PageIntro
        align="center"
        eyebrow={isLogin ? "Welcome back" : "Create account"}
        title={isLogin ? "會員登入" : "註冊會員"}
        body={isLogin ? "登入後即可上傳合約並查看你的審查紀錄" : "用 Email 建立帳號，審查紀錄只有你看得到"}
      />
      <Suspense fallback={<div className="h-80 animate-pulse rounded-[1.75rem] bg-paper-deep" />}>
        <AuthContent mode={mode} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
