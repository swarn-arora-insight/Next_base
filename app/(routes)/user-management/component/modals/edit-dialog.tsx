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
import { useEditOrg } from "../api";

interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  orgId: string;
}

export function EditOrganizationDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  onSave,
  orgId,
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
          <Button onClick={onSave}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  onRoleNameChange: (name: string) => void;
  onSave: () => void;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  roleName,
  onRoleNameChange,
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
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="text-text"
            onClick={onSave}
            disabled={!roleName.trim()}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface Role {
  id: number;
  name: string;
}
interface EditUserOrganization {
  id: number;
  name: string;
}
interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string;
  onFirstNameChange: (name: string) => void;
  lastName: string;
  onLastNameChange: (name: string) => void;
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  roles: Role[];
  selectedOrganizationId: string;
  onOrganizationChange: (orgId: string) => void;
  organizations: EditUserOrganization[];
  onSave: () => void;
}

const RequiredStar = () => <span className="text-destructive ml-0.5">*</span>;
export function EditUserDialog({
  open,
  onOpenChange,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  selectedRoleId,
  onRoleChange,
  roles,
  selectedOrganizationId,
  onOrganizationChange,
  organizations,
  onSave,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="size-5 text-primary" />
            Edit User
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the user details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-firstname" className="text-foreground">
              First Name
              <RequiredStar />
            </Label>
            <Input
              id="edit-user-firstname"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Enter first name"
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-user-lastname" className="text-foreground">
              Last Name
              <RequiredStar />
            </Label>
            <Input
              id="edit-user-lastname"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Enter last name"
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-user-organization" className="text-foreground">
              Organization
              <RequiredStar />
            </Label>
            <Select
              value={selectedOrganizationId}
              onValueChange={onOrganizationChange}
            >
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
          <div className="space-y-2">
            <Label htmlFor="edit-user-role" className="text-foreground">
              Role
              <RequiredStar />
            </Label>
            <Select value={selectedRoleId} onValueChange={onRoleChange}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="text-text"
            onClick={onSave}
            disabled={
              !firstName.trim() ||
              !lastName.trim() ||
              !selectedRoleId ||
              !selectedOrganizationId
            }
          >
           Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
