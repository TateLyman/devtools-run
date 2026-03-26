import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown Editor with Live Preview - Write & Preview Free",
  description: "Write Markdown with live preview side by side. Supports headings, bold, italic, links, code, lists, tables. Free online Markdown editor.",
  keywords: ["markdown editor", "markdown preview", "live markdown", "markdown writer", "online markdown editor", "markdown renderer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
