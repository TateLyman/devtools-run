import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Public APIs for Developers - No Auth, CORS Enabled",
  description: "Free public APIs for developers. Random quotes, jokes, passwords, placeholder images. No authentication, CORS enabled, no rate limits. Perfect for demos and hackathons.",
  keywords: ["free API", "public API", "no auth API", "free REST API", "developer API", "random quote API", "joke API"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
