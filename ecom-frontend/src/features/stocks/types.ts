export type Stock = {
  id: string;
  title: string;
  description?: string;
  sku?: string;
  marketplace?: string[];
  stockStatus?: string;
  quantity?: number;
  price?: number;
  currency?: string;
  sizeLabel?: string;
  colorLabel?: string;
  tags?: string[];
  mainImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type StocksListResponse = {
  items: Stock[];
  total: number;
  page: number;
  limit: number;
};

export type StockPayload = {
  title: string;
  description?: string;
  sku?: string;
  marketplace?: string[];
  onlineMarketplaceUrl?: string;
  stockStatus?: string;
  quantity?: number;
  price?: number;
  currency?: string;
  sizeLabel?: string;
  colorLabel?: string;
  tags?: string[];
  mainImageUrl?: string;
  mainImagePath?: string;
};

export type StockFormValues = Omit<StockPayload, "tags" | "marketplace"> & {
  id?: string;
  mainImageFile?: File;
  tags?: string | string[];
  // form uses a single-select for marketplace (string), convert to array before sending
  marketplace?: string;
};
