import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Epoch to Date & Date to Epoch Free",
  description: "Convert Unix timestamps to human-readable dates and dates to Unix timestamps. Current epoch time. Milliseconds support. Free epoch converter.",
  keywords: ["unix timestamp", "epoch converter", "timestamp to date", "date to timestamp", "unix time", "epoch time"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
