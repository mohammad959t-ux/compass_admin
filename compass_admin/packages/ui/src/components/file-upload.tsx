"use client";

import * as React from "react";

import { cn } from "../lib/cn";

export function FileUpload({
  label,
  helperText,
  accept,
  multiple,
  onFilesChange
}: {
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: FileList) => void;
}) {
  const [files, setFiles] = React.useState<FileList | null>(null);

  return (
    <label className="grid gap-2 text-sm text-text/80">
      {label ? <span className="font-medium text-text">{label}</span> : null}
      <div className="relative flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted/60 text-center transition hover:border-accent-from/60">
        <input
          type="file"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
              onFilesChange?.(event.target.files);
            }
          }}
        />
        <div>
          <p className="text-sm font-medium text-text">Drop files here or click to upload</p>
          <p className="text-xs text-text/60">{accept ?? "PNG, JPG, PDF"}</p>
        </div>
      </div>
      {files ? (
        <ul className="space-y-1 text-xs text-text/70">
          {Array.from(files).map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      ) : null}
      {helperText ? <span className="text-xs text-text/60">{helperText}</span> : null}
    </label>
  );
}
