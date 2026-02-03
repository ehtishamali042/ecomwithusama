// No default React import required with the new JSX transform
import type { Stock } from "../types";
import { formatCurrency } from "../utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  stocks?: Stock[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
};

export default function StockTable({
  stocks = [],
  isLoading,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) return <div className="p-4">Loading stocks...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>SKU</th>
            <th>Marketplace</th>
            <th>Status</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.id}>
              <td>
                {s.mainImageUrl ? (
                  <img
                    src={s.mainImageUrl}
                    alt={s.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-base-300 rounded flex items-center justify-center">
                    —
                  </div>
                )}
              </td>
              <td>{s.title}</td>
              <td>{s.sku || "-"}</td>
              <td>{s.marketplace || "-"}</td>
              <td>
                <span
                  className={`badge ${s.stockStatus === "IN_STOCK" ? "badge-success" : "badge-ghost"}`}
                >
                  {s.stockStatus || "-"}
                </span>
              </td>
              <td>{s.quantity ?? "-"}</td>
              <td>{formatCurrency(s.price, s.currency)}</td>
              <td className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`./${s.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete && onDelete(s.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
