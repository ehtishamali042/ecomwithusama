// No default React import required with the new JSX transform
import { useParams, useNavigate } from "react-router-dom";
import { useStockDetailQuery } from "@/react-query/queries/stocks";
import {
  useUpdateStockMutation,
  useUploadStockImageMutation,
} from "@/react-query/mutations/stocks";
import type { StockFormValues, StockPayload } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StockForm from "./components/StockForm";

export default function StockEditPage() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useStockDetailQuery(stockId);
  const updateMut = useUpdateStockMutation();
  const uploadMut = useUploadStockImageMutation();

  async function handleSubmit(values: StockFormValues) {
    if (!stockId) return;
    try {
      // Build update payload with only allowed fields (matches CreateStockDto)
      const upd: Partial<StockPayload> = {};
      // handle image upload if a new file was provided
      if (values.mainImageFile) {
        const up = await uploadMut.mutateAsync(values.mainImageFile);
        if (up) {
          if (up.publicUrl) {
            upd.mainImageUrl = up.publicUrl;
            // Also update the form value so it doesn't send a data URL
            values.mainImageUrl = up.publicUrl;
          }
          if (up.path) upd.mainImagePath = up.path;
        }
      }

      // copy allowed fields from form values (explicit assignments avoid dynamic indexing)
      if (values.title !== undefined) upd.title = values.title;
      if (values.description !== undefined)
        upd.description = values.description;
      if (values.sku !== undefined) upd.sku = values.sku;
      if (values.marketplace !== undefined)
        upd.marketplace = values.marketplace as unknown as string[];
      if (values.onlineMarketplaceUrl !== undefined)
        upd.onlineMarketplaceUrl = values.onlineMarketplaceUrl;
      if (values.sizeLabel !== undefined) upd.sizeLabel = values.sizeLabel;
      if (values.colorLabel !== undefined) upd.colorLabel = values.colorLabel;
      if (values.stockStatus !== undefined) {
        upd.stockStatus = values.stockStatus;
      }
      if (values.marketplace !== undefined) {
        upd.marketplace = Array.isArray(values.marketplace)
          ? values.marketplace
          : [values.marketplace];
      }
      if (values.quantity !== undefined) upd.quantity = values.quantity;
      if (values.price !== undefined) upd.price = values.price;
      if (values.currency !== undefined) upd.currency = values.currency;
      if (values.mainImageUrl !== undefined)
        upd.mainImageUrl = values.mainImageUrl;
      if (values.mainImagePath !== undefined)
        upd.mainImagePath = values.mainImagePath;
      if (values.tags !== undefined) {
        upd.tags = Array.isArray(values.tags)
          ? values.tags
          : (values.tags as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
      }
      await updateMut.mutateAsync({ id: stockId, payload: upd });
      navigate("/dashboard/stocks");
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockForm
            initialValues={data || undefined}
            onSubmit={handleSubmit}
            isSubmitting={
              updateMut.status === "pending" || uploadMut.status === "pending"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
