import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Daily Developer Quote - Programming Quotes & Inspiration",
  description: "A curated developer quote every day. 30 quotes from Linus Torvalds, Steve Jobs, Martin Fowler, and more. Filter by category. Free daily programming quotes.",
  keywords: ["developer quotes", "programming quotes", "daily quote", "coding quotes", "tech quotes", "inspirational developer quotes"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
