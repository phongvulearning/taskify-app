"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./shema";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, cardId, listId } = validatedData;

  let card;

  try {
    const list = await db.list.findUnique({
      where: {
        board: {
          orgId,
        },
        id: listId,
      },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    card = await db.card.delete({
      where: {
        lists: {
          id: listId,
          board: {
            orgId,
            id: boardId,
          },
        },
        id: cardId,
      },
    });

    if (!card) {
      return {
        error: "Card not found",
      };
    }

    await createAuditLog({
      entityId: card.id,
      entityType: "CARD",
      entityTitle: card.title,
      action: "DELETE",
    });
  } catch (error) {
    return {
      error: "Failed to delete list",
    };
  }

  revalidatePath(`/organization/${orgId}`);

  return {
    data: card,
  };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
