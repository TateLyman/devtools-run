import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text Diff Checker - Compare Two Texts Online Free",
  description: "Compare two texts side by side. See additions, deletions, and changes highlighted. Free online text diff and comparison tool.",
  keywords: ["text diff", "compare text", "diff checker", "text comparison", "find differences", "online diff tool"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
