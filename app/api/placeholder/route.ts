import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const w = parseInt(req.nextUrl.searchParams.get("w") || "300");
  const h = parseInt(req.nextUrl.searchParams.get("h") || "200");
  const bg = req.nextUrl.searchParams.get("bg") || "333";
  const fg = req.nextUrl.searchParams.get("fg") || "aaa";
  const text = req.nextUrl.searchParams.get("text") || `${w}x${h}`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#${bg}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.min(w,h)/6}" fill="#${fg}" text-anchor="middle" dominant-baseline="central">${text}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
