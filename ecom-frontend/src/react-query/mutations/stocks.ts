import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStock, updateStock, deleteStock } from "../../api/stocksApi";
import type { StockPayload } from "../../api/stocksApi";
import { uploadStockImage } from "../../api/filesApi";
import type { UploadResponse } from "../../api/filesApi";

export function useCreateStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}

export function useUpdateStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<StockPayload>;
    }) => updateStock(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      if (variables && variables.id)
        qc.invalidateQueries({ queryKey: ["stock", variables.id] });
    },
  });
}

export function useDeleteStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStock(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}

export function useUploadStockImageMutation() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadStockImage(file),
  });
}
