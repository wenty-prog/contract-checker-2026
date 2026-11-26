"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { fakeVerify, hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession, safeRedirectPath } from "@/lib/session";
import { User } from "@/models/User";

export interface AuthFormState {
  error: string | null;
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 128;

function readForm(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  return {
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
    password: typeof password === "string" ? password : "",
    next: safeRedirectPath(formData.get("next")),
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function register(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password, next } = readForm(formData);
  const confirm = formData.get("confirmPassword");

  if (!EMAIL_PATTERN.test(email)) return { error: "請輸入有效的 Email", email };
  if (password.length < MIN_PASSWORD) return { error: `密碼至少需要 ${MIN_PASSWORD} 個字元`, email };
  if (password.length > MAX_PASSWORD) return { error: `密碼不能超過 ${MAX_PASSWORD} 個字元`, email };
  if (password !== confirm) return { error: "兩次輸入的密碼不一致", email };

  let userId: string;
  try {
    await connectToDatabase();
    const user = await User.create({ email, passwordHash: await hashPassword(password) });
    userId = user._id.toString();
    await createSession(userId);
  } catch (error) {
    if (isDuplicateKeyError(error)) return { error: "這個 Email 已經註冊過了", email };
    console.error("[auth] 註冊失敗", error);
    return { error: "註冊失敗，請稍後再試", email };
  }

  redirect(next);
}

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password, next } = readForm(formData);
  if (!email || !password) return { error: "請輸入 Email 和密碼", email };

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      await fakeVerify(password);
      return { error: "Email 或密碼錯誤", email };
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      return { error: "Email 或密碼錯誤", email };
    }
    await createSession(user._id.toString());
  } catch (error) {
    console.error("[auth] 登入失敗", error);
    return { error: "登入失敗，請稍後再試", email };
  }

  redirect(next);
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
