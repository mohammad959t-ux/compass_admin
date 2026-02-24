import * as React from "react";

import { cn } from "../lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <label className="grid gap-2 text-sm text-text/80" htmlFor={inputId}>
        {label ? <span className="font-medium text-text">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-md border border-border bg-card px-3 text-sm text-text outline-none transition focus:border-accent-from focus:ring-2 focus:ring-accent-from/30",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        />
        {helperText ? <span className="text-xs text-text/60">{helperText}</span> : null}
        {error ? <span className="text-xs text-danger">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";
