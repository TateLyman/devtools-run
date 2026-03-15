export interface ConversionDef {
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  type: "text" | "number";
  formula?: string;
}

export const ALL_CONVERSIONS: ConversionDef[] = [
  { from: "json", to: "yaml", fromLabel: "JSON", toLabel: "YAML", type: "text" },
  { from: "yaml", to: "json", fromLabel: "YAML", toLabel: "JSON", type: "text" },
  { from: "hex", to: "rgb", fromLabel: "HEX Color", toLabel: "RGB", type: "text" },
  { from: "rgb", to: "hex", fromLabel: "RGB", toLabel: "HEX Color", type: "text" },
  { from: "hex", to: "decimal", fromLabel: "Hexadecimal", toLabel: "Decimal", type: "text" },
  { from: "decimal", to: "hex", fromLabel: "Decimal", toLabel: "Hexadecimal", type: "text" },
  { from: "binary", to: "decimal", fromLabel: "Binary", toLabel: "Decimal", type: "text" },
  { from: "decimal", to: "binary", fromLabel: "Decimal", toLabel: "Binary", type: "text" },
  { from: "celsius", to: "fahrenheit", fromLabel: "Celsius", toLabel: "Fahrenheit", type: "number", formula: "(C x 9/5) + 32" },
  { from: "fahrenheit", to: "celsius", fromLabel: "Fahrenheit", toLabel: "Celsius", type: "number", formula: "(F - 32) x 5/9" },
  { from: "km", to: "miles", fromLabel: "Kilometers", toLabel: "Miles", type: "number", formula: "km x 0.621371" },
  { from: "miles", to: "km", fromLabel: "Miles", toLabel: "Kilometers", type: "number", formula: "miles x 1.60934" },
  { from: "kg", to: "lbs", fromLabel: "Kilograms", toLabel: "Pounds", type: "number", formula: "kg x 2.20462" },
  { from: "lbs", to: "kg", fromLabel: "Pounds", toLabel: "Kilograms", type: "number", formula: "lbs x 0.453592" },
  { from: "px", to: "rem", fromLabel: "Pixels (px)", toLabel: "REM", type: "number", formula: "px / base" },
  { from: "rem", to: "px", fromLabel: "REM", toLabel: "Pixels (px)", type: "number", formula: "rem x base" },
  { from: "unix", to: "date", fromLabel: "Unix Timestamp", toLabel: "Date", type: "text" },
  { from: "date", to: "unix", fromLabel: "Date", toLabel: "Unix Timestamp", type: "text" },
  { from: "base64", to: "text", fromLabel: "Base64", toLabel: "Text", type: "text" },
  { from: "text", to: "base64", fromLabel: "Text", toLabel: "Base64", type: "text" },
  { from: "md", to: "html", fromLabel: "Markdown", toLabel: "HTML", type: "text" },
  { from: "csv", to: "json", fromLabel: "CSV", toLabel: "JSON", type: "text" },
  { from: "json", to: "csv", fromLabel: "JSON", toLabel: "CSV", type: "text" },
];
