import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator - Generate v4 UUIDs Online",
  description:
    "Free online UUID v4 generator. Generate single or bulk UUIDs instantly. Copy individual or all at once. Toggle hyphens on or off. No signup, runs in your browser.",
  keywords: [
    "UUID generator",
    "generate UUID",
    "UUID v4",
    "bulk UUID generator",
    "random UUID online",
  ],
};

export default function UuidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
