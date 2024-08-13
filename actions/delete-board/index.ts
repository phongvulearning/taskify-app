"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./shema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { descreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const isPro = await checkSubscription();

  const { id } = validatedData;

  // Delete a board
  let board;

  try {
    board = await db.board.delete({
      where: {
        orgId,
        id,
      },
    });

  await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "DELETE",
    });

    if (!isPro) {
      await descreaseAvailableCount();
    }
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
