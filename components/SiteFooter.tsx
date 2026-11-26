import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-serif text-lg font-semibold text-ink">合約審查器</span>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-muted">
            簽名之前，先讀懂每一條。以台灣法律語境為基礎，幫你找出合約裡對你不利的地方。
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="eyebrow text-faint">產品</p>
          <Link href="/" className="text-ink-soft hover:text-ink">
            產品介紹
          </Link>
          <Link href="/review" className="text-ink-soft hover:text-ink">
            開始審查
          </Link>
          <Link href="/history" className="text-ink-soft hover:text-ink">
            審查紀錄
          </Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="eyebrow text-faint">帳戶</p>
          <Link href="/settings" className="text-ink-soft hover:text-ink">
            API 金鑰設定
          </Link>
          <Link href="/login" className="text-ink-soft hover:text-ink">
            會員登入
          </Link>
          <Link href="/register" className="text-ink-soft hover:text-ink">
            免費註冊
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:justify-between sm:px-6">
          <p>© AI 合約審查器</p>
          <p>AI 審查結果僅供參考，不構成法律意見；重要合約請諮詢專業律師。</p>
        </div>
      </div>
    </footer>
  );
}
