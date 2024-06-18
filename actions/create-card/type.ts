import { z } from "zod";

import { Card } from "@prisma/client";

import { CreateCard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateCard>;
export type OutputType = ActionState<InputType, Card>;
