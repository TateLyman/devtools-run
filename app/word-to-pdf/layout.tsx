import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text to PDF Converter - Convert Text to PDF Online Free",
  description: "Convert text to PDF online. Paste text, set title and font size, save as PDF. No upload, no server. Uses browser print-to-PDF. Free text to PDF converter.",
  keywords: ["text to PDF", "convert to PDF", "PDF converter", "word to PDF", "free PDF maker", "save as PDF online", "text to PDF converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
