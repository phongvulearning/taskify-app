import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";

type Action<TInput, TOutput> = (
  input: TInput
) => Promise<ActionState<TInput, TOutput>>;

interface UseActionProps<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options?: UseActionProps<TInput, TOutput>
) => {
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<TInput | undefined>
  >({});

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        const result = await action(input);

        if (!result) return;

        setFieldErrors(result.fieldErrors);

        if (result.data) {
          setData(result.data);
          options?.onSuccess?.(result.data);
        }

        if (result.error) {
          setError(result.error);
          options?.onError?.(result.error);
        }
      } finally {
        setIsLoading(false);
        options?.onCompleted?.();
      }
    },
    [action, options]
  );

  return { execute, data, error, isLoading, fieldErrors };
};
