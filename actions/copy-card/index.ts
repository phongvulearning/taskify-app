"use server";

import { db } from "@/lib/db";
import { CopyCard } from "./shema";
import { InputType, OutputType } from "./type";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

export const handler = async (
  validatedData: InputType
): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, cardId } = validatedData;

  let card;

  try {
    const cardToCopy = await db.card.findFirst({
      where: {
        lists: {
          board: {
            orgId,
            id: boardId,
          },
        },
        id: cardId,
      },
    });

    if (!cardToCopy) {
      return {
        error: "Card not found",
      };
    }

    const lastCard = await db.card.findFirst({
      where: { id: cardId },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 0;

    card = await db.card.create({
      data: {
        listId: cardToCopy.listId,
        title: `${cardToCopy.title} - Copy`,
        order: newOrder,
      },
    });
    await createAuditLog({
      entityType: "CARD",
      entityId: card.id,
      entityTitle: card.title,
      action: "COPY",
    });
  } catch (error) {
    return {
      error: "Failed to copy card",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
