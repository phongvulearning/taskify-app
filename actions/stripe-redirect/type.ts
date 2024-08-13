import { z } from "zod";

import { StripeRedirect } from "./shema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof StripeRedirect>;
export type OutputType = ActionState<InputType, string>;
