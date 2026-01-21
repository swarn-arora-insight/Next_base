"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { setToken } from "@/utils/storage";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const VALID_EMAIL = "amit123@gmail.com";
  const VALID_PASSWORD = "amit123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setAuthError("Invalid email or password");
      return;
    }
    setToken("logged-in");
    router.push("/dashboard");
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
            <div className="grid gap-1">
              <Label className="gap-1 mb-2">
                Username
                <span className="text-primary">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className={
                  emailError ? "border-destructive focus-visible:ring-destructive" : ""
                }
              />
              {emailError && (
                <span className="text-destructive text-xs">{emailError}</span>
              )}
            </div>

            <div className="grid gap-1">
              <Label className="gap-1 mb-2">
                Password <span className="text-primary">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="example123"
                  className={`pr-10 ${
                    passwordError
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide" : "Show"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {passwordError && (
                <span className="text-destructive text-xs">{passwordError}</span>
              )}
            </div>

            {/* AUTH ERROR */}
            {authError && (
              <p className="text-destructive text-sm text-center">{authError}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-3 rounded-full bg-primary text-text hover:bg-primary/80"
            >
              <LogIn />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
