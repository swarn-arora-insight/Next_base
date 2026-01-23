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
import { Shield } from "lucide-react";

interface AddRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Dummy organizations list - will come from API in future
const dummyOrganizations = [
    { id: "1", name: "Acme Corporation" },
    { id: "2", name: "Tech Solutions Inc." },
    { id: "3", name: "Global Enterprises" },
    { id: "4", name: "Innovation Labs" },
];

export function AddRoleDialog({ open, onOpenChange }: AddRoleDialogProps) {
    const [roleName, setRoleName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRoleName("");
        onOpenChange(false);
    };

    const handleClose = () => {
        setRoleName("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-foreground">Add Role</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Create a new role and assign it to an organization.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role-name" className="text-foreground">
                                Role Name
                            </Label>
                            <Input
                                id="role-name"
                                placeholder="Enter role name"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
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
                            Create Role
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
