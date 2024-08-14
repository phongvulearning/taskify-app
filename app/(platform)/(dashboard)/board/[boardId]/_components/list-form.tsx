"use client";

import { Plus, X } from "lucide-react";
import { ListWrapper } from "./list-wrapper";
import { ElementRef, useCallback, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FormInput } from "@/components/form/form-input";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormSubmit } from "@/components/form/form-button";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export const ListForm = () => {
  const boardId = useParams().boardId as string;
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { execute, isLoading } = useAction(createList, {
    onSuccess(data) {
      toast.success(`List "${data.title}" created!`);
      disableEditing();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing]
  );

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;

      execute({ title, boardId });
    },
    [boardId, execute]
  );

  useEventListener("keydown", handleKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            id="title"
            className="text-sm px-2 py-1 h-7 border-transparent font-medium hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
            ref={inputRef}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};
