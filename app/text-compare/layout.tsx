import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text Compare - Free Online Diff Checker Tool",
  description: "Compare two texts and see differences highlighted. Additions, removals, and unchanged lines. Ignore case and whitespace options. Free online diff tool.",
  keywords: ["text compare", "diff checker", "text diff", "compare text online", "difference checker", "text comparison tool"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
