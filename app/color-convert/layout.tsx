import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Converter - HEX RGB HSL CMYK Converter Free",
  description: "Convert colors between HEX, RGB, HSL, and CMYK formats instantly. Color picker included. Free color format converter.",
  keywords: ["color converter", "hex to rgb", "rgb to hex", "hsl converter", "cmyk converter", "color format converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
