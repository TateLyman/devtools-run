import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Permissions Calculator - chmod Calculator Online",
  description:
    "Free online Unix file permissions calculator. Toggle read, write, and execute for owner, group, and other. See numeric (755) and symbolic (rwxr-xr-x) notation in real-time.",
  keywords: [
    "chmod calculator",
    "Unix permissions",
    "file permissions calculator",
    "chmod 755",
    "symbolic permissions",
  ],
};

export default function ChmodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
