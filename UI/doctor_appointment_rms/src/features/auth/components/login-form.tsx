
"use client";

import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
        {loginMutation.isError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Invalid credentials. Please try again.
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              placeholder="john@example.com"
              autoComplete="email"
              className="h-11"
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

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-11 w-full"
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

          {/* Forgot Password */}
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-blue-600 hover:underline">
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
        </form>
      </CardContent>
    </Card>
  );
}