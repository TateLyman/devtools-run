import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Password Strength Checker - How Strong is Your Password? Free",
  description: "Check password strength instantly. See time to crack, entropy score, and tips to improve. Your password never leaves your browser. Free password checker.",
  keywords: ["password strength checker", "password tester", "how strong is my password", "password strength meter", "password security check"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
