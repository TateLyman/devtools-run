import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Open Graph Preview - See How URLs Look on Social Media",
  description: "Preview how any URL will look when shared on Facebook, Twitter, LinkedIn. See Open Graph tags and Twitter Cards. Free OG preview tool.",
  keywords: ["Open Graph preview", "OG preview", "social media preview", "Twitter card preview", "link preview", "Facebook preview"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
