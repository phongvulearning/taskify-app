import { z } from "zod";

import { DeleteList } from "./shema";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof DeleteList>;
export type OutputType = ActionState<InputType, List>;
