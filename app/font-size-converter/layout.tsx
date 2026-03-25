import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Font Size Converter - PX to REM to EM to PT Online Free",
  description: "Convert between px, rem, em, pt, vw, vh, and percent font sizes. Adjustable base size, live preview. Free online font size converter.",
  keywords: ["font size converter", "px to rem", "rem to px", "em to px", "CSS font size", "pt to px converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
