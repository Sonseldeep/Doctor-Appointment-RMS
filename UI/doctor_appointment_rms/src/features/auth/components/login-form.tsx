"use client";

import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added for seamless client-side routing
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { loginSchema } from "../schemas/auth.schema";
import type { LoginDto } from "../types/auth.types";

import { useLogin } from "../hooks/use-login";
import { useForgotPassword } from "../hooks/use-forgot-password";

export function LoginForm() {
  const loginMutation = useLogin();
  const forgotPassword = useForgotPassword();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginDto) => {
    loginMutation.mutate(values);
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email");
          router.push("/reset-password");
        },
        onError: () => {
          toast.error("Failed to send OTP");
        },
      }
    );
  };

  const isAuthError = loginMutation.isError;

  return (
    <Card className="w-full max-w-md shadow-xl border bg-background/95 backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>

        <CardDescription>
          Login to continue to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Email Field Panel */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              placeholder="john@example.com"
              autoComplete="email"
              className={`h-11 transition-colors ${
                isAuthError || form.formState.errors.email
                  ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                  : ""
              }`}
              {...form.register("email")}
              onChange={(e) => {
                form.setValue("email", e.target.value);
                setEmail(e.target.value);
              }}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field Panel with Visibility Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`h-11 pr-10 transition-colors ${
                  isAuthError || form.formState.errors.password
                    ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("password")}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}

            {isAuthError && !form.formState.errors.password && (
              <div className="flex items-start gap-1.5 mt-2 text-destructive animate-in fade-in duration-200">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                <span className="text-xs font-medium leading-relaxed">
                  Invalid Credentials. Please double check your entries.
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-11 w-full font-semibold"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Links Section (Forgot Password & Register) */}
          <div className="space-y-3 pt-1 text-center">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    type="button" 
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </DialogTrigger>

                <DialogContent className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>

                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button
                    className="w-full"
                    onClick={handleForgotPassword}
                    disabled={forgotPassword.isPending}
                  >
                    {forgotPassword.isPending
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/*  Register Redirect Context Link Row */}
            <div className="text-sm text-muted-foreground border-t pt-3 mt-1">
              {"Don't have an account? "}
              <Link 
                href="/register" 
                className="text-blue-600 hover:underline font-semibold transition-colors"
              >
                Register here
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}