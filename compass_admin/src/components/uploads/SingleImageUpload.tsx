"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadAdminFile } from "../../lib/api";

type SingleImageUploadProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function SingleImageUpload({ value, onChange, disabled }: SingleImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { url } = await uploadAdminFile(file);
            onChange(url);
        } catch (error) {
            console.error("Upload failed:", error);
            // You might want to show a toast here
        } finally {
            setIsUploading(false);
        }
    };

    if (value) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                <img src={value} alt="Upload" className="h-full w-full object-cover" />
                <button
                    type="button"
                    onClick={() => onChange("")}
                    disabled={disabled}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border py-10 transition hover:bg-muted/50">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-background p-3 shadow-sm">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    )}
                </div>
                <div className="text-center text-sm">
                    <span className="font-medium text-primary hover:underline">Click to upload</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={disabled || isUploading}
                />
            </label>
        </div>
    );
}
