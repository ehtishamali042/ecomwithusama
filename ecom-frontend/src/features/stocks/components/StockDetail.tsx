import type { Stock } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils";
import { useNavigate } from "react-router-dom";

interface StockDetailProps {
  stock: Stock;
}

export default function StockDetail({ stock }: StockDetailProps) {
  const navigate = useNavigate();
  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{stock.title}</CardTitle>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {stock.mainImageUrl ? (
            <img
              src={stock.mainImageUrl}
              alt={stock.title}
              className="w-48 h-48 object-cover rounded border"
            />
          ) : (
            <div className="w-48 h-48 bg-base-300 rounded flex items-center justify-center text-4xl">
              —
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <span className="font-semibold">SKU:</span> {stock.sku || "-"}
          </div>
          <div>
            <span className="font-semibold">Marketplace:</span>{" "}
            {stock.marketplace?.join(", ") || "-"}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {stock.stockStatus || "-"}
          </div>
          <div>
            <span className="font-semibold">Quantity:</span>{" "}
            {stock.quantity ?? "-"}
          </div>
          <div>
            <span className="font-semibold">Price:</span>{" "}
            {formatCurrency(stock.price, stock.currency)}
          </div>
          <div>
            <span className="font-semibold">Size:</span>{" "}
            {stock.sizeLabel || "-"}
          </div>
          <div>
            <span className="font-semibold">Color:</span>{" "}
            {stock.colorLabel || "-"}
          </div>
          <div>
            <span className="font-semibold">Tags:</span>{" "}
            {stock.tags?.join(", ") || "-"}
          </div>
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {stock.createdAt ? new Date(stock.createdAt).toLocaleString() : "-"}
          </div>
          <div>
            <span className="font-semibold">Updated:</span>{" "}
            {stock.updatedAt ? new Date(stock.updatedAt).toLocaleString() : "-"}
          </div>
          <div>
            <span className="font-semibold">Description:</span>
            <div className="whitespace-pre-line mt-1 text-base-content/80">
              {stock.description || "-"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
