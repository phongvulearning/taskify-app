import { z } from "zod";

import { Card } from "@prisma/client";

import { UpdateCard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateCard>;
export type OutputType = ActionState<InputType, Card>;
