"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { alertError, alertOk, btnGhost, btnPrimary, card, fieldLabel, input } from "@/components/ui";
import { MAX_API_KEY_LENGTH, isValidApiKeyFormat, maskApiKey } from "@/lib/api-key";
import { clearApiKey, saveApiKey, useApiKey } from "@/lib/api-key-storage";

// 輸入、儲存、清除 API key；key 只存在瀏覽器的 localStorage
export function ApiKeySettings({ next }: { next: string | null }) {
  const storedKey = useApiKey();
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const trimmed = value.trim();

  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidApiKeyFormat(trimmed)) {
      setMessage({ ok: false, text: "格式不正確：OpenAI API key 應該是 sk- 開頭，而且不能有空白。" });
      return;
    }
    if (!saveApiKey(trimmed)) {
      setMessage({ ok: false, text: "瀏覽器不允許儲存資料（可能是無痕模式或封鎖了網站資料），請調整設定後再試。" });
      return;
    }
    setValue("");
    setShowKey(false);
    setMessage({ ok: true, text: "已儲存，可以開始審查合約了。" });
  }

  function remove() {
    clearApiKey();
    setMessage({ ok: true, text: "已從這個瀏覽器清除 API key。" });
  }

  return (
    <div className="flex flex-col gap-5">
      <section className={`flex flex-col gap-4 p-6 sm:p-8 ${card}`}>
        <p className={fieldLabel}>目前狀態</p>
        {storedKey === null ? (
          <div className="h-7 w-48 animate-pulse rounded-lg bg-paper-deep" />
        ) : storedKey ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2.5 text-ink">
              <span aria-hidden className="size-2 rounded-full bg-jade" />
              已設定
              <code className="rounded-lg border border-line bg-paper px-2.5 py-1 font-mono text-sm">
                {maskApiKey(storedKey)}
              </code>
            </p>
            <div className="flex items-center gap-5 text-sm font-medium">
              <Link href={next ?? "/review"} className="text-seal hover:underline">
                開始審查 →
              </Link>
              <button type="button" onClick={remove} className="text-muted transition-colors hover:text-seal">
                清除金鑰
              </button>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2.5 text-muted">
            <span aria-hidden className="size-2 rounded-full bg-line-strong" />
            這個瀏覽器還沒設定 API key
          </p>
        )}
      </section>

      <form onSubmit={save} className={`flex flex-col gap-4 p-6 sm:p-8 ${card}`}>
        <label htmlFor="api-key" className={fieldLabel}>
          {storedKey ? "更換 API key" : "輸入 API key"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={MAX_API_KEY_LENGTH}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-..."
              className={`${input} pr-16 font-mono text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute inset-y-0 right-3 my-auto h-fit text-xs text-muted hover:text-ink"
            >
              {showKey ? "隱藏" : "顯示"}
            </button>
          </div>
          <button type="submit" disabled={!trimmed} className={btnPrimary}>
            儲存金鑰
          </button>
        </div>
        {message && (
          <p className={message.ok ? alertOk : alertError} role={message.ok ? "status" : "alert"}>
            {message.text}
          </p>
        )}
        <p className="text-xs leading-6 text-muted">
          還沒有金鑰？到{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-seal"
          >
            OpenAI 後台
          </a>{" "}
          建立一把，並確認帳戶有可用額度。
        </p>
      </form>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "只存在你的瀏覽器", d: "金鑰保存在這台裝置的 localStorage，換裝置或瀏覽器需要重新輸入。" },
          { t: "伺服器不儲存", d: "每次審查時隨請求送出，只在該次請求中使用，不寫入資料庫與紀錄。" },
          { t: "共用電腦請清除", d: "在公用或共用的電腦上使用完畢後，記得按「清除金鑰」。" },
        ].map((item) => (
          <div key={item.t} className="flex flex-col gap-2 rounded-2xl border border-line bg-paper-deep/40 p-5">
            <p className="font-serif font-semibold text-ink">{item.t}</p>
            <p className="text-sm leading-6 text-muted">{item.d}</p>
          </div>
        ))}
      </section>

      <div>
        <Link href="/" className={btnGhost}>
          ← 回到產品介紹
        </Link>
      </div>
    </div>
  );
}
