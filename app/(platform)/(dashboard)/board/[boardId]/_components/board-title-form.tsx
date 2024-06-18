"use client";
import { ElementRef, useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/update-board";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

interface BoardTilteFormProps {
  board: Board;
}

const BoardTilteForm = ({ board }: BoardTilteFormProps) => {
  const [title, setTitle] = useState(board.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { execute, isLoading } = useAction(updateBoard, {
    onSuccess(data) {
      disableEditing();
      setTitle(data.title);
      toast.success(`Board "${data.title}" updated!`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const enbleEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;

      if (title === board.title) {
        disableEditing();
        return;
      }
      execute({ id: board.id, title });
    },
    [board.id, board.title, disableEditing, execute]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing]
  );

  const onBlur = useCallback(() => formRef?.current?.requestSubmit(), []);

  useEventListener("keydown", handleKeyDown);

  if (isEditing) {
    return (
      <form ref={formRef} action={onSubmit}>
        <FormInput
          id="title"
          onBlur={onBlur}
          ref={inputRef}
          disabled={isLoading}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      variant="transparent"
      className="font-bold text-lg h-auto p-1 px-2"
      onClick={enbleEditing}
    >
      {title}
    </Button>
  );
};

export default BoardTilteForm;
