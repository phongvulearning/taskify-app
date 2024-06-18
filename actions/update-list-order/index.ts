"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./shema";
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

  let lists;

  try {
    const transaction = items.map((item) =>
      db.list.update({
        where: {
          id: item.id,
          board: {
            orgId,
          },
          boardId,
        },
        data: {
          order: item.order,
        },
      })
    );

    lists = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to update list order",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
