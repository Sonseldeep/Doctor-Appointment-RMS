"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      
      {/* ACCOUNT */}
      <Card>
        <CardHeader>
          <CardTitle>
            Account Settings
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences.
          </p>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle>
            Security
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}