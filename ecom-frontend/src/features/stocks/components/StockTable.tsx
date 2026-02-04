// No default React import required with the new JSX transform
import type { Stock } from "../types";
import { Loader } from "@/components/ui/Loader";
import { formatCurrency } from "../utils";
import { truncateString } from "@/utils/stringTruncate";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/components/ui/Icons";
import "./stocktable.css";
import { useNavigate } from "react-router-dom";
import DeleteStockButton from "./DeleteStockButton";

export interface StockTableProps {
  stocks?: Stock[];
  isLoading?: boolean;
}

export function StockTable({ stocks = [], isLoading }: StockTableProps) {
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="p-4">
        <Loader text="Loading stocks..." />
      </div>
    );

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
                      className="stock-table-img"
                    />
                  ) : (
                    <div className="stock-table-img-placeholder">
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
              >
                {truncateString(s.title, 21)}
              </td>
              <td
                className="font-medium text-base text-base-content/80 max-w-xs truncate"
                title={s.sku}
              >
                {truncateString(s.sku, 10) || "-"}
              </td>
              <td
                className="font-medium text-base text-base-content/80 max-w-xs truncate"
                title={
                  Array.isArray(s.marketplace)
                    ? s.marketplace.join(", ")
                    : s.marketplace
                }
              >
                {Array.isArray(s.marketplace)
                  ? truncateString(s.marketplace.join(", "), 18)
                  : truncateString(s.marketplace, 18) || "-"}
              </td>
              <td className="max-w-xs truncate" title={s.stockStatus}>
                <span
                  className={`badge px-3 py-1 rounded-full text-base font-semibold tracking-wide ${s.stockStatus === "IN_STOCK" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}
                >
                  {truncateString(s.stockStatus, 18) || "-"}
                </span>
              </td>
              <td
                className="font-semibold text-base text-base-content/90 max-w-xs truncate"
                title={String(s.quantity)}
              >
                {s.quantity ?? "-"}
              </td>
              <td
                className="font-semibold text-base text-base-content/90 max-w-xs truncate"
                title={formatCurrency(s.price, s.currency)}
              >
                {truncateString(formatCurrency(s.price, s.currency), 18)}
              </td>
              <td className="space-x-1   items-center justify-center">
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 border border-gray-300 rounded"
                    onClick={() => navigate(`./${s.id}/edit`)}
                    aria-label="Edit stock"
                  >
                    <EditIcon className="w-5 h-5" />
                  </Button>
                  <DeleteStockButton
                    stockId={s.id}
                    iconOnly
                    buttonClassName="border border-gray-300 rounded"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
