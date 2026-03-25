import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON Diff - Compare Two JSON Objects & Find Differences",
  description: "Compare two JSON objects and see what changed. Highlights additions, removals, and modifications at every path. Free online JSON diff tool.",
  keywords: ["JSON diff", "compare JSON", "JSON difference", "JSON comparison tool", "diff JSON objects"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
