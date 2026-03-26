import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Harmony Generator - Complementary, Analogous, Triadic Free",
  description: "Generate color harmonies from any color. Complementary, analogous, triadic, split-complementary, tetradic. Free color palette generator.",
  keywords: ["color harmony", "complementary colors", "analogous colors", "triadic colors", "color palette generator", "color scheme"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
