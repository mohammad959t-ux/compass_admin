import * as React from "react";

import { cn } from "../lib/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, id, ...props }, ref) => {
    const selectId = id ?? React.useId();

    return (
      <label className="grid gap-2 text-sm text-text/80" htmlFor={selectId}>
        {label ? <span className="font-medium text-text">{label}</span> : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 rounded-md border border-border bg-card px-3 text-sm text-text outline-none transition focus:border-accent-from/70 focus:ring-2 focus:ring-accent-from/20",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText ? <span className="text-xs text-text/60">{helperText}</span> : null}
        {error ? <span className="text-xs text-danger">{error}</span> : null}
      </label>
    );
  }
);

Select.displayName = "Select";
