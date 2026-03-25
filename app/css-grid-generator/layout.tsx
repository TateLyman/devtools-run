import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSS Grid Generator - Visual Grid Layout Builder",
  description: "Build CSS Grid layouts visually. Adjust columns, rows, gap, and sizes with live preview. Generate and copy CSS + HTML code. Free online tool.",
  keywords: ["CSS grid generator", "CSS grid builder", "grid layout tool", "CSS grid template", "visual CSS grid", "grid layout generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
