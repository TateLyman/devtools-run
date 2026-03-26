import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Random Image Gallery - Beautiful Stock Photos Free",
  description: "Browse random beautiful photos from Lorem Picsum. Click to download. Perfect for design mockups. Free random image gallery.",
  keywords: ["random images", "stock photos free", "placeholder photos", "lorem picsum", "random photo gallery"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
