"use client";

import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { KeyboardEventHandler, forwardRef } from "react";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormErrors } from "./form-errors";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeydown?: KeyboardEventHandler<HTMLTextAreaElement | null>;
}

export const FormTextarea = forwardRef(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue,
      onBlur,
      onClick,
      onKeydown,
    }: FormTextareaProps,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            onKeyDown={onKeydown}
            onBlur={onBlur}
            onClick={onClick}
            ref={ref}
            id={id}
            name={id}
            disabled={disabled || pending}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={cn(
              "resize-none focus-visible:ring-0  focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
