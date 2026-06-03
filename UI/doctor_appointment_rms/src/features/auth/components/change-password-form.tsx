"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useChangePassword } from "../hooks/use-change-password";
import { changePasswordSchema, ChangePasswordDto } from "../schemas/change-password.schema";

export function ChangePasswordForm() {
  const changePassword = useChangePassword();

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
          <Input
            type="password"
            placeholder="Current Password"
            {...form.register("currentPassword")}
          />
          {form.formState.errors.currentPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.currentPassword.message}
            </p>
          )}

          {/* New Password */}
          <Input
            type="password"
            placeholder="New Password"
            {...form.register("newPassword")}
          />
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