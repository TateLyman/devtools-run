import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const len = Math.min(128, Math.max(8, parseInt(req.nextUrl.searchParams.get("length") || "16")));
  const upper = req.nextUrl.searchParams.get("upper") !== "false";
  const lower = req.nextUrl.searchParams.get("lower") !== "false";
  const numbers = req.nextUrl.searchParams.get("numbers") !== "false";
  const symbols = req.nextUrl.searchParams.get("symbols") !== "false";

  let chars = "";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  const password = Array.from(bytes, b => chars[b % chars.length]).join("");

  return NextResponse.json({ password, length: len }, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
}
