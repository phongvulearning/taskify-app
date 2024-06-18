import { z } from "zod";

import { Board } from "@prisma/client";

import { UpdateBoard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateBoard>;
export type OutputType = ActionState<InputType, Board>;
