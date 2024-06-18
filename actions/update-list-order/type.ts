import { z } from "zod";

import { List } from "@prisma/client";

import { UpdateListOrder } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateListOrder>;
export type OutputType = ActionState<InputType, List[]>;
