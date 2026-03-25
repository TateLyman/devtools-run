import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GitHub Actions Generator - Create CI/CD Workflows Online",
  description: "Generate GitHub Actions workflow YAML files. Templates for Node.js, Python, Docker, Vercel deploy, linting, releases. Free CI/CD workflow generator.",
  keywords: ["GitHub Actions generator", "CI/CD workflow", "GitHub Actions template", "workflow YAML", "GitHub CI", "actions generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
