import { formatPrice } from "./money";

export function cartTotal(items: { cents: number; qty: number }[]): string {
  const cents = items.reduce((sum, item) => sum + item.cents * item.qty, 0);
  return formatPrice(cents);
}
