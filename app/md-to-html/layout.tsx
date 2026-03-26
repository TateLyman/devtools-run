import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown to HTML Converter - Convert MD to HTML Free",
  description: "Convert Markdown to HTML instantly. Supports headings, bold, italic, links, code, lists, tables. Copy HTML output. Free Markdown to HTML converter.",
  keywords: ["markdown to html", "convert markdown", "md to html", "markdown converter", "markdown html", "markdown renderer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
