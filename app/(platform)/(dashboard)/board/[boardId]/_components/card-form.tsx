import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

type CardFormProps = {
  listId: string;
  enableEditing(): void;
  disableEditing(): void;
  isEditing: boolean;
  boardId: string;
};

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ disableEditing, enableEditing, isEditing, listId, boardId }, ref) => {
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute: executeCreateCard } = useAction(createCard, {
      onSuccess(data) {
        toast.info(`Card ${data.title} created successfully`);
        formRef.current?.reset();
        disableEditing();
      },
      onError(error) {
        toast.error(error);
      },
    });

    const onTextareKeydown: KeyboardEventHandler<HTMLTextAreaElement> =
      useCallback((event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          formRef.current?.requestSubmit();
        }
      }, []);

    const onKeydown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          disableEditing();
        }
      },
      [disableEditing]
    );

    const onSubmit = useCallback(
      (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = formData.get("boardId") as string;

        executeCreateCard({
          boardId,
          listId,
          title,
        });
      },
      [executeCreateCard]
    );

    useEventListener("keydown", onKeydown);
    useOnClickOutside(formRef, disableEditing);

    if (isEditing) {
      return (
        <form
          className="m-1 py-0.5 px-1 space-y-4"
          ref={formRef}
          action={onSubmit}
        >
          <FormTextarea
            id="title"
            ref={ref}
            onKeydown={onTextareKeydown}
            placeholder="Enter a title for this card..."
          />
          <input hidden id="listId" name="listId" value={listId} />
          <input hidden id="boardId" name="boardId" value={boardId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          onClick={enableEditing}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
