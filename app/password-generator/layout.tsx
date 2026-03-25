import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Password Generator - Generate Strong Passwords Online Free",
  description: "Generate strong, random passwords with customizable length and character types. Cryptographically secure using Web Crypto API. Free online password generator.",
  keywords: ["password generator", "random password", "strong password", "secure password", "password maker", "generate password online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
