import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";

export const metadata: Metadata = { title: "會員登入｜AI 合約審查器" };

export default function LoginPage(props: PageProps<"/login">) {
  return <AuthPage mode="login" searchParams={props.searchParams} />;
}
