import * as React from "react";

import { cn } from "../lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();

    return (
      <label className="grid gap-2 text-sm text-text/80" htmlFor={textareaId}>
        {label ? <span className="font-medium text-text">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-[120px] rounded-md border border-border bg-card px-3 py-2 text-sm text-text outline-none transition focus:border-accent-from/70 focus:ring-2 focus:ring-accent-from/20",
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

Textarea.displayName = "Textarea";
