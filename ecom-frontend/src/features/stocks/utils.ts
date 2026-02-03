import type { Stock } from "./types";

export function formatCurrency(amount?: number, currency = "GBP") {
  if (amount == null) return "-";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount);
  } catch (e) {
    console.log("e", e);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function mapApiStockToStock(s: Partial<Stock>): Stock {
  return {
    id: String(s.id ?? ""),
    title: String(s.title ?? ""),
    description: s.description,
    sku: s.sku,
    marketplace: s.marketplace,
    stockStatus: s.stockStatus,
    quantity: s.quantity,
    price: s.price,
    currency: s.currency,
    sizeLabel: s.sizeLabel,
    colorLabel: s.colorLabel,
    tags: s.tags,
    mainImageUrl: s.mainImageUrl,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}
