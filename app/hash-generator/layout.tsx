import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hash Generator - SHA-256, SHA-1, SHA-512 Online Free",
  description: "Generate SHA-256, SHA-1, SHA-384, and SHA-512 hashes instantly. Real-time hash computation as you type. Free online hash calculator. No data sent to servers.",
  keywords: ["hash generator", "SHA-256 generator", "SHA-1 hash", "SHA-512", "hash calculator", "online hash tool", "checksum generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
