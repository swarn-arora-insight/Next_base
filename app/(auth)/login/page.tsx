"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { loginApi } from "../api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setApiToken, setUser } from "@/redux/authSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginApi(data);

      dispatch(
        setUser({
          firstname: res.firstName,
          lastname: res.lastName,
        })
      );

      if (res.token) {
        dispatch(setApiToken(res.token));
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch {
      setError("root", {
        message: "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-lg sm:min-w-sm">
        <CardHeader className="flex flex-col items-center gap-1">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <CardTitle className="text-2xl text-center font-semibold">
            Nextbase
          </CardTitle>
          <p className="text-lg text-center font-semibold text-muted-foreground">
            Login
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">

            {/* Email */}
            <div className="grid gap-1">
              <Label className="mb-2">
                Username <span className="text-primary">*</span>
              </Label>

              <Input
                type="email"
                placeholder="m@example.com"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email is required",
                })}
                className={errors.email ? "border-destructive" : ""}
              />

              {errors.email && (
                <span className="text-destructive text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <Label className="mb-2">
                Password <span className="text-primary">*</span>
              </Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="example123"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="text-destructive text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Auth Error */}
            {errors.root && (
              <p className="text-destructive text-sm text-center">
                {errors.root.message}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 rounded-full bg-primary hover:bg-primary/80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
