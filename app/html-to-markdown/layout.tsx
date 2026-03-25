import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTML to Markdown Converter - Convert HTML to MD Online Free",
  description: "Convert HTML to clean Markdown. Handles headings, bold, italic, links, images, code blocks, lists, blockquotes. Free online HTML to Markdown converter.",
  keywords: ["HTML to Markdown", "convert HTML to MD", "HTML Markdown converter", "HTML to MD online", "Markdown converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
