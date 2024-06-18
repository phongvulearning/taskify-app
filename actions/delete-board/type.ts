import { z } from "zod";

import { DeleteBoard } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof DeleteBoard>;
export type OutputType = ActionState<InputType, null>;
