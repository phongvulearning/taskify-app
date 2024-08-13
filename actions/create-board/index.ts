"use server";

import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./shema";
import { createAuditLog } from "@/lib/create-audit-log";
import { hasAvailableCount, increaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreateBoard = await hasAvailableCount();
  const isPro = await checkSubscription();

  if (!canCreateBoard && !isPro) {
    return {
      error:
        "You have reached the maximum number of boards allowed in your organization. Please upgrade to a paid plan to create more.",
    };
  }
  // Create a board
  const { title, image } = validatedData;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Invalid image data. Failed to create board",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
        orgId,
      },
    });

    if (!isPro) {
      await increaseAvailableCount();
    }

    await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "CREATE",
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
