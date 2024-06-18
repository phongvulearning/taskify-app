import { z } from "zod";

import { Card } from "@prisma/client";

import { CopyCard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CopyCard>;
export type OutputType = ActionState<InputType, Card>;
