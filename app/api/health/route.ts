import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    tools: 240,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  }, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
