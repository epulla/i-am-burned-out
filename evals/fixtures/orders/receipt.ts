import { formatPrice } from "./money";

export function receipt(lines: { name: string; cents: number }[]): string {
  return lines.map((line) => `${line.name} ${formatPrice(line.cents)}`).join("\n");
}
