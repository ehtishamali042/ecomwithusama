import { useDeleteStockMutation } from "@/react-query/mutations/stocks";
import Spinner from "@/assets/svg/Spinner";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";
import React, { useState } from "react";

interface DeleteStockButtonProps {
  stockId: string;
  iconOnly?: boolean;
  buttonClassName?: string;
}

import { DeleteIcon } from "@/components/ui/Icons";

const DeleteStockButton: React.FC<DeleteStockButtonProps> = ({
  stockId,
  iconOnly,
  buttonClassName,
}) => {
  const [confirming, setConfirming] = useState(false);
  const deleteMut = useDeleteStockMutation();

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      if (
        !confirm(
          NOTIFICATION_MESSAGES.STOCK.DELETE_CONFIRMATION ||
            "Delete this stock?",
        )
      ) {
        setConfirming(false);
        return;
      }
    }
    deleteMut.mutate(stockId, {
      onSettled: () => setConfirming(false),
    });
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleDelete}
      disabled={deleteMut.isPending}
      aria-label="Delete stock"
      className={iconOnly ? `p-1 ${buttonClassName ?? ""}` : buttonClassName}
    >
      {deleteMut.isPending ? (
        <Spinner />
      ) : iconOnly ? (
        <DeleteIcon className="w-5 h-5 text-red-500" />
      ) : (
        "Delete"
      )}
    </Button>
  );
};

export default DeleteStockButton;
