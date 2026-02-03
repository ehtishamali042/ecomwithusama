import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStock, updateStock, deleteStock } from "../../api/stocksApi";
import type { StockPayload } from "../../api/stocksApi";
import { uploadStockImage } from "../../api/filesApi";
import type { UploadResponse } from "../../api/filesApi";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

export function useCreateStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.CREATE_SUCCESS,
      );
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
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.UPDATE_SUCCESS,
      );
    },
  });
}

export function useDeleteStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteStock(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stocks"] });
      notificationService.showSuccess(
        NOTIFICATION_MESSAGES.STOCK.DELETE_SUCCESS,
      );
    },
    onError: (error: Error) => {
      notificationService.showError(
        error.message || NOTIFICATION_MESSAGES.STOCK.DELETE_ERROR,
      );
    },
  });
}

export function useUploadStockImageMutation() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadStockImage(file),
  });
}
