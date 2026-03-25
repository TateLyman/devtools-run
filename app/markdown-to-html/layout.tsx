import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown to HTML Converter - Convert MD to HTML Online Free",
  description: "Convert Markdown to HTML instantly. Supports headings, bold, italic, links, images, code blocks, lists. Live preview. Free online Markdown to HTML converter.",
  keywords: ["Markdown to HTML", "convert Markdown", "MD to HTML", "Markdown converter", "Markdown to HTML online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
