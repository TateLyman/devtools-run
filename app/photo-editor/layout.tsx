import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Online Photo Editor — Edit Images in Your Browser",
  description: "Edit photos directly in your browser. Adjust brightness, contrast, saturation, blur, sharpen. Crop, rotate, flip. Canvas API powered. No uploads, fully private.",
  keywords: ["photo editor", "online photo editor", "free photo editor", "image editor", "crop image", "rotate image", "brightness contrast editor"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
