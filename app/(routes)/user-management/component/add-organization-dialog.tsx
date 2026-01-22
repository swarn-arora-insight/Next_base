"use client";

import React from "react"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface AddOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddOrganizationDialog({
    open,
    onOpenChange,
}: AddOrganizationDialogProps) {
    const [orgName, setOrgName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Organization created:", { orgName });
        setOrgName("");
        onOpenChange(false);
    };

    const handleClose = () => {
        setOrgName("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Building2 className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-foreground">Add Organization</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Create a new organization for your team.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-name" className="text-foreground">
                                Organization Name
                            </Label>
                            <Input
                                id="org-name"
                                placeholder="Enter organization name"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                className="bg-background text-foreground"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="bg-transparent text-foreground border-border hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="text-text">
                            Create Organization
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
