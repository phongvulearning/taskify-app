"use client";
import React from "react";
import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModalStore } from "@/hooks/use-card-modal";

type CardItemProps = {
  data: Card;
  index: number;
};

export const CardItem = ({ data, index }: CardItemProps) => {
  const onOpen = useCardModalStore((s) => s.onOpen);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => onOpen(data.id)}
          className="truncate  border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
