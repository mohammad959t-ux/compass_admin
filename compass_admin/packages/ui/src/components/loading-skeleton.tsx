import * as React from "react";

import { cn } from "../lib/cn";

export function LoadingSkeleton({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("h-4 w-full animate-pulse rounded-md bg-muted", className)} />
  );
}
