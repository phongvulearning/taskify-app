import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModalStore } from "@/hooks/use-card-modal";
import { Card } from "@prisma/client";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  data: Card;
};

export const Actions = ({ data }: Props) => {
  const params = useParams();
  const onClose = useCardModalStore((state) => state.onClose);

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess(data) {
        toast.success(`Copied to "${data.title}"`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess(data) {
        toast.success(`Deleted "${data.title}"`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const handleCopy = () => {
    executeCopyCard({ boardId: params.boardId as string, cardId: data.id });
  };

  const handleDelete = () => {
    executeDeleteCard({
      boardId: params.boardId as string,
      cardId: data.id,
      listId: data.listId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        className="w-full justify-start"
        size="inline"
        variant="gray"
        onClick={handleCopy}
        disabled={isLoadingCopy}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        className="w-full justify-start"
        size="inline"
        variant="gray"
        onClick={handleDelete}
        disabled={isLoadingDelete}
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function SkeletonActions() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
