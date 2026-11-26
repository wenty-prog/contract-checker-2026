import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = { title: "註冊會員｜AI 合約審查器" };

export default function RegisterPage(props: PageProps<"/register">) {
  return <AuthPage mode="register" searchParams={props.searchParams} />;
}
