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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Dummy roles list - will come from API in future
const dummyRoles = [
    { id: "1", name: "Admin" },
    { id: "2", name: "Manager" },
    { id: "3", name: "Editor" },
    { id: "4", name: "Viewer" },
    { id: "5", name: "Developer" },
];

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("User created:", { firstName, lastName, email, role: selectedRole });
        setFirstName("");
        setLastName("");
        setEmail("");
        setSelectedRole("");
        onOpenChange(false);
    };

    const handleClose = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setSelectedRole("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-foreground">Add User</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Create a new user account and assign a role.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name" className="text-foreground">
                                    First Name
                                </Label>
                                <Input
                                    id="first-name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="bg-background text-foreground"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name" className="text-foreground">
                                    Last Name
                                </Label>
                                <Input
                                    id="last-name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-background text-foreground"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background text-foreground"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-foreground">
                                Role
                            </Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole} required>
                                <SelectTrigger className="w-full bg-background text-foreground">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dummyRoles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
