"use client";

import Link from "next/link";
import { useApiKey } from "@/lib/api-key-storage";

// 導覽列上的「API 金鑰」連結，用小圓點顯示這個瀏覽器有沒有設定 key
export function ApiKeyStatus() {
  const key = useApiKey();
  const ready = Boolean(key);

  return (
    <Link
      href="/settings"
      className="inline-flex shrink-0 items-center gap-2 text-ink-soft transition-colors hover:text-ink"
      title={key === null ? "API 金鑰" : ready ? "已設定 API 金鑰" : "尚未設定 API 金鑰"}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full transition-colors ${
          key === null ? "bg-line-strong" : ready ? "bg-jade" : "bg-seal animate-pulse"
        }`}
      />
      API 金鑰
    </Link>
  );
}
