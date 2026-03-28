import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Image Color Picker — Extract Colors from Any Image",
  description: "Upload any image and click to extract colors. Get HEX, RGB, HSL values instantly. Zoom magnifier, color history, shades, and color harmonies. Free online tool.",
  keywords: ["image color picker", "extract color from image", "color picker online", "pick color from image", "hex from image", "eyedropper tool"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
