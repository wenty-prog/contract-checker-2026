// 前後端共用的檔案規則（不能 import 任何只能在伺服器跑的套件）

export type ContractFileType = "pdf" | "docx" | "txt";

// Vercel Serverless Function 的請求本文上限約 4.5MB，留一點空間給表單欄位
export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = ".pdf,.docx,.txt";

export function detectFileType(fileName: string): ContractFileType | null {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "pdf" || ext === "docx" || ext === "txt") return ext;
  return null;
}

export const CONTENT_TYPES: Record<ContractFileType, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain; charset=utf-8",
};
