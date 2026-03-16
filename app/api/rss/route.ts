import { NextResponse } from 'next/server';

const HASHNODE_GQL = 'https://gql.hashnode.com';
const PUBLICATION_HOST = 'tatelyman.hashnode.dev';

interface Post {
  title: string;
  brief: string;
  slug: string;
  url: string;
  publishedAt: string;
  content?: { html: string };
}

async function fetchPosts(): Promise<Post[]> {
  const query = `
    query {
      publication(host: "${PUBLICATION_HOST}") {
        posts(first: 20) {
          edges {
            node {
              title
              brief
              slug
              url
              publishedAt
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(HASHNODE_GQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data?.data?.publication?.posts?.edges?.map((e: { node: Post }) => e.node) || [];
  } catch {
    return [];
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await fetchPosts();

  const items = posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(p.url)}</link>
      <description>${escapeXml(p.brief || '')}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <guid>${escapeXml(p.url)}</guid>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tate Lyman — Solana Dev</title>
    <link>https://devtools-site-delta.vercel.app</link>
    <description>Building on Solana. Open source tools, trading bots, DeFi strategies.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://devtools-site-delta.vercel.app/api/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
