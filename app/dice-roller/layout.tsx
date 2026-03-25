import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dice Roller - Roll Dice Online | D4 D6 D8 D10 D12 D20 D100",
  description: "Roll dice online. D4, D6, D8, D10, D12, D20, D100. Multiple dice at once. History and totals. Free virtual dice roller for D&D, board games, decisions.",
  keywords: ["dice roller", "roll dice online", "virtual dice", "D20 roller", "D&D dice", "random dice roll", "online dice"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
