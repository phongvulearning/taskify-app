import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  data?: TOutput;
  error?: string;
  fieldErrors?: FieldErrors<TInput>;
};

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validationResult: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (input: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = schema.safeParse(input);

    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handler(validationResult.data);
  };
};
