import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Code Review Tool - Find Bugs, Security Issues & Code Quality Score",
  description:
    "Free online code review tool. Instantly find bugs, security vulnerabilities, performance issues, and get a code quality score. Supports JavaScript, TypeScript, Python, and more. No signup required.",
  keywords: [
    "free code review tool",
    "code review online",
    "code quality checker",
    "find bugs in code",
    "code security scanner",
    "code analysis tool",
    "static code analysis",
    "code quality score",
    "javascript code review",
    "find security vulnerabilities",
    "code linter online",
    "code smell detector",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/code-review",
  },
  openGraph: {
    title: "Free Code Review Tool - Find Bugs & Security Issues Instantly",
    description:
      "Paste your code and get instant feedback: bugs, security vulnerabilities, performance suggestions, and a quality score. 100% free, runs in your browser.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Code Review Tool - Find Bugs & Security Issues Instantly",
    description:
      "Paste your code and get instant feedback: bugs, security vulnerabilities, performance suggestions, and a quality score. 100% free, runs in your browser.",
  },
};

export default function CodeReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
