import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSV Viewer - View & Edit CSV Files Online Free",
  description: "View CSV files as formatted tables. Upload or paste CSV data. Sort columns. Free online CSV viewer and editor.",
  keywords: ["CSV viewer", "view CSV", "CSV table", "CSV editor", "CSV online", "open CSV file"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
