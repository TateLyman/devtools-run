import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester - Test Regular Expressions Online with Highlighting",
  description:
    "Free online regex tester. Test regular expression patterns against text with real-time match highlighting. Supports global, case-insensitive, multiline, and dotAll flags.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex online",
    "test regex",
    "regex match",
    "regex highlighter",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/regex",
  },
};

export default function RegexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
