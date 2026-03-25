import { Metadata } from "next";
import ConvertClient from "./client";

const CATEGORIES: Record<string, { units: Record<string, number>; special?: boolean }> = {
  length: { units: { meters:1, feet:0.3048, inches:0.0254, centimeters:0.01, millimeters:0.001, kilometers:1000, miles:1609.344, yards:0.9144 }},
  weight: { units: { kilograms:1, pounds:0.453592, ounces:0.0283495, grams:0.001, milligrams:0.000001, tons:1000, stones:6.35029 }},
  temperature: { units: { celsius:1, fahrenheit:1, kelvin:1 }, special: true },
  speed: { units: { mph:0.44704, kph:0.277778, knots:0.514444, "meters-per-second":1 }},
  area: { units: { "square-meters":1, "square-feet":0.092903, acres:4046.86, hectares:10000, "square-miles":2589988 }},
  volume: { units: { liters:1, gallons:3.78541, cups:0.236588, milliliters:0.001, "fluid-ounces":0.0295735, pints:0.473176, quarts:0.946353 }},
  data: { units: { bytes:1, kilobytes:1024, megabytes:1048576, gigabytes:1073741824, terabytes:1099511627776 }},
  time: { units: { seconds:1, minutes:60, hours:3600, days:86400, weeks:604800, years:31557600, milliseconds:0.001 }},
  pressure: { units: { pascal:1, bar:100000, psi:6894.76, atm:101325 }},
  energy: { units: { joules:1, calories:4.184, kilocalories:4184, "watt-hours":3600, "kilowatt-hours":3600000, btu:1055.06 }},
  // Code/data format conversions
  code: { units: { json:1, yaml:1, csv:1, xml:1, typescript:1, base64:1, "url-encoded":1, binary:1, decimal:1, hexadecimal:1, octal:1, markdown:1, html:1 }, special: true },
  // Crypto conversions
  crypto: { units: { sol:1, usd:1, btc:1, eth:1, usdc:1, usdt:1 }, special: true },
  // CSS conversions
  css: { units: { px:1, rem:1, em:1, vw:1, vh:1, percent:1, pt:1 }, special: true },
};

function getAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const [, cat] of Object.entries(CATEGORIES)) {
    const units = Object.keys(cat.units);
    for (const from of units) {
      for (const to of units) {
        if (from !== to) slugs.push(`${from}-to-${to}`);
      }
    }
  }
  return slugs;
}

function findConversion(slug: string): { from: string; to: string; category: string } | null {
  const match = slug.match(/^(.+)-to-(.+)$/);
  if (!match) return null;
  const [, from, to] = match;
  for (const [catName, cat] of Object.entries(CATEGORIES)) {
    if (from in cat.units && to in cat.units) {
      return { from, to, category: catName };
    }
  }
  return null;
}

function pretty(s: string): string {
  return s.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const conv = findConversion(params.slug);
  if (!conv) return { title: "Converter" };
  const from = pretty(conv.from);
  const to = pretty(conv.to);
  return {
    title: `${from} to ${to} Converter — Free Online Tool`,
    description: `Convert ${from} to ${to} instantly. Free online converter with formula. No signup required. Part of 500+ developer tools.`,
    openGraph: { title: `${from} to ${to} Converter`, description: `Free ${from} to ${to} converter online.` },
  };
}

export default function ConvertPage({ params }: { params: { slug: string } }) {
  const conv = findConversion(params.slug);
  const allSlugs = getAllSlugs();
  if (!conv) return <div>Not found</div>;
  return <ConvertClient
    from={conv.from} to={conv.to} category={conv.category} slug={params.slug}
    allSlugs={allSlugs} categories={CATEGORIES}
  />;
}
