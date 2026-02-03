import { useParams } from "react-router-dom";
import { useStockDetailQuery } from "@/react-query/queries/stocks";
import StockDetail from "./components/StockDetail";

export default function StockDetailPage() {
  const { stockId } = useParams();
  const { data, isLoading } = useStockDetailQuery(stockId);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">Stock not found.</div>;

  return <StockDetail stock={data} />;
}
