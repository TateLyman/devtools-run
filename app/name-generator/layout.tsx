import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Random Name Generator - Male, Female, Fantasy Names Free",
  description: "Generate random names. Male, female, unisex, or fantasy. Perfect for writing, games, testing, D&D characters. Generate up to 50 names. Free name generator.",
  keywords: ["name generator", "random name generator", "fantasy name generator", "character name generator", "fake name generator", "D&D name generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
