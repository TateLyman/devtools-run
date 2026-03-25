import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Random Number Generator - Coin Flip, Dice Roll & RNG Online",
  description: "Generate random numbers, flip coins, roll dice. Customizable range, bulk generation, unique numbers, statistics. Free online random number generator.",
  keywords: ["random number generator", "RNG", "coin flip", "dice roller", "random number", "number generator online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
