import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Image Prompt Generator - Midjourney, DALL-E, Stable Diffusion",
  description: "Generate detailed prompts for AI image generation. Choose style, mood, lighting. Works with Midjourney, DALL-E, Stable Diffusion. Free prompt generator.",
  keywords: ["AI image prompt", "Midjourney prompt", "DALL-E prompt", "Stable Diffusion prompt", "AI art prompt", "image generation prompt"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
