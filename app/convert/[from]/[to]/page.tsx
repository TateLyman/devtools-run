import Converter from "./converter";
import { ALL_CONVERSIONS } from "./conversions";

export function generateStaticParams() {
  return ALL_CONVERSIONS.map((c) => ({ from: c.from, to: c.to }));
}

type Props = {
  params: Promise<{ from: string; to: string }>;
};

export default async function ConvertPage({ params }: Props) {
  const { from, to } = await params;
  return <Converter from={from} to={to} />;
}
