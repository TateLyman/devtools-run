import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Number to Words Converter - Convert Numbers to English Words",
  description: "Convert numbers to English words. Supports up to trillions. Perfect for checks, legal documents, invoices. Free number to words converter.",
  keywords: ["number to words", "number to text", "convert number to words", "spell out number", "number in words", "check writing"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
