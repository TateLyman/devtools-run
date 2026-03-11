import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter - Format SQL Queries Online",
  description:
    "Free online SQL formatter. Paste messy SQL to format with proper indentation and keyword uppercasing. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and ALTER statements.",
  keywords: [
    "SQL formatter",
    "format SQL online",
    "SQL beautifier",
    "SQL pretty print",
    "SQL indentation",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/sql",
  },
};

export default function SqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
