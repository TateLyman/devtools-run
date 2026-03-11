import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter - Convert YAML and JSON Online",
  description:
    "Free online YAML to JSON and JSON to YAML converter. Two-way conversion with a built-in YAML parser. No signup, runs in your browser.",
  keywords: [
    "YAML to JSON",
    "JSON to YAML",
    "YAML converter",
    "YAML parser",
    "convert YAML online",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/yaml-json",
  },
};

export default function YamlJsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
