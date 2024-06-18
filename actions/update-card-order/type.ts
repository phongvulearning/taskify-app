import { z } from "zod";

import { Card } from "@prisma/client";

import { UpdateCardOrder } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateCardOrder>;
export type OutputType = ActionState<InputType, Card[]>;
