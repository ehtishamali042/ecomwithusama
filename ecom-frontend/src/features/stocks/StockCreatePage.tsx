// No default React import required with the new JSX transform
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StockForm from "./components/StockForm";
import {
  useCreateStockMutation,
  useUploadStockImageMutation,
} from "@/react-query/mutations/stocks";
import type { StockFormValues, StockPayload } from "./types";

export default function StockCreatePage() {
  const navigate = useNavigate();
  const createMut = useCreateStockMutation();
  const uploadMut = useUploadStockImageMutation();

  async function handleSubmit(values: StockFormValues) {
    try {
      // If a new file was provided, upload it first and use returned publicUrl
      const payload: Partial<StockPayload> = {};

      // copy allowed fields from form values (explicit assignments avoid dynamic indexing)
      if (values.title !== undefined) payload.title = values.title;
      if (values.description !== undefined)
        payload.description = values.description;
      if (values.sku !== undefined) payload.sku = values.sku;
      if (values.marketplace !== undefined)
        payload.marketplace = values.marketplace as unknown as string[];
      if (values.onlineMarketplaceUrl !== undefined)
        payload.onlineMarketplaceUrl = values.onlineMarketplaceUrl;
      if (values.sizeLabel !== undefined) payload.sizeLabel = values.sizeLabel;
      if (values.colorLabel !== undefined)
        payload.colorLabel = values.colorLabel;
      if (values.stockStatus !== undefined)
        payload.stockStatus = values.stockStatus;
      if (values.quantity !== undefined) payload.quantity = values.quantity;
      if (values.price !== undefined) payload.price = values.price;
      if (values.currency !== undefined) payload.currency = values.currency;
      if (values.mainImageUrl !== undefined)
        payload.mainImageUrl = values.mainImageUrl;
      if (values.mainImagePath !== undefined)
        payload.mainImagePath = values.mainImagePath;
      if (values.tags !== undefined) {
        payload.tags = Array.isArray(values.tags)
          ? values.tags
          : (values.tags as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
      }

      if (values.mainImageFile) {
        const up = await uploadMut.mutateAsync(values.mainImageFile);
        if (up) {
          if (up.publicUrl) payload.mainImageUrl = up.publicUrl;
          if (up.path) payload.mainImagePath = up.path;
        }
      }

      // normalize tags to string[] for API
      if (payload.tags && typeof payload.tags === "string") {
        payload.tags = (payload.tags as unknown as string)
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);
      }

      // normalize marketplace to string[] (backend expects array)
      if (payload.marketplace && typeof payload.marketplace === "string") {
        payload.marketplace = [payload.marketplace as unknown as string];
      }

      await createMut.mutateAsync(payload as StockPayload);
      navigate("/dashboard/stocks");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockForm
            onSubmit={handleSubmit}
            isSubmitting={
              createMut.status === "pending" || uploadMut.status === "pending"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
