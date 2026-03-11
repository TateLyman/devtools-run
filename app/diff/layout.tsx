import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Tool - Compare Text Online",
  description:
    "Free online text diff tool. Compare two pieces of text side by side with line-by-line diff highlighting. Shows added and removed lines. No signup required.",
  keywords: [
    "text diff",
    "compare text",
    "diff tool online",
    "text comparison",
    "line diff",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/diff",
  },
};

export default function DiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
