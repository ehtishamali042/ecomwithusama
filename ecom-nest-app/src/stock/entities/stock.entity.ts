// Marketplace is now a string array (text[] in DB)
export type MarketplaceType = string[];
export type StockStatusType =
  | "DRAFT"
  | "IN_STOCK"
  | "OUT_OF_STOCK"
  | "DISCONTINUED"
  | "ARCHIVED";

export interface Stock {
  id: string;
  userId: string;
  supplierId?: string;

  // Core product data
  title: string;
  description?: string;
  sku?: string;
  marketplace?: string[];
  onlineMarketplaceUrl?: string;

  // Variation labels
  sizeLabel?: string;
  colorLabel?: string;

  // Stock status & quantity
  stockStatus: StockStatusType;
  quantity: number;

  // Pricing
  price: number;
  currency: string;

  // Images
  mainImagePath?: string;
  mainImageUrl?: string;

  // Metadata
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
