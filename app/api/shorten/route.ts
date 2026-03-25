import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const LINKS: Record<string, string> = {};

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const id = crypto.randomBytes(3).toString("hex");
  LINKS[id] = url;
  const short = `${req.nextUrl.origin}/go/${id}`;
  return NextResponse.json({ short, id, original: url }, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id && LINKS[id]) return NextResponse.json({ url: LINKS[id] });
  return NextResponse.json({ error: "not found" }, { status: 404 });
}
