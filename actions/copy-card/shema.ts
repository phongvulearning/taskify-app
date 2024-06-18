import { z } from "zod";

export const CopyCard = z.object({
  boardId: z.string(),
  cardId: z.string(),
});
