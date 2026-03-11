import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter - Convert HEX, RGB, HSL Colors Online",
  description:
    "Free online color converter. Convert between HEX, RGB, and HSL color formats with a live preview swatch. Copy CSS color values instantly.",
  keywords: [
    "color converter",
    "HEX to RGB",
    "RGB to HSL",
    "HSL to HEX",
    "color picker",
    "CSS color",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/color",
  },
};

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
