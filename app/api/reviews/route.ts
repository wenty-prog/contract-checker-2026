import { del, put } from "@vercel/blob";
import { API_KEY_HEADER, isValidApiKeyFormat } from "@/lib/api-key";
import { toContractInput } from "@/lib/contract-file";
import { CONTENT_TYPES, MAX_FILE_SIZE, detectFileType } from "@/lib/file-rules";
import { connectToDatabase } from "@/lib/mongodb";
import { OPENAI_MODEL, describeOpenAIError, reviewContract } from "@/lib/openai";
import { getCurrentUser } from "@/lib/session";
import { ContractReview } from "@/models/ContractReview";

// AI 審查長合約可能需要數十秒
export const maxDuration = 120;

function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "未知錯誤";
}

export async function POST(request: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse("請先登入會員", 401);
  }

  // BYOK：API key 由使用者在瀏覽器輸入，每次請求透過 header 帶上來；只在這次請求中使用，不儲存、不記錄
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim() ?? "";
  if (!apiKey) {
    return errorResponse("請先到「API 金鑰」頁面設定你的 OpenAI API key", 400);
  }
  if (!isValidApiKeyFormat(apiKey)) {
    return errorResponse("OpenAI API key 格式不正確，請重新設定", 400);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("無法讀取上傳的表單資料", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return errorResponse("請選擇要上傳的合約檔案", 400);
  }

  const fileType = detectFileType(file.name);
  if (!fileType) {
    return errorResponse("只支援 PDF、Word（.docx）和純文字（.txt）檔案", 400);
  }
  if (file.size > MAX_FILE_SIZE) {
    return errorResponse("檔案太大，請上傳 4MB 以內的檔案", 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. 讀取合約內容
  let input;
  try {
    input = await toContractInput(buffer, file.name, fileType);
  } catch (error) {
    console.error("[reviews] 讀取檔案失敗", error);
    return errorResponse("無法讀取檔案內容，請確認檔案沒有損壞", 400);
  }
  if (input.kind === "text" && input.text.length === 0) {
    return errorResponse("檔案裡沒有可讀取的文字", 400);
  }

  // 2. 呼叫 OpenAI 審查
  let result;
  try {
    result = await reviewContract(input, apiKey);
  } catch (error) {
    // 只記錄錯誤類型，避免把 key 相關內容寫進 log
    console.error("[reviews] OpenAI 審查失敗", error instanceof Error ? error.name : "unknown");
    return errorResponse(`AI 審查失敗：${describeOpenAIError(error)}`, 502);
  }

  // 3. 上傳原始檔到 Vercel Blob
  let blob;
  try {
    blob = await put(`contracts/${file.name}`, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: CONTENT_TYPES[fileType],
    });
  } catch (error) {
    console.error("[reviews] Vercel Blob 上傳失敗", error);
    return errorResponse(`檔案上傳失敗：${errorMessage(error)}`, 502);
  }

  // 4. 把 AI 結果和檔案連結存進 MongoDB
  try {
    await connectToDatabase();
    const review = await ContractReview.create({
      userId: user.id,
      originalFileName: file.name,
      fileType,
      fileSize: file.size,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      model: OPENAI_MODEL,
      result,
    });
    return Response.json({ id: review._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("[reviews] 寫入 MongoDB 失敗", error);
    // 資料庫沒存成功，就把剛上傳的檔案刪掉，避免留下孤兒檔案
    try {
      await del(blob.url);
    } catch (cleanupError) {
      console.error("[reviews] 清除 Blob 檔案失敗", cleanupError);
    }
    return errorResponse(`儲存審查結果失敗：${errorMessage(error)}`, 500);
  }
}
