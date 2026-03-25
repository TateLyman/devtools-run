import { NextRequest, NextResponse } from "next/server";

const QUOTES = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "The most disastrous thing that you can ever learn is your first programming language.",
  "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable, one must always be different.",
  "Java is to JavaScript what car is to carpet.",
  "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
];

const FACTS = [
  "The first computer bug was an actual bug — a moth found in a Harvard Mark II computer in 1947.",
  "The first website ever created is still online: info.cern.ch",
  "There are approximately 700 programming languages in existence.",
  "The average developer writes about 10-20 lines of code per day that actually ship.",
  "Git was created by Linus Torvalds in just 10 days.",
  "The first computer programmer was Ada Lovelace in the 1840s.",
  "About 70% of all code in production was written in the last 5 years.",
  "The Solana blockchain can process 65,000 transactions per second.",
  "Bitcoin's whitepaper is only 9 pages long.",
  "Ethereum was proposed by Vitalik Buterin when he was 19 years old.",
];

const COLORS = [
  { hex: "#6c5ce7", name: "Purple Heart" },
  { hex: "#00d68f", name: "Emerald" },
  { hex: "#ff4757", name: "Watermelon" },
  { hex: "#ffa502", name: "Orange" },
  { hex: "#2ed573", name: "Lime" },
  { hex: "#1e90ff", name: "Dodger Blue" },
  { hex: "#ff6b81", name: "Wild Watermelon" },
  { hex: "#7bed9f", name: "Light Green" },
  { hex: "#70a1ff", name: "Cornflower" },
  { hex: "#eccc68", name: "Cream Can" },
];

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "quote";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "X-Powered-By": "devtools-site-delta.vercel.app",
  };

  if (type === "quote") {
    return NextResponse.json({ quote: QUOTES[Math.floor(Math.random() * QUOTES.length)] }, { headers });
  }
  if (type === "fact") {
    return NextResponse.json({ fact: FACTS[Math.floor(Math.random() * FACTS.length)] }, { headers });
  }
  if (type === "color") {
    return NextResponse.json(COLORS[Math.floor(Math.random() * COLORS.length)], { headers });
  }
  if (type === "number") {
    const min = parseInt(req.nextUrl.searchParams.get("min") || "1");
    const max = parseInt(req.nextUrl.searchParams.get("max") || "100");
    return NextResponse.json({ number: Math.floor(Math.random() * (max - min + 1)) + min }, { headers });
  }
  if (type === "uuid") {
    const uuid = crypto.randomUUID();
    return NextResponse.json({ uuid }, { headers });
  }

  return NextResponse.json({
    types: ["quote", "fact", "color", "number", "uuid"],
    usage: "GET /api/random?type=quote",
    docs: "https://devtools-site-delta.vercel.app/api-docs",
  }, { headers });
}
