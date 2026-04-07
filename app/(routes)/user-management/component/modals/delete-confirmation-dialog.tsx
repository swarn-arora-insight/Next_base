"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    itemName: string;
    onConfirm: () => void;
}

export function DeleteConfirmationDialog({
    open,
    onOpenChange,
    title,
    itemName,
    onConfirm,
}: DeleteConfirmationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Trash2 className="size-5 text-destructive" />
                        Delete {title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <p className="text-sm text-muted-foreground">{title} to be deleted:</p>
                        <p className="mt-1 font-semibold text-foreground">{itemName}</p>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
