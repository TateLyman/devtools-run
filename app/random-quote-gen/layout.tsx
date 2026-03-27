import type { Metadata } from "next";
export const metadata: Metadata = { title: "Random Quote Generator - Inspirational Quotes Free", description: "Get random inspirational quotes. Copy and share. New quote on click. Free random quote generator.", keywords: ["random quote", "inspirational quotes", "quote generator", "daily quote", "motivational quotes"] };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
