"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./shema";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Update a board
  const { title, id } = validatedData;

  let board;

  try {
    board = await db.board.update({
      where: {
        orgId,
        id,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "UPDATE",
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
