import fetcher from "./fetcher";

export interface StocksListParams {
  page?: number;
  limit?: number;
  search?: string;
  marketplace?: string;
  stockStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StockPayload {
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
  mainImagePath?: string;
}

export interface Stock {
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
}

export interface StocksListResponse {
  items: Stock[];
  total: number;
  page: number;
  limit: number;
}

function normalizeStocksListParams(
  params?: StocksListParams,
): Record<string, unknown> {
  if (!params) return {};
  const out: Record<string, unknown> = { ...params };
  // Remove empty search
  if (!out.search) delete out.search;
  // Remove empty or default marketplace
  if (!out.marketplace || out.marketplace === "") {
    delete out.marketplace;
  }
  // Remove empty or default stockStatus
  if (!out.stockStatus || out.stockStatus === "") {
    delete out.stockStatus;
  }
  return out;
}

function buildQuery(params?: Record<string, unknown> | StocksListParams) {
  if (!params) return "";
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((item) => qp.append(k, String(item)));
    } else {
      qp.append(k, String(v));
    }
  });
  const s = qp.toString();
  return s ? `?${s}` : "";
}

export const getStocks = async (params?: StocksListParams) => {
  // Normalize filters for backend
  const normalized = normalizeStocksListParams(params);
  // Backend returns { data: Stock[], meta: { total, page, limit, totalPages } }
  type BackendStocksResponse = {
    data: Stock[];
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  };
  const res = await fetcher.get<BackendStocksResponse>(
    `/stocks${buildQuery(normalized)}`,
  );
  const items: Stock[] = res.data || [];
  const meta = res.meta || {};
  const total = meta.total ?? items.length;
  const page = meta.page ?? params?.page ?? 1;
  const limit = meta.limit ?? params?.limit ?? items.length;

  return {
    items,
    total,
    page,
    limit,
  } as StocksListResponse;
};

export const getStockById = (id: string) => fetcher.get<Stock>(`/stocks/${id}`);

export const createStock = (payload: StockPayload) =>
  fetcher.post<Stock>("/stocks", payload);

export const updateStock = (id: string, payload: Partial<StockPayload>) =>
  fetcher.patch<Stock>(`/stocks/${id}`, payload);

export const deleteStock = (id: string) =>
  fetcher.delete<void>(`/stocks/${id}`);

export default {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};
