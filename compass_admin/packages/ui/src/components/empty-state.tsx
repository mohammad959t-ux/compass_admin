import * as React from "react";

import { Button } from "./button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/60 p-10 text-center">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {description ? <p className="mt-2 text-sm text-text/70">{description}</p> : null}
      {actionLabel ? (
        <div className="mt-4">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
