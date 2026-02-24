import * as React from "react";

import { cn } from "../lib/cn";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="rounded-md border border-border px-3 py-2 text-xs text-text/70 transition hover:text-text"
        disabled={page === 1}
      >
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={cn(
            "h-9 w-9 rounded-md text-xs font-semibold",
            item === page
              ? "bg-text text-bg"
              : "border border-border text-text/70 hover:text-text"
          )}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="rounded-md border border-border px-3 py-2 text-xs text-text/70 transition hover:text-text"
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
