"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import React, {
  ElementRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

type Props = {
  data: CardWithList;
};

export const Header = ({ data }: Props) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);

  const { execute } = useAction(updateCard, {
    onSuccess: async (data) => {
      toast.success(`Renamed to "${data.title}"`);

      await queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      await queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      setTitle(data.title);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onBlur = useCallback(() => {
    inputRef.current?.form?.requestSubmit();
  }, []);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      const boardId = params.boardId as string;
      const id = data.id;
      if (!boardId) return toast.error("Board ID is required");
      if (title === data.title) return;

      execute({ id, boardId, title });
    },
    [data.id, data.title, execute, params.boardId]
  );

  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            id="title"
            onBlur={onBlur}
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent borde-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.lists.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div className="space-y-1">
        <Skeleton className="w-24 h-6 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
