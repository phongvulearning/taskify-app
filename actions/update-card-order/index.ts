"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./shema";
import { revalidatePath } from "next/cache";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Update list order
  const { items, boardId } = validatedData;

  let cards;

  try {
    const transaction = items.map((item) =>
      db.card.update({
        where: {
          id: item.id,
          lists: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: item.order,
          listId: item.listId,
        },
      })
    );

    cards = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to update card order",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: cards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
