import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Image Cropper - Crop Images Online Free with Aspect Ratios",
  description: "Crop images online with custom dimensions and aspect ratios (1:1, 16:9, 4:3). Download as PNG. No upload to server. Free image cropper.",
  keywords: ["image cropper", "crop image online", "photo cropper", "crop photo free", "image crop tool", "online image cropper"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
