"use client";

import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title?: string;
    description?: string;
    variant?: "danger" | "warning";
}

export function AlertModal({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    variant = "danger"
}: AlertModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-sm"
        >
            <div className="space-y-4">
                <p className="text-sm text-text/70">{description}</p>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={variant === "danger" ? "danger" : "primary"}
                        onClick={onConfirm}
                        isLoading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
