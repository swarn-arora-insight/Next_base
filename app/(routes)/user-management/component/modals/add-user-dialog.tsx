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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Eye, EyeOff } from "lucide-react";
import { roleList, useCreateUser, useOrgList } from "../api";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const { mutate: createUser, isPending } = useCreateUser();
  const { data: roleData } = roleList();
  const { data: orgData } = useOrgList();
  const roles = Array.isArray(roleData) ? roleData : [];
  const organizations = Array.isArray(orgData) ? orgData : [];

  const validatePassword = (pwd: string): string | undefined => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must include at least one uppercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must include at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd))
      return "Password must include at least one special character";
    return undefined;
  };

  const validateField = (
    field: string,
    value: string,
    allValues?: { password?: string; confirmPassword?: string },
  ) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = "First name is required";
        else delete newErrors.firstName;
        break;
      case "lastName":
        if (!value.trim()) newErrors.lastName = "Last name is required";
        else delete newErrors.lastName;
        break;
      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Please enter a valid email";
        else delete newErrors.email;
        break;
      case "organization":
        if (!value) newErrors.organization = "Organization is required";
        else delete newErrors.organization;
        break;
      case "role":
        if (!value) newErrors.role = "Role is required";
        else delete newErrors.role;
        break;
      case "password":
        const passwordError = validatePassword(value);
        if (passwordError) newErrors.password = passwordError;
        else delete newErrors.password;
        // Also validate confirm password if it has been touched
        if (fieldTouched.confirmPassword || touched) {
          const confirmPwd = allValues?.confirmPassword || confirmPassword;
          if (confirmPwd && value !== confirmPwd)
            newErrors.confirmPassword = "Passwords do not match";
          else if (confirmPwd && value === confirmPwd)
            delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        const pwd = allValues?.password || password;
        if (!value) newErrors.confirmPassword = "Please confirm your password";
        else if (pwd !== value)
          newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
        break;
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

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!selectedOrganization)
      newErrors.organization = "Organization is required";
    if (!selectedRole) newErrors.role = "Role is required";

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validateForm()) return;

    createUser(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        org_id: selectedOrganization,
        role_id: selectedRole,
        email_address: email.trim(),
        password,
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
          toast.success("User Created successfully");
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedOrganization("");
    setSelectedRole("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setTouched(false);
    setFieldTouched({});
  };
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);
  const RequiredStar = () => <span className="text-destructive ml-0.5">*</span>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="mt-4" autoComplete="off">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-foreground">
                  First Name
                  <RequiredStar />
                </Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value, setFirstName)
                  }
                  className={`bg-background text-foreground ${(touched || fieldTouched.firstName) && errors.firstName ? "border-destructive" : ""}`}
                />
                {(touched || fieldTouched.firstName) && errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-foreground">
                  Last Name
                  <RequiredStar />
                </Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value, setLastName)
                  }
                  className={`bg-background text-foreground ${(touched || fieldTouched.lastName) && errors.lastName ? "border-destructive" : ""}`}
                />
                {(touched || fieldTouched.lastName) && errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
                <RequiredStar />
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                autoComplete="new-email"
                value={email}
                onChange={(e) =>
                  handleFieldChange("email", e.target.value, setEmail)
                }
                className={`bg-background text-foreground ${(touched || fieldTouched.email) && errors.email ? "border-destructive" : ""}`}
              />
              {(touched || fieldTouched.email) && errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-foreground">
                Organization
                <RequiredStar />
              </Label>
              <Select
                value={selectedOrganization}
                onValueChange={(value) => {
                  setSelectedOrganization(value);
                  setFieldTouched((prev) => ({ ...prev, organization: true }));
                  validateField("organization", value);
                }}
              >
                <SelectTrigger
                  className={`w-full bg-background text-foreground ${(touched || fieldTouched.organization) && errors.organization ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org: any) => (
                    <SelectItem key={org.org_id} value={org.org_id}>
                      {org.org_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(touched || fieldTouched.organization) &&
                errors.organization && (
                  <p className="text-xs text-destructive">
                    {errors.organization}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">
                Role
                <RequiredStar />
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setFieldTouched((prev) => ({ ...prev, role: true }));
                  validateField("role", value);
                }}
              >
                <SelectTrigger
                  className={`w-full bg-background text-foreground ${(touched || fieldTouched.role) && errors.role ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(touched || fieldTouched.role) && errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
                <RequiredStar />
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    setFieldTouched((prev) => ({ ...prev, password: true }));
                    validateField("password", value, { confirmPassword });
                  }}
                  className={`bg-background text-foreground pr-10 ${(touched || fieldTouched.password) && errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {(touched || fieldTouched.password) && errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Min 8 characters with uppercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">
                Confirm Password
                <RequiredStar />
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    setFieldTouched((prev) => ({
                      ...prev,
                      confirmPassword: true,
                    }));
                    validateField("confirmPassword", value, { password });
                  }}
                  className={`bg-background text-foreground pr-10 ${(touched || fieldTouched.confirmPassword) && errors.confirmPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {(touched || fieldTouched.confirmPassword) &&
                errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="text-text">
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
