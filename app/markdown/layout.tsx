import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview - Live Markdown Editor & Renderer Online",
  description:
    "Free online Markdown preview tool. Write Markdown and see rendered HTML in real-time. Supports headings, bold, italic, links, code blocks, lists, and blockquotes. No signup required.",
  keywords: [
    "Markdown preview",
    "Markdown editor",
    "Markdown to HTML",
    "live Markdown renderer",
    "Markdown online",
  ],
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
