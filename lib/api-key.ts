// BYOK（Bring Your Own Key）前後端共用的規則（不能 import 任何只能在伺服器跑的套件）

/** 前端把使用者的 OpenAI API key 放在這個 request header 傳給 /api/reviews */
export const API_KEY_HEADER = "x-openai-api-key";

export const MAX_API_KEY_LENGTH = 300;

// OpenAI 的 key 都是 sk- 開頭（sk-proj-…、sk-svcacct-… 等），只允許 key 會用到的字元
const API_KEY_PATTERN = /^sk-[A-Za-z0-9_-]{20,}$/;

export function isValidApiKeyFormat(value: string): boolean {
  return value.length <= MAX_API_KEY_LENGTH && API_KEY_PATTERN.test(value);
}

/** 遮住中間的字元，畫面上只顯示頭尾，例如 sk-pro…a1B2 */
export function maskApiKey(key: string): string {
  return key.length <= 12 ? "•".repeat(key.length) : `${key.slice(0, 6)}…${key.slice(-4)}`;
}
