import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { ApiKeyStatus } from "@/components/ApiKeyStatus";
import { BrandMark } from "@/components/BrandMark";
import { getCurrentUser } from "@/lib/session";

async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          className="rounded-full px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
        >
          登入
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-seal"
        >
          免費註冊
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-44 truncate text-sm text-muted md:inline" title={user.email}>
        {user.email}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          登出
        </button>
      </form>
    </div>
  );
}

const navLink = "shrink-0 text-ink-soft transition-colors hover:text-ink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-[1.05rem] font-semibold tracking-wide text-ink">合約審查器</span>
              <span className="eyebrow text-[0.6rem] text-muted">AI Contract Review</span>
            </span>
          </Link>
          <div className="md:hidden">
            <Suspense fallback={<div className="h-8 w-28 animate-pulse rounded-full bg-paper-deep" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>

        <nav className="-mx-4 flex items-center gap-6 overflow-x-auto px-4 pb-1 text-sm md:mx-0 md:flex-1 md:justify-center md:overflow-visible md:p-0">
          <Link href="/" className={navLink}>
            產品介紹
          </Link>
          <Link href="/review" className={navLink}>
            開始審查
          </Link>
          <Link href="/history" className={navLink}>
            審查紀錄
          </Link>
          <ApiKeyStatus />
        </nav>

        <div className="hidden md:block">
          <Suspense fallback={<div className="h-8 w-28 animate-pulse rounded-full bg-paper-deep" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
