"use client";

import React, { useEffect } from "react";

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
import { useCreateRole } from "../api";
import { toast } from "sonner";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  roleName?: string;
}

const RequiredStar = () => <span className="text-destructive ml-0.5">*</span>;

export function AddRoleDialog({ open, onOpenChange }: AddRoleDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const { mutate: createRole } = useCreateRole();
  const validateRoleName = (value: string): string | undefined => {
    if (!value.trim()) return "Role name is required";
    if (value.trim().length < 2)
      return "Role name must be at least 2 characters";
    return undefined;
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    if (field === "roleName") {
      const error = validateRoleName(value);
      if (error) newErrors.roleName = error;
      else delete newErrors.roleName;
    }
    setErrors(newErrors);
  };

  const handleFieldChange = (
    field: string,
    value: string,
    setter: (val: string) => void,
  ) => {
    setter(value);
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const roleNameError = validateRoleName(roleName);
    if (roleNameError) newErrors.roleName = roleNameError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!validateForm()) return;
    createRole(
      {
        role_name: roleName,
      },
      {
        onSuccess: (response) => {
          console.log(response);
          if (response.header.code !== 200) {
            toast.warning(
              response?.header.message ||
                response?.response?.message ||
                "Something went wrong",
            );
            return;
          }
          toast.success("Role created successfully");
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };
  const resetForm = () => {
    setRoleName("");
    setErrors({});
    setTouched(false);
    setFieldTouched({});
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const showError = (field: string) =>
    (touched || fieldTouched[field]) && errors[field as keyof FormErrors];

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
                Create a new role for your organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name" className="text-foreground">
                Role Name
                <RequiredStar />
              </Label>
              <Input
                id="role-name"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) =>
                  handleFieldChange("roleName", e.target.value, setRoleName)
                }
                className={`bg-background text-foreground ${showError("roleName") ? "border-destructive" : ""}`}
              />
              {showError("roleName") && (
                <p className="text-xs text-destructive">{errors.roleName}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="text-text">
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
