"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";

interface EditOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    onNameChange: (name: string) => void;
    onSave: () => void;
}

export function EditOrganizationDialog({
    open,
    onOpenChange,
    name,
    onNameChange,
    onSave,
}: EditOrganizationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Pencil className="size-5 text-primary" />
                        Edit Organization
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update the organization name below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-org-name" className="text-foreground">
                            Organization Name
                        </Label>
                        <Input
                            id="edit-org-name"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder="Enter organization name"
                            className="bg-background border-border"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="text-text" onClick={onSave} disabled={!name.trim()}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface Organization {
    id: number;
    name: string;
}

interface EditRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roleName: string;
    onRoleNameChange: (name: string) => void;
    selectedOrganizationId: string;
    onOrganizationChange: (orgId: string) => void;
    organizations: Organization[];
    onSave: () => void;
}

export function EditRoleDialog({
    open,
    onOpenChange,
    roleName,
    onRoleNameChange,
    selectedOrganizationId,
    onOrganizationChange,
    organizations,
    onSave,
}: EditRoleDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <Pencil className="size-5 text-primary" />
                        Edit Role
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update the role details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-role-name" className="text-foreground">
                            Role Name
                        </Label>
                        <Input
                            id="edit-role-name"
                            value={roleName}
                            onChange={(e) => onRoleNameChange(e.target.value)}
                            placeholder="Enter role name"
                            className="bg-background border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-role-org" className="text-foreground">
                            Organization
                        </Label>
                        <Select value={selectedOrganizationId} onValueChange={onOrganizationChange}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map((org) => (
                                    <SelectItem key={org.id} value={org.id.toString()}>
                                        {org.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="text-text" onClick={onSave} disabled={!roleName.trim() || !selectedOrganizationId}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
