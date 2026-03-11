import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Convert Timestamps & Dates Online",
  description:
    "Free online Unix timestamp converter. Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds. Live current timestamp.",
  keywords: [
    "Unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "Unix time",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/timestamp",
  },
};

export default function TimestampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
