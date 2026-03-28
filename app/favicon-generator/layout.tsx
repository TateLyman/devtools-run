import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon Generator — Create Favicons from Any Image Free",
  description:
    "Generate favicons in all required sizes from any image. Creates favicon.ico, apple-touch-icon, android-chrome icons. Download as ZIP. Free online tool.",
  keywords: [
    "favicon generator",
    "create favicon",
    "favicon from image",
    "favicon.ico generator",
    "apple-touch-icon",
    "android-chrome icon",
    "favicon sizes",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
