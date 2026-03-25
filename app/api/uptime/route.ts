import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  const target = url.startsWith("http") ? url : `https://${url}`;
  const start = Date.now();

  try {
    const res = await fetch(target, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    const latency = Date.now() - start;
    return NextResponse.json({
      url: target,
      status: "up",
      statusCode: res.status,
      latency,
      timestamp: new Date().toISOString(),
    }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (e: any) {
    const latency = Date.now() - start;
    return NextResponse.json({
      url: target,
      status: "down",
      error: e.message?.slice(0, 100),
      latency,
      timestamp: new Date().toISOString(),
    }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
