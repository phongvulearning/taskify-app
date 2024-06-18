"use client";

import { useCallback, useEffect, useState } from "react";
import { ListForm } from "./list-form";
import { ListWithCards } from "@/types";
import { ListItem } from "./list-item";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface BoardIdPageProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: BoardIdPageProps) => {
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(data);

  const { execute: reorderList } = useAction(updateListOrder, {
    onSuccess(data) {
      toast.success("List order updated!");
    },
    onError(error) {
      toast.error(error);
      setOrderedData(data);
    },
  });

  const { execute: reorderCard } = useAction(updateCardOrder, {
    onSuccess(data) {
      toast.success("Card order updated!");
    },
    onError(error) {
      toast.error(error);
      setOrderedData(data);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;

      if (!destination) return;

      if (
        destination.index === source.index &&
        destination.droppableId === source.droppableId
      ) {
        return;
      }

      if (type === "list") {
        const items = reorder(orderedData, source.index, destination.index);
        const mapItems = items.map((item, index) => ({
          ...item,
          order: index,
        }));

        setOrderedData(mapItems);
        reorderList({
          items: mapItems,
          boardId,
        });
      }

      if (type === "card") {
        let newOrderedData = [...orderedData];

        const sourceList = orderedData.find(
          (list) => list.id === source.droppableId
        );

        const destinationList = orderedData.find(
          (list) => list.id === destination.droppableId
        );

        if (!sourceList || !destinationList) return;

        if (!sourceList.cards) {
          sourceList.cards = [];
        }

        if (!destinationList.cards) {
          destinationList.cards = [];
        }

        if (source.droppableId === destination.droppableId) {
          const reorderedCard = reorder(
            sourceList.cards,
            source.index,
            destination.index
          );

          reorderedCard.forEach((card, index) => {
            card.order = index;
          });

          sourceList.cards = reorderedCard;

          setOrderedData(newOrderedData);
          reorderCard({
            items: reorderedCard,
            boardId,
          });
        } else {
          const [removed] = sourceList.cards.splice(source.index, 1);

          removed.listId = destination.droppableId;

          destinationList.cards.splice(destination.index, 0, removed);

          sourceList.cards.forEach((card, index) => {
            card.order = index;
          });

          destinationList.cards.forEach((card, index) => {
            card.order = index;
          });

          setOrderedData(newOrderedData);
          reorderCard({
            items: destinationList.cards,
            boardId,
          });
        }
      }
    },
    [boardId, orderedData, reorderCard, reorderList]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable type="list" droppableId="lists" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            <ListForm />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
