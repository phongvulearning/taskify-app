"use server";

import { db } from "@/lib/db";
import { CopyList } from "./shema";
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

  const { boardId, listId } = validatedData;

  let list;

  try {
    const board = await db.board.findFirst({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const listToCopy = await db.list.findFirst({
      where: {
        board: {
          orgId,
          id: boardId,
        },
        id: listId,
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return {
        error: "List not found",
      };
    }

    const lastList = await db.list.findFirst({
      where: {
        board: {
          id: boardId,
          orgId,
        },
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastList ? lastList.order + 1 : 0;

    const cards = listToCopy.cards.map((card) => ({
      title: card.title,
      description: card.description,
      order: card.order,
    }));

    list = await db.list.create({
      data: {
        boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: cards,
          },
        },
      },
      include: {
        cards: true,
      },
    });

    await createAuditLog({
      entityType: "LIST",
      entityId: list.id,
      entityTitle: list.title,
      action: "COPY",
    });
  } catch (error) {
    return {
      error: "Failed to copy list",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
