import { useQuery } from "@tanstack/react-query";
import { getStocks, getStockById } from "../../api/stocksApi";
import type { StocksListParams, StocksListResponse } from "../../api/stocksApi";

export function useStocksListQuery(filters?: StocksListParams) {
  return useQuery<StocksListResponse, Error, StocksListResponse>({
    queryKey: ["stocks", filters || {}],
    queryFn: () => getStocks(filters),
  });
}

export function useStockDetailQuery(stockId?: string) {
  return useQuery({
    queryKey: ["stock", stockId],
    queryFn: () => getStockById(String(stockId)),
    enabled: !!stockId,
  });
}
