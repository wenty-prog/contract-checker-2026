"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type AuthFormState } from "@/app/actions/auth";
import { alertError, btnPrimary, card, fieldLabel, input } from "@/components/ui";

const INITIAL: AuthFormState = { error: null, email: "" };

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const isRegister = mode === "register";
  const [state, formAction, pending] = useActionState(isRegister ? register : login, INITIAL);
  const query = next === "/" ? "" : `?next=${encodeURIComponent(next)}`;

  return (
    <form action={formAction} className={`flex flex-col gap-5 p-6 sm:p-8 ${card}`}>
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-2">
        <span className={fieldLabel}>Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          className={input}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={fieldLabel}>密碼</span>
        <input
          type="password"
          name="password"
          required
          minLength={isRegister ? 8 : undefined}
          autoComplete={isRegister ? "new-password" : "current-password"}
          className={input}
        />
        {isRegister && <span className="text-xs text-muted">至少 8 個字元</span>}
      </label>

      {isRegister && (
        <label className="flex flex-col gap-2">
          <span className={fieldLabel}>確認密碼</span>
          <input type="password" name="confirmPassword" required autoComplete="new-password" className={input} />
        </label>
      )}

      {state.error && (
        <p className={alertError} role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${btnPrimary} mt-1 w-full`}>
        {pending ? "處理中…" : isRegister ? "註冊" : "登入"}
      </button>

      <p className="text-center text-sm text-muted">
        {isRegister ? "已經有帳號了？" : "還沒有帳號？"}
        <Link
          href={`${isRegister ? "/login" : "/register"}${query}`}
          className="ml-1 font-medium text-seal underline-offset-4 hover:underline"
        >
          {isRegister ? "登入" : "免費註冊"}
        </Link>
      </p>
    </form>
  );
}
