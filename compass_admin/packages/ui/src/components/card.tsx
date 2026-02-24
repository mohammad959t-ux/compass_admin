import * as React from "react";

import { cn } from "../lib/cn";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-8 text-text shadow-sm backdrop-blur-sm transition-all hover:bg-card/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
