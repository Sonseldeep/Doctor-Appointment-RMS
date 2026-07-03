"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useChangePassword } from "../hooks/use-change-password";
import { changePasswordSchema, ChangePasswordDto } from "../schemas/change-password.schema";

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ChangePasswordDto>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordDto) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Current Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              className="pr-10"
              {...form.register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {form.formState.errors.currentPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.currentPassword.message}
            </p>
          )}

          {/* New Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="pr-10"
              {...form.register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.newPassword.message}
            </p>
          )}
          {/* Submit */}
          <Button
            className="w-full"
            type="submit"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending
              ? "Updating..."
              : "Change Password"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}