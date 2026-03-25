"use client";
import { useState } from "react";

const IDEAS = [
  { title: "Telegram Trading Bot", difficulty: "Hard", stack: "Node.js, Solana, Jupiter API", desc: "Build a bot that trades tokens on Solana via Telegram commands.", link: "/templates", linkText: "Get a template" },
  { title: "URL Shortener", difficulty: "Easy", stack: "Next.js, Redis or KV", desc: "Shorten URLs with click tracking and custom slugs." },
  { title: "Portfolio Website", difficulty: "Easy", stack: "Next.js, Tailwind", desc: "Personal portfolio with projects, about, and contact sections." },
  { title: "Real-time Chat App", difficulty: "Medium", stack: "React, WebSocket, Node.js", desc: "Chat rooms with real-time messages, typing indicators, and emoji." },
  { title: "Expense Tracker", difficulty: "Easy", stack: "React, localStorage", desc: "Track daily expenses with categories and monthly summaries." },
  { title: "Weather Dashboard", difficulty: "Easy", stack: "React, OpenWeather API", desc: "Show current weather and 5-day forecast for any city." },
  { title: "Markdown Blog", difficulty: "Medium", stack: "Next.js, MDX", desc: "Static blog that renders Markdown files as pages." },
  { title: "Token Scanner API", difficulty: "Medium", stack: "Node.js, Solana Web3.js", desc: "API that checks on-chain data and returns a safety score.", link: "/api-access", linkText: "See our API" },
  { title: "Copy Trading Bot", difficulty: "Hard", stack: "Node.js, Solana, Jito", desc: "Mirror another wallet's trades automatically.", link: "/templates", linkText: "Get the code" },
  { title: "Invoice Generator", difficulty: "Easy", stack: "React, PDF.js", desc: "Create professional invoices and export as PDF.", link: "/invoice", linkText: "Try our version" },
  { title: "Browser Extension", difficulty: "Medium", stack: "JavaScript, Chrome API", desc: "New tab page with productivity widgets or dev tools." },
  { title: "Habit Tracker", difficulty: "Easy", stack: "React, localStorage", desc: "Track daily habits with streaks and completion graphs." },
  { title: "AI Chatbot", difficulty: "Medium", stack: "Next.js, Anthropic API", desc: "Chat interface powered by Claude or GPT with context." },
  { title: "Uptime Monitor", difficulty: "Medium", stack: "Node.js, cron, Telegram", desc: "Ping URLs every minute and alert on Telegram when down.", link: "/uptime", linkText: "Try our monitor" },
  { title: "Crypto Portfolio Tracker", difficulty: "Medium", stack: "React, CoinGecko API", desc: "Track crypto holdings with real-time prices and PnL.", link: "/portfolio", linkText: "Try ours" },
  { title: "E-commerce Store", difficulty: "Hard", stack: "Next.js, Stripe/SOL Pay", desc: "Full online store with cart, checkout, and payments.", link: "/sol-pay", linkText: "Use SOL Pay" },
];

export default function ProjectIdeasPage() {
  const [idea, setIdea] = useState(IDEAS[0]);
  const random = () => setIdea(IDEAS[Math.floor(Math.random() * IDEAS.length)]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-2">What Should I Build?</h1>
        <p className="text-gray-400 mb-8">Random project idea generator for developers.</p>
        <div className="bg-gray-900 rounded-2xl p-8 mb-6">
          <div className="flex justify-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded ${idea.difficulty==="Easy"?"bg-green-600/20 text-green-400":idea.difficulty==="Medium"?"bg-yellow-600/20 text-yellow-400":"bg-red-600/20 text-red-400"}`}>{idea.difficulty}</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-2">{idea.title}</h2>
          <p className="text-gray-400 mb-2">{idea.desc}</p>
          <p className="text-xs text-purple-400 mb-4">{idea.stack}</p>
          {idea.link && <a href={idea.link} className="inline-block bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded-lg text-xs font-bold mb-2">{idea.linkText}</a>}
        </div>
        <button onClick={random} className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-bold text-lg">Give Me Another</button>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-2">
          {IDEAS.slice(0, 8).map((i, j) => (
            <button key={j} onClick={() => setIdea(i)} className="bg-gray-900 hover:bg-gray-800 rounded-lg p-3 text-left">
              <div className="font-bold text-xs">{i.title}</div>
              <div className="text-[10px] text-gray-500">{i.difficulty}</div>
            </button>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/cheatsheet/javascript" className="text-purple-400 hover:underline">JS Cheatsheet</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Code Templates</a>{" | "}
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
