import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
  description:
    "Free online Lorem Ipsum generator. Generate placeholder paragraphs, sentences, or words for your designs and mockups. No signup required.",
  keywords: [
    "Lorem Ipsum generator",
    "placeholder text",
    "dummy text generator",
    "Lorem Ipsum online",
    "generate Lorem Ipsum",
  ],
};

export default function LoremLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
