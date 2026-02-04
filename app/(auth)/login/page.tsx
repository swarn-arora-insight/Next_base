"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { loginApi } from "../api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setApiToken, setUser } from "@/redux/authSlice";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setEmailError("");
    setPasswordError("");
    setAuthError("");

    let isValid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    }
    if (!isValid) return;

    try {
      setIsLoading(true);

      const res = await loginApi({ email, password });
      dispatch(
        setUser({
          firstname: res.firstName,
          lastname: res.lastName,
        }),
      );

      if (res.token) {
        dispatch(setApiToken(res.token));
      }

      toast.success("Login successful");

      router.push("/dashboard");
    } catch (err) {
      setAuthError("Invalid email or password");
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Email */}
            <div className="grid gap-1">
              <Label className="mb-2">
                Username <span className="text-primary">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <span className="text-destructive text-xs">{emailError}</span>
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
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="example123"
                  className={`pr-10 ${passwordError ? "border-destructive" : ""}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {passwordError && (
                <span className="text-destructive text-xs">
                  {passwordError}
                </span>
              )}
            </div>

            {authError && (
              <p className="text-destructive text-sm text-center">
                {authError}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 rounded-full bg-primary hover:bg-primary/80"
            >
              {isLoading ? (
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
