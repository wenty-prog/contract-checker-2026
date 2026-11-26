"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { alertError, btnPrimary, card } from "@/components/ui";
import { API_KEY_HEADER, maskApiKey } from "@/lib/api-key";
import { useApiKey } from "@/lib/api-key-storage";
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE, detectFileType } from "@/lib/file-rules";

function validate(file: File): string | null {
  if (!detectFileType(file.name)) return "只支援 PDF、Word（.docx）和純文字（.txt）檔案";
  if (file.size > MAX_FILE_SIZE) return "檔案太大，請上傳 4MB 以內的檔案";
  return null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// 還沒設定 API key 時顯示的提示
function MissingKeyNotice() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ochre/25 bg-ochre-tint px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-ink">尚未設定 OpenAI API 金鑰</p>
        <p className="text-sm text-ink-soft">本服務採 BYOK，審查會使用你自己的金鑰與額度。</p>
      </div>
      <Link
        href="/settings?next=%2Freview"
        className="shrink-0 rounded-full bg-ink px-4 py-2 text-center text-sm font-medium text-paper transition-colors hover:bg-seal"
      >
        前往設定 →
      </Link>
    </div>
  );
}

export function UploadForm() {
  const router = useRouter();
  const apiKey = useApiKey();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const hasKey = Boolean(apiKey);

  function pick(next: File | undefined) {
    if (!next) return;
    const problem = validate(next);
    setError(problem);
    setFile(problem ? null : next);
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    pick(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || submitting || !apiKey) return;

    setSubmitting(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      // BYOK：把使用者自己的 key 放在 header 傳給伺服器，伺服器只在這次請求中使用
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { [API_KEY_HEADER]: apiKey },
        body,
      });
      const data: unknown = await res.json();

      if (!res.ok || typeof data !== "object" || data === null || !("id" in data)) {
        const message =
          typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
            ? data.error
            : "審查失敗，請稍後再試";
        setError(message);
        setSubmitting(false);
        return;
      }

      router.push(`/history/${String(data.id)}`);
    } catch {
      setError("無法連線到伺服器，請稍後再試");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {apiKey === "" && <MissingKeyNotice />}

      <div className={`flex flex-col gap-5 p-3 ${card}`}>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[1.35rem] border border-dashed px-6 py-16 text-center transition-all duration-300 ${
            dragging
              ? "border-seal bg-seal-tint/60"
              : file
                ? "border-ink/40 bg-paper/60"
                : "border-line-strong bg-paper/40 hover:border-ink/50 hover:bg-paper/70"
          } ${submitting ? "pointer-events-none" : ""}`}
        >
          <input
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={onChange}
            disabled={submitting}
            className="sr-only"
          />
          {/* 文件圖示 */}
          <span
            aria-hidden
            className={`relative flex h-16 w-13 flex-col gap-1.5 rounded-md border bg-surface px-2.5 pt-4 shadow-paper transition-transform duration-500 group-hover:-translate-y-1 ${
              file ? "border-ink/30" : "border-line-strong"
            } ${submitting ? "animate-pulse" : ""}`}
          >
            <span className="h-0.5 w-full rounded bg-line-strong" />
            <span className="h-0.5 w-4/5 rounded bg-line-strong" />
            <span className="h-0.5 w-full rounded bg-line-strong" />
            <span className={`h-0.5 w-3/5 rounded ${file ? "bg-seal" : "bg-line-strong"}`} />
          </span>
          {file ? (
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-semibold break-all text-ink">{file.name}</span>
              <span className="text-sm text-muted">{formatSize(file.size)}・點擊可重新選擇</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-semibold text-ink">點擊或拖曳合約檔案到這裡</span>
              <span className="text-sm text-muted">PDF、Word（.docx）、純文字（.txt），4MB 以內</span>
            </div>
          )}
        </label>

        <div className="flex flex-col gap-3 px-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted">
            <span aria-hidden className={`size-1.5 rounded-full ${hasKey ? "bg-jade" : "bg-line-strong"}`} />
            {apiKey === null ? "讀取金鑰中…" : hasKey ? `使用金鑰 ${maskApiKey(apiKey)}` : "尚未設定金鑰"}
          </p>
          <button type="submit" disabled={!file || submitting || !hasKey} className={btnPrimary}>
            {submitting ? (
              <>
                <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                AI 審查中，約需 30 秒至 1 分鐘…
              </>
            ) : (
              <>
                開始審查 <span aria-hidden>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className={alertError} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
