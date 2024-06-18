import { z } from "zod";

import { List } from "@prisma/client";

import { UpdateList } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateList>;
export type OutputType = ActionState<InputType, List>;
