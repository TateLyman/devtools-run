import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Palette Generator - Create Harmonious Color Schemes",
  description: "Generate beautiful color palettes using color theory. Analogous, complementary, triadic, and more. Export as CSS variables or Tailwind config. Free online tool.",
  keywords: ["color palette generator", "color scheme generator", "color harmony", "CSS colors", "Tailwind colors", "complementary colors", "color picker"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
