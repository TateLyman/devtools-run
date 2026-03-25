import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GitHub Profile Viewer - Analyze Any GitHub User",
  description: "Look up any GitHub user profile. See repos, stars, forks, languages, followers, and activity. Free GitHub profile analyzer and viewer.",
  keywords: ["GitHub profile viewer", "GitHub user lookup", "GitHub stats", "GitHub analyzer", "GitHub profile search"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
