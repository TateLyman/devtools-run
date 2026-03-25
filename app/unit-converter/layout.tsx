import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Unit Converter - Convert Length, Weight, Temperature & More",
  description: "Convert between units of length, weight, temperature, area, volume, speed, data storage, and time. Free online unit converter with instant results.",
  keywords: ["unit converter", "convert units", "length converter", "weight converter", "temperature converter", "metric converter", "imperial converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
