import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Character Counter - Count Characters, Words & Sentences Online",
  description: "Count characters, words, sentences, paragraphs, and lines in real-time. Reading time estimate, word frequency analysis. Free online character counter.",
  keywords: ["character counter", "word counter", "letter counter", "character count", "word count tool", "text counter online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
