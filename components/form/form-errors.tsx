import { XCircle } from "lucide-react";

interface FormErrorsProps {
  errors?: Record<string, string[] | undefined>;
  id: string;
}

export const FormErrors = ({ errors, id }: FormErrorsProps) => {
  if (!errors || !errors[id]) return null;

  return (
    <div
      className="mt-2 text-xs text-rose-500"
      id={`${id}-error`}
      aria-live="polite"
    >
      {errors[id]?.map((error) => (
        <div
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
          key={error}
        >
          <XCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
};
