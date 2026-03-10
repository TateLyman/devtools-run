import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Online",
  description:
    "Free online QR code generator. Enter any text or URL to generate a QR code instantly. Download as PNG with adjustable size. No signup, runs in your browser.",
  keywords: [
    "QR code generator",
    "create QR code",
    "QR code from URL",
    "QR code PNG download",
    "free QR code maker",
  ],
};

export default function QrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
