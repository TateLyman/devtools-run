import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Roman Numeral Converter - Numbers to Roman Numerals & Back",
  description: "Convert numbers to Roman numerals and Roman numerals to numbers instantly. Supports 1-3999. Free Roman numeral converter & calculator.",
  keywords: ["roman numeral converter", "roman numerals", "number to roman", "roman to number", "roman numeral calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
