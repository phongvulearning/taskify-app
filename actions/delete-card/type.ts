import { z } from "zod";

import { DeleteCard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";

export type InputType = z.infer<typeof DeleteCard>;
export type OutputType = ActionState<InputType, Card>;
