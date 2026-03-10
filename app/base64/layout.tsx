import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder - Encode & Decode Base64 Online",
  description:
    "Free online Base64 encoder and decoder. Convert text and files to Base64 or decode Base64 strings. Supports UTF-8. No signup required.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "encode Base64",
    "decode Base64",
    "Base64 online",
  ],
};

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
