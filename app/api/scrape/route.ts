import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing ?url= parameter" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const start = Date.now();

  try {
    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "DevTools.run Scraper/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    const html = await res.text();
    const elapsed = Date.now() - start;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || "";

    // Extract meta tags
    const getMeta = (name: string): string => {
      const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`, "i"));
      return match?.[1] || "";
    };

    // Extract links
    const linkMatches = html.matchAll(/<a[^>]*href=["']([^"'#][^"']*)["']/gi);
    const links = [...linkMatches].map((m) => m[1]).filter((l) => l.startsWith("http")).slice(0, 100);

    // Extract images
    const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["']/gi);
    const images = [...imgMatches].map((m) => m[1]).filter((s) => s.startsWith("http")).slice(0, 50);

    // Extract headings
    const h1s = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)].map((m) => m[1].trim());
    const h2s = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)].map((m) => m[1].trim());

    // Extract text (strip HTML)
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    const wordCount = textContent.split(/\s+/).length;

    return NextResponse.json({
      url: targetUrl,
      title,
      description: getMeta("description"),
      text: textContent,
      links,
      images,
      meta: {
        "og:title": getMeta("og:title"),
        "og:description": getMeta("og:description"),
        "og:image": getMeta("og:image"),
        "og:type": getMeta("og:type"),
        "twitter:card": getMeta("twitter:card"),
      },
      headings: { h1: h1s, h2: h2s.slice(0, 20) },
      wordCount,
      responseTime: elapsed,
      statusCode: res.status,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch URL" }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
