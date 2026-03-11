import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator - Generate Secure Passwords Online",
  description:
    "Free online password generator. Create strong, random passwords with customizable length and character options. Includes strength indicator. No signup required.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password generator",
    "password generator online",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/password",
  },
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
