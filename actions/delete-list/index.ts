"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./shema";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, listId } = validatedData;

  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        orgId,
        id: boardId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    list = await db.list.delete({
      where: {
        board: {
          id: boardId,
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

    await createAuditLog({
      entityType: "LIST",
      entityId: list.id,
      entityTitle: list.title,
      action: "DELETE",
    });
  } catch (error) {
    return {
      error: "Failed to delete list",
    };
  }

  revalidatePath(`/organization/${orgId}`);

  return {
    data: list,
  };
};

export const deleteList = createSafeAction(DeleteList, handler);
