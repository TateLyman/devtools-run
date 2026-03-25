import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const length = Math.min(128, Math.max(4, parseInt(searchParams.get("length") || "16")));
  const useSymbols = searchParams.get("symbols") !== "false";

  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  const password = Array.from(array, (n) => chars[n % chars.length]).join("");

  return NextResponse.json({ password, length, symbols: useSymbols }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
