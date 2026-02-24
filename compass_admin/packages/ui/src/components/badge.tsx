import * as React from "react";

import { cn } from "../lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline";

export function Badge({
  children,
  variant = "default",
  className
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-muted text-text",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/15 text-danger",
    outline: "border border-border text-text"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
