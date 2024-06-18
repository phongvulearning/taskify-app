import { z } from "zod";

export const DeleteCard = z.object({
  boardId: z.string(),
  listId: z.string(),
  cardId: z.string(),
});
