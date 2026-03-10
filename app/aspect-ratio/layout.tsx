import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator - Calculate Dimensions Online",
  description:
    "Free online aspect ratio calculator. Enter a width and select an aspect ratio to calculate the height, or enter any two dimensions to find the ratio. Useful for designers and video editors.",
  keywords: [
    "aspect ratio calculator",
    "calculate dimensions",
    "16:9 calculator",
    "video resolution calculator",
    "screen ratio",
  ],
};

export default function AspectRatioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
