import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Emoji Picker - Browse & Copy 100+ Emojis Free Online",
  description: "Browse and copy emojis organized by category. Smileys, gestures, animals, food, objects, nature, symbols. Click to copy. Free emoji picker.",
  keywords: ["emoji picker", "copy emoji", "emoji keyboard", "emoji list", "emoji copy paste", "emoji finder"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
