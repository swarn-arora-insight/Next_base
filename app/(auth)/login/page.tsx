"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { signIn } from "@/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const VALID_EMAIL = "amit123@gmail.com";
  const VALID_PASSWORD = "amit123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      document.cookie = "auth=true; path=/";
      router.push("/dashboard");
    } else {
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-lg sm:min-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center  ">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("google")}
            >
              <Icons.google className="w-4 h-4 mr-2" />
              Login with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="example123"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
