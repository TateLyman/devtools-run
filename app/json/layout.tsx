import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Format, Minify, Validate JSON Online",
  description:
    "Free online JSON formatter, validator, and minifier. Paste your JSON to pretty-print, minify, or check for errors instantly. No signup, runs in your browser.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON minifier",
    "format JSON online",
    "pretty print JSON",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/json",
  },
};

export default function JsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
