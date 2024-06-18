import { z } from "zod";

export const CopyList = z.object({
  boardId: z.string(),
  listId: z.string(),
});
