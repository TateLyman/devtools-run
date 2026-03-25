import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert JSON to CSV Online Free",
  description: "Convert JSON to CSV and CSV to JSON online. Handles nested objects, arrays, numbers, booleans. Download results. Free online JSON CSV converter.",
  keywords: ["JSON to CSV", "CSV to JSON", "JSON converter", "CSV converter", "convert JSON CSV online", "data converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
