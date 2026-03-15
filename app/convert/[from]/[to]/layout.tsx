import type { Metadata } from "next";

const CONVERSIONS: Record<string, Record<string, { label: string; desc: string; keywords: string[] }>> = {
  json: {
    yaml: {
      label: "JSON to YAML",
      desc: "Convert JSON to YAML online. Paste your JSON and get clean YAML output instantly. Free, fast, no signup.",
      keywords: ["JSON to YAML", "convert JSON YAML", "JSON YAML converter", "JSON to YAML online"],
    },
    csv: {
      label: "JSON to CSV",
      desc: "Convert JSON arrays to CSV format online. Handles nested objects and arrays. Free, no signup required.",
      keywords: ["JSON to CSV", "convert JSON CSV", "JSON CSV converter", "JSON to CSV online"],
    },
  },
  yaml: {
    json: {
      label: "YAML to JSON",
      desc: "Convert YAML to JSON online. Paste YAML and get formatted JSON output. Free, fast, no signup.",
      keywords: ["YAML to JSON", "convert YAML JSON", "YAML JSON converter", "YAML to JSON online"],
    },
  },
  hex: {
    rgb: {
      label: "HEX to RGB",
      desc: "Convert HEX color codes to RGB values instantly. Supports shorthand (#fff) and full (#ffffff) hex colors.",
      keywords: ["HEX to RGB", "hex color to RGB", "color converter", "hex RGB converter"],
    },
    decimal: {
      label: "HEX to Decimal",
      desc: "Convert hexadecimal numbers to decimal. Supports any hex value. Free online tool, no signup.",
      keywords: ["hex to decimal", "hexadecimal to decimal", "hex converter", "hex decimal converter"],
    },
  },
  rgb: {
    hex: {
      label: "RGB to HEX",
      desc: "Convert RGB color values to HEX color codes. Enter R, G, B values and get the hex code instantly.",
      keywords: ["RGB to HEX", "RGB color to hex", "color converter", "RGB hex converter"],
    },
  },
  decimal: {
    hex: {
      label: "Decimal to HEX",
      desc: "Convert decimal numbers to hexadecimal. Supports any integer value. Free online converter.",
      keywords: ["decimal to hex", "decimal to hexadecimal", "number converter", "decimal hex converter"],
    },
    binary: {
      label: "Decimal to Binary",
      desc: "Convert decimal numbers to binary. Supports any integer value. Free online converter, no signup.",
      keywords: ["decimal to binary", "number to binary", "binary converter", "decimal binary converter"],
    },
  },
  binary: {
    decimal: {
      label: "Binary to Decimal",
      desc: "Convert binary numbers to decimal. Supports any binary string (0s and 1s). Free online tool.",
      keywords: ["binary to decimal", "binary converter", "binary number converter", "binary to decimal online"],
    },
  },
  celsius: {
    fahrenheit: {
      label: "Celsius to Fahrenheit",
      desc: "Convert Celsius to Fahrenheit instantly. Simple, accurate temperature conversion. Free online tool.",
      keywords: ["Celsius to Fahrenheit", "C to F", "temperature converter", "celsius fahrenheit converter"],
    },
  },
  fahrenheit: {
    celsius: {
      label: "Fahrenheit to Celsius",
      desc: "Convert Fahrenheit to Celsius instantly. Simple, accurate temperature conversion. Free online tool.",
      keywords: ["Fahrenheit to Celsius", "F to C", "temperature converter", "fahrenheit celsius converter"],
    },
  },
  km: {
    miles: {
      label: "Kilometers to Miles",
      desc: "Convert kilometers to miles instantly. Accurate distance conversion with formula shown. Free online tool.",
      keywords: ["km to miles", "kilometers to miles", "distance converter", "km miles converter"],
    },
  },
  miles: {
    km: {
      label: "Miles to Kilometers",
      desc: "Convert miles to kilometers instantly. Accurate distance conversion with formula shown. Free online tool.",
      keywords: ["miles to km", "miles to kilometers", "distance converter", "miles km converter"],
    },
  },
  kg: {
    lbs: {
      label: "Kilograms to Pounds",
      desc: "Convert kilograms to pounds instantly. Accurate weight conversion with formula shown. Free online tool.",
      keywords: ["kg to lbs", "kilograms to pounds", "weight converter", "kg pounds converter"],
    },
  },
  lbs: {
    kg: {
      label: "Pounds to Kilograms",
      desc: "Convert pounds to kilograms instantly. Accurate weight conversion with formula shown. Free online tool.",
      keywords: ["lbs to kg", "pounds to kilograms", "weight converter", "pounds kg converter"],
    },
  },
  px: {
    rem: {
      label: "PX to REM",
      desc: "Convert pixels to rem units for CSS. Configurable base font size. Free online tool for web developers.",
      keywords: ["px to rem", "pixels to rem", "CSS converter", "px rem converter", "CSS units"],
    },
  },
  rem: {
    px: {
      label: "REM to PX",
      desc: "Convert rem units to pixels for CSS. Configurable base font size. Free online tool for web developers.",
      keywords: ["rem to px", "rem to pixels", "CSS converter", "rem px converter", "CSS units"],
    },
  },
  unix: {
    date: {
      label: "Unix Timestamp to Date",
      desc: "Convert Unix timestamps to human-readable dates. Supports seconds and milliseconds. Free online tool.",
      keywords: ["unix to date", "timestamp converter", "epoch converter", "unix timestamp to date"],
    },
  },
  date: {
    unix: {
      label: "Date to Unix Timestamp",
      desc: "Convert dates to Unix timestamps. Get seconds or milliseconds since epoch. Free online tool.",
      keywords: ["date to unix", "date to timestamp", "epoch converter", "date to unix timestamp"],
    },
  },
  base64: {
    text: {
      label: "Base64 to Text",
      desc: "Decode Base64 strings to plain text. Supports UTF-8. Free online decoder, no signup required.",
      keywords: ["base64 to text", "decode base64", "base64 decoder", "base64 to string"],
    },
  },
  text: {
    base64: {
      label: "Text to Base64",
      desc: "Encode text to Base64. Supports UTF-8 characters. Free online encoder, no signup required.",
      keywords: ["text to base64", "encode base64", "base64 encoder", "string to base64"],
    },
  },
  md: {
    html: {
      label: "Markdown to HTML",
      desc: "Convert Markdown to HTML online. Supports headings, lists, code blocks, links, and more. Free tool.",
      keywords: ["markdown to HTML", "md to HTML", "markdown converter", "markdown HTML converter"],
    },
  },
  csv: {
    json: {
      label: "CSV to JSON",
      desc: "Convert CSV data to JSON format online. Handles headers, quoted fields, and special characters. Free tool.",
      keywords: ["CSV to JSON", "convert CSV JSON", "CSV JSON converter", "CSV to JSON online"],
    },
  },
};

type Props = {
  params: Promise<{ from: string; to: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { from, to } = await params;
  const info = CONVERSIONS[from]?.[to];

  if (!info) {
    return {
      title: `Convert ${from.toUpperCase()} to ${to.toUpperCase()} — Free Online Tool`,
      description: `Convert ${from} to ${to} online. Free, fast, no signup required.`,
    };
  }

  return {
    title: `${info.label} — Free Online Tool`,
    description: info.desc,
    keywords: info.keywords,
    alternates: {
      canonical: `https://devtools-site-delta.vercel.app/convert/${from}/${to}`,
    },
  };
}

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
