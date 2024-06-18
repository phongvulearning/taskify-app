"use client";

import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "../ui/popover";
import { Button } from "../ui/button";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-button";
import { useFormStatus } from "react-dom";
import { FormPicker } from "./form-picker";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { ElementRef, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  side = "bottom",
  sideOffset = 0,
  align,
  children,
}: FormPopoverProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute, isLoading, fieldErrors } = useAction(createBoard, {
    onSuccess(data) {
      closeRef?.current?.click();
      toast.success(`Board created!`);
      router.push(`/board/${data.id}`);
    },
    onError(error) {
      toast.error(error);
      closeRef.current?.click();
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const title = formData.get("title") as string;
      const image = formData.get("image") as string;

      execute({ title, image });
    },
    [execute]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="w-80 pt-3 relative"
      >
        <div className="text-sm font-medium text-center text-neutral-700 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant="ghost"
            className="text-neutral-600 w-auto h-auto p-2 absolute top-2 right-2"
          >
            <X className="w-4 h-4 " />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
              disabled={isLoading}
            />
          </div>
          <FormSubmit disabled={pending || isLoading} className="w-full">
            Create
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
