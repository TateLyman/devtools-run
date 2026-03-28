import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image Converter — Convert PDF Pages to PNG/JPG Free",
  description:
    "Convert PDF pages to high-quality PNG or JPG images. Adjust quality, download individual pages or all as a ZIP. 100% browser-based, no upload required.",
  keywords: [
    "PDF to image",
    "PDF to PNG",
    "PDF to JPG",
    "convert PDF to image",
    "PDF page to image",
    "free PDF converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
