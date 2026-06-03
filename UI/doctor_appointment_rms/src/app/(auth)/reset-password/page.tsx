"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useResetPassword } from "@/features/auth/hooks/use-reset-password";

export default function ResetPasswordPage() {
  const resetPassword = useResetPassword();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    resetPassword.mutate(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <Input
            name="otp"
            placeholder="OTP"
            onChange={handleChange}
          />

          <Input
            type="password"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}