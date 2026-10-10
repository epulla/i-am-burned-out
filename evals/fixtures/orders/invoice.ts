import { formatPrice } from "./money";

export function invoiceLine(name: string, cents: number): string {
  return `${name}: ${formatPrice(cents)}`;
}
