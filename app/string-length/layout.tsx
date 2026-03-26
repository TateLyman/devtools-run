import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "String Length Calculator - Count Characters, Words, Lines Free",
  description: "Count string length, characters, words, lines, sentences, paragraphs. With and without spaces. Free string length calculator.",
  keywords: ["string length", "character count", "word count", "line count", "text length", "string calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
