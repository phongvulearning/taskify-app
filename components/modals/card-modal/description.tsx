"use client";
import { updateCard } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { Card } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, {
  ElementRef,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

type Props = {
  data: Card;
};

export const Description = ({ data }: Props) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEdit, setIsEdit] = useState(false);

  const { execute } = useAction(updateCard, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      // queryClient.invalidateQueries(["card-logs", data.id]);
      toast.success(`Renamed to "${data.title}"`);
      disableEditing();
    },
    onError(error) {
      disableEditing();
      toast.error(error);
    },
  });

  const enabledEditing = () => {
    setIsEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableEditing = () => {
    setIsEdit(false);
  };

  const onKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  }, []);

  const onTextareKeydown: KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback((e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }, []);

  useEventListener("keydown", onKeydown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const id = data.id;
      const boardId = params.boardId as string;
      const description = formData.get("description") as string;

      execute({
        boardId,
        id,
        description,
      });
    },
    [data.id, execute, params.boardId]
  );

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEdit ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              ref={inputRef}
              onKeydown={onTextareKeydown}
              className="w-full mt-2"
              defaultValue={data.description || ""}
              placeholder="Add a more detailed description..."
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                variant="ghost"
                type="button"
                size="sm"
                onClick={disableEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enabledEditing}
            className="min-h-[78px] bg-neutral-200 px-3.5 text-sm font-medium py-3 rounded-md"
            role="button"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className=" flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px]  bg-neutral-200" />
      </div>
    </div>
  );
};
