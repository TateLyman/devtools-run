import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown Table Generator - Create Tables Visually Free",
  description: "Create Markdown tables visually. Add rows, columns, edit cells. Copy Markdown code. Free Markdown table generator for GitHub, README files.",
  keywords: ["markdown table generator", "markdown table", "create markdown table", "github table", "readme table generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
