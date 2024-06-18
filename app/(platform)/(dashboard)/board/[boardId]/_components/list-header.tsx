"use client";

import { FormInput } from "@/components/form/form-input";
import { ListWithCards } from "@/types";
import { ElementRef, useCallback, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";

interface ListHeaderProps {
  data: ListWithCards;
  onAddCard(): void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState<string>(data.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { execute, isLoading, fieldErrors } = useAction(updateList, {
    onSuccess(data) {
      toast.info(`List "${data.title}" updated successfully`);
      disableEditing();
      setTitle(data.title);
    },
  });

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onBlur = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTitle(data.title);
        disableEditing();
      }
    },
    [data.title, disableEditing]
  );

  useEventListener("keydown", handleKeyDown);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const id = formData.get("id") as string;
      const boardId = formData.get("boardId") as string;
      const title = formData.get("title") as string;

      if (
        !title ||
        title.trim() === "" ||
        !id ||
        !boardId ||
        title === data.title
      )
        return;

      execute({
        title,
        boardId,
        id,
      });
    },
    [data.title, execute]
  );

  return (
    <div className="p-2 pb-0 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="px-[2px] flex-1">
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormInput
            errors={fieldErrors}
            defaultValue={title}
            placeholder="Enter list title..."
            id="title"
            ref={inputRef}
            onBlur={onBlur}
            disabled={isLoading}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input  transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent truncate"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
