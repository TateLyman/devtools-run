import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Engineering Pack — 50+ Professional Prompt Templates",
  description:
    "50+ battle-tested AI prompt templates for coding, business, and creative work. Works with ChatGPT, Claude, Gemini. Chain-of-thought, few-shot learning, role prompting, and more.",
  keywords: [
    "ai prompt templates",
    "prompt engineering",
    "chatgpt prompts",
    "claude prompts",
    "ai prompt pack",
    "professional prompts",
    "coding prompts ai",
    "business prompts ai",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/prompt-pack",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
