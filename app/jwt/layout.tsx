import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder - Decode JSON Web Tokens Online",
  description:
    "Free online JWT decoder. Paste a JSON Web Token to decode and inspect the header, payload, and signature. Check expiration and issued dates.",
  keywords: [
    "JWT decoder",
    "decode JWT",
    "JSON Web Token",
    "JWT online",
    "JWT parser",
  ],
};

export default function JwtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
