// 只能在伺服器端使用（mammoth 依賴 Node.js API），前端請改用 lib/file-rules.ts
import mammoth from "mammoth";
import type { ContractFileType } from "@/lib/file-rules";

// PDF 直接交給 OpenAI 讀（可以看到排版與表格）；Word / 純文字先抽出文字
export type ContractInput =
  | { kind: "pdf"; fileName: string; base64: string }
  | { kind: "text"; fileName: string; text: string };

export async function toContractInput(
  buffer: Buffer,
  fileName: string,
  fileType: ContractFileType,
): Promise<ContractInput> {
  if (fileType === "pdf") {
    return { kind: "pdf", fileName, base64: buffer.toString("base64") };
  }

  const text =
    fileType === "docx"
      ? (await mammoth.extractRawText({ buffer })).value
      : buffer.toString("utf8");

  return { kind: "text", fileName, text: text.trim() };
}
