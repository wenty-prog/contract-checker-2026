// 只能在伺服器端使用（Server Component、Server Action、Route Handler）
import { createHash, randomBytes } from "node:crypto";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { User } from "@/models/User";

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 7;

export interface CurrentUser {
  id: string;
  email: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** 登入成功後呼叫：建立 session 並寫入 httpOnly cookie */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await connectToDatabase();
  await Session.create({ tokenHash: hashToken(token), userId, expiresAt });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // 前端 JS 讀不到，降低 XSS 偷 cookie 的風險
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** 登出：刪除資料庫裡的 session 和瀏覽器的 cookie */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectToDatabase();
    await Session.deleteOne({ tokenHash: hashToken(token) });
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** 取得目前登入的會員；同一個請求內多次呼叫只查一次資料庫 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // 下面要用「現在時間」判斷 session 是否過期，必須等到實際請求時才執行，不能在預渲染時算
  await connection();
  await connectToDatabase();
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session || !isValidObjectId(session.userId)) return null;

  const user = await User.findById(session.userId).select("email").lean();
  if (!user) return null;

  return { id: user._id.toString(), email: user.email };
});

/** 頁面用：沒登入就導到登入頁，登入後再回到原本的頁面 */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** 只接受站內相對路徑，避免 open redirect */
export function safeRedirectPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
