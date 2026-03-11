import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator - Generate MD5, SHA-1, SHA-256 Hashes Online",
  description:
    "Free online hash generator. Create MD5, SHA-1, and SHA-256 hashes from any text. Uses the Web Crypto API. No data sent to any server.",
  keywords: [
    "hash generator",
    "MD5 hash",
    "SHA-1 hash",
    "SHA-256 hash",
    "online hash",
    "crypto hash",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/hash",
  },
};

export default function HashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
