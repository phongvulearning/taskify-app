"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useCallback, useRef } from "react";
import { toast } from "sonner";

interface ListHeaderProps {
  data: ListWithCards;
  onAddCard(): void;
}

export const ListOptions = ({ data, onAddCard }: ListHeaderProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess(data) {
      toast.info(`List "${data.title}" deleted successfully`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess(data) {
      toast.info(`List "${data.title}" copied successfully`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleAddCard = useCallback(() => {
    onAddCard();
    closeRef.current?.click();
  }, [onAddCard]);

  const onCopy = useCallback(
    (formData: FormData) => {
      const boardId = formData.get("boardId") as string;
      const listId = formData.get("id") as string;

      executeCopy({
        boardId,
        listId,
      });
      closeRef.current?.click();
    },
    [executeCopy]
  );

  const onDelete = useCallback(
    (formData: FormData) => {
      const boardId = formData.get("boardId") as string;
      const listId = formData.get("id") as string;

      executeDelete({
        boardId,
        listId,
      });
    },
    [executeDelete]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" sideOffset={10}>
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose asChild>
          <Button
            ref={closeRef}
            className="text-left absolute top-2 right-2 p-2 text-neutral-600 h-auto w-auto"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={handleAddCard}
          className="w-full rounded-none h-auto p-2 px-5  justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card ...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <Button
            className="w-full rounded-none h-auto p-2 px-5  justify-start font-normal text-sm"
            variant="ghost"
          >
            Copy list ...
          </Button>
        </form>
        <Separator className="my-2" />
        <form action={onDelete}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <Button
            className="w-full rounded-none h-auto p-2 px-5  justify-start font-normal text-sm"
            variant="ghost"
          >
            Delete this list
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
