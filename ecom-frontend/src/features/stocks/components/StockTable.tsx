// No default React import required with the new JSX transform
import type { Stock } from "../types";
import { formatCurrency } from "../utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DeleteStockButton from "./DeleteStockButton";

export interface StockTableProps {
  stocks?: Stock[];
  isLoading?: boolean;
}

export function StockTable({ stocks = [], isLoading }: StockTableProps) {
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
          {stocks.map((s, idx) => (
            <tr
              key={s.id}
              className={idx === stocks.length - 1 ? "[&>td]:!border-b-0" : ""}
            >
              <td>
                <div className="flex items-center justify-center">
                  {s.mainImageUrl ? (
                    <img
                      src={s.mainImageUrl}
                      alt={s.title}
                      className="w-14 h-14 object-cover rounded-lg border border-base-300 shadow-sm transition-transform duration-200 hover:scale-105 bg-white"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-base-200 rounded-lg flex items-center justify-center text-xl text-base-content/40 border border-base-300 shadow-sm">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
              </td>
              <td
                className="font-semibold text-base text-base-content/90 max-w-xs truncate cursor-pointer underline hover:text-primary transition-colors duration-150"
                title={s.title}
                onClick={() => navigate(`./${s.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`./${s.id}`); }}
              >
                {s.title}
              </td>
              <td className="text-base text-base-content/80">{s.sku || "-"}</td>
              <td className="text-base text-base-content/80">
                {Array.isArray(s.marketplace)
                  ? s.marketplace.join(", ")
                  : s.marketplace || "-"}
              </td>
              <td>
                <span
                  className={`badge px-3 py-1 rounded-full text-base tracking-wide ${s.stockStatus === "IN_STOCK" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}
                >
                  {s.stockStatus || "-"}
                </span>
              </td>
              <td className="text-base text-base-content/90">
                {s.quantity ?? "-"}
              </td>
              <td className="font-semibold text-base text-base-content/90">
                {formatCurrency(s.price, s.currency)}
              </td>
              <td className="space-x-1   items-center justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs"
                  onClick={() => navigate(`./${s.id}/edit`)}
                >
                  Edit
                </Button>
                {/* Use the new DeleteStockButton component */}
                <DeleteStockButton stockId={s.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
