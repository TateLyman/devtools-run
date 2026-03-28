import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Converter — Convert JPG/PNG to PDF Free",
  description:
    "Convert multiple images (JPG, PNG, WebP) into a single PDF. Drag to reorder, set page size and margins. Runs entirely in your browser — no files uploaded.",
  keywords: [
    "image to PDF",
    "JPG to PDF",
    "PNG to PDF",
    "convert images to PDF",
    "merge images into PDF",
    "free image to PDF",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
