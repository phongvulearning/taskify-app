"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormButtonProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export const FormSubmit = ({
  children,
  className,
  variant,
  disabled,
}: FormButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      size="sm"
      type="submit"
      variant={variant}
      className={cn(className)}
      disabled={disabled || pending}
    >
      {children}
    </Button>
  );
};
