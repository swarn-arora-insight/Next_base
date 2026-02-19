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
import { Building2 } from "lucide-react";
import { useCreateOrg } from "../api";
import { toast } from "sonner";

interface AddOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequiredStar = () => <span className="text-destructive ml-0.5">*</span>;

export function AddOrganizationDialog({
  open,
  onOpenChange,
}: AddOrganizationDialogProps) {
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [fieldTouched, setFieldTouched] = useState(false);
  const { mutate: createOrg, isPending } = useCreateOrg();

  const validateOrgName = (value: string): string => {
    if (!value.trim()) return "Organization name is required";
    if (value.trim().length < 2)
      return "Organization name must be at least 2 characters";
    return "";
  };

  const handleFieldChange = (value: string) => {
    setOrgName(value);
    setFieldTouched(true);
    setError(validateOrgName(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validationError = validateOrgName(orgName);
    setError(validationError);
    if (validationError) return;

    createOrg(
      {
        org_name: orgName.trim(),
      },
      {
        onSuccess: (response) => {
          console.log(response)
          if (response.header.code !== 200) {
                    toast.warning(
                      response?.header.message ||
                        response?.response?.message ||
                        "Something went wrong",
                    );
                    return;
                  }
          toast.success("Organization created successfully");
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  const resetForm = () => {
    setOrgName("");
    setError("");
    setTouched(false);
    setFieldTouched(false);
  };

  useEffect(() => {
  if (open) {
    resetForm();
  }
}, [open]);

  const showError = (touched || fieldTouched) && error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">
                Add Organization
              </DialogTitle>
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
                <RequiredStar />
              </Label>
              <Input
                id="org-name"
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => handleFieldChange(e.target.value)}
                className={`bg-background text-foreground ${showError ? "border-destructive" : ""}`}
              />
              {showError && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="text-text">
              Create Organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
