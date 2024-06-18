import { z } from "zod";

import { Board } from "@prisma/client";

import { CreateBoard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateBoard>;
export type OutputType = ActionState<InputType, Board>;
