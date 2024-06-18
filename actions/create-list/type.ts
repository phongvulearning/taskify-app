import { z } from "zod";

import { List } from "@prisma/client";

import { CreateList } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateList>;
export type OutputType = ActionState<InputType, List>;
