import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Password Generator - Strong Random Passwords Free",
  description: "Generate strong random passwords. Choose length, uppercase, lowercase, numbers, symbols. Bulk generate. Copy instantly. Free password generator.",
  keywords: ["password generator", "random password", "strong password", "secure password", "password maker", "generate password"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
