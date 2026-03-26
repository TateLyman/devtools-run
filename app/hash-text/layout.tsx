import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text Hash Generator - MD5, SHA-1, SHA-256, SHA-512 Free",
  description: "Generate hash values for any text. MD5, SHA-1, SHA-256, SHA-512. Client-side only. Free hash generator tool.",
  keywords: ["hash generator", "MD5 hash", "SHA-256 hash", "text to hash", "hash calculator", "checksum generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
