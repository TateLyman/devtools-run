import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JWT Decoder - Decode & Inspect JSON Web Tokens Online",
  description: "Decode JSON Web Tokens instantly. See header, payload, claims, expiration status. Free online JWT decoder and inspector. No data sent to servers.",
  keywords: ["JWT decoder", "JWT debugger", "decode JWT", "JSON Web Token", "JWT inspector", "jwt.io alternative", "JWT parser"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
