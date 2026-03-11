import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Wallet Checker",
  description:
    "Check any Solana wallet balance, SOL holdings, and recent transactions. Free, fast, no signup required.",
  keywords: [
    "solana wallet checker",
    "sol balance checker",
    "solana wallet lookup",
    "check sol balance",
    "solana address lookup",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
