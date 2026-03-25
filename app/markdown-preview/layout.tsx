import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown Preview - Live Markdown Editor Online Free",
  description: "Write Markdown and see a live preview side by side. Supports headers, bold, italic, code blocks, lists, links, images, checkboxes. Free online Markdown editor.",
  keywords: ["markdown preview", "markdown editor", "live markdown", "markdown viewer", "online markdown", "markdown to HTML"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
