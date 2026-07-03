
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Sidebar } from "@/features/dashboard/components/sidebar"; // IMPORT THE SIDEBAR
import { Navbar } from "@/components/layout/navbar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/40">
      {/* SIDEBAR NAVIGATION REGION */}
      <Sidebar />

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1 pl-64">
        <Navbar />
        <div className="mx-auto max-w-3xl space-y-6 px-8 pt-8 pb-12">
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update security rules and account preferences.</p>
          </div>

          {/* ACCOUNT */}
          <Card className="shadow-sm bg-white">
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
          <Card className="shadow-sm bg-white">
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
      </main>
    </div>
  );
}