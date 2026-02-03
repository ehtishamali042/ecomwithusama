// No default React import required with the new JSX transform
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StockFilters from "./components/StockFilters";
import StockTable from "./components/StockTable";
import { useStocksListQuery } from "@/react-query/queries/stocks";
import { useDeleteStockMutation } from "@/react-query/mutations/stocks";
import { useNavigate } from "react-router-dom";
import type { StocksListParams } from "@/api/stocksApi";

export default function StocksListPage() {
  const [filters, setFilters] = useState<StocksListParams>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useStocksListQuery(filters);
  const deleteMut = useDeleteStockMutation();
  const navigate = useNavigate();

  function handleDelete(id: string) {
    if (!confirm("Delete this stock?")) return;
    deleteMut.mutate(id);
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-6 px-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Stocks
          </CardTitle>
          <Button onClick={() => navigate("/dashboard/stocks/new")}>
            Add Stock
          </Button>
        </CardHeader>
        <CardContent>
          <StockFilters
            search={filters.search}
            marketplace={filters.marketplace}
            stockStatus={filters.stockStatus}
            onChange={(next) => setFilters((f) => ({ ...f, ...next, page: 1 }))}
          />
          <StockTable
            stocks={data?.items || []}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
