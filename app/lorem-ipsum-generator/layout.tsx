import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Free Placeholder Text Online",
  description: "Generate lorem ipsum placeholder text for your designs. Paragraphs, sentences, or words. Free online lorem ipsum generator with copy button.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "lorem ipsum", "filler text generator", "lipsum"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
