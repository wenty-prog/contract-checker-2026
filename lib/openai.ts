import OpenAI from "openai";
import type { ResponseInputContent } from "openai/resources/responses/responses";
import type { ContractInput } from "@/lib/contract-file";
import { isReviewResult, reviewJsonSchema, type ReviewResult } from "@/lib/review-schema";

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

const SYSTEM_PROMPT = `你是一位資深的台灣執業律師，專門審閱各類合約。
請以「簽約方（使用者）」的立場審查合約，找出對使用者不利、模糊或不合理的條款。
- 所有輸出一律使用繁體中文（台灣用語）。
- riskyClauses 的 originalText 必須直接引用合約原文，不要改寫。
- suggestion 要給具體可替換的條款文字或修改方向。
- missingClauses 列出這類合約通常應有、但本合約缺少的條款。
- riskScore 為 0 到 100 的整數，越高代表對使用者越不利。
- 如果文件看起來不是合約，contractType 填「非合約文件」，並在 summary 說明。`;

/** 把 OpenAI 的錯誤轉成給使用者看的訊息（不要把 key 或原始錯誤內容回傳給前端） */
export function describeOpenAIError(error: unknown): string {
  if (error instanceof OpenAI.AuthenticationError) {
    return "OpenAI API 金鑰無效或已被撤銷，請到「API 金鑰」頁面重新設定";
  }
  if (error instanceof OpenAI.PermissionDeniedError) {
    return `這把 API 金鑰沒有使用 ${OPENAI_MODEL} 模型的權限`;
  }
  if (error instanceof OpenAI.RateLimitError) {
    return "OpenAI 帳戶額度不足或請求太頻繁，請確認帳戶餘額後再試";
  }
  if (error instanceof OpenAI.APIConnectionError) {
    return "無法連線到 OpenAI，請稍後再試";
  }
  if (error instanceof OpenAI.APIError) {
    return `OpenAI 回傳錯誤（${error.status ?? "未知"}），請稍後再試`;
  }
  return error instanceof Error ? error.message : "未知錯誤";
}

/**
 * BYOK：每次請求都用使用者自己提供的 API key 建立 client，
 * 不讀取環境變數，也不在伺服器保留 key。
 */
export async function reviewContract(input: ContractInput, apiKey: string): Promise<ReviewResult> {
  const client = new OpenAI({ apiKey, maxRetries: 1 });

  const content: ResponseInputContent[] =
    input.kind === "pdf"
      ? [
          {
            type: "input_file",
            filename: input.fileName,
            file_data: `data:application/pdf;base64,${input.base64}`,
          },
          { type: "input_text", text: "請審查上面這份合約。" },
        ]
      : [
          {
            type: "input_text",
            text: `請審查以下合約（檔名：${input.fileName}）：\n\n${input.text}`,
          },
        ];

  const response = await client.responses.create({
    model: OPENAI_MODEL,
    instructions: SYSTEM_PROMPT,
    input: [{ role: "user", content }],
    text: {
      format: {
        type: "json_schema",
        name: "contract_review",
        strict: true,
        schema: reviewJsonSchema,
      },
    },
  });

  const parsed: unknown = JSON.parse(response.output_text);
  if (!isReviewResult(parsed)) {
    throw new Error("AI 回傳的審查結果格式不正確");
  }
  return parsed;
}
