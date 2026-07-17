"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { DoctorDashboard } from "@/features/dashboard/components/doctor-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";
import { Loader2 } from "lucide-react"; 

function DashboardContent() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500">
        Unable to load user profile.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ROLE BASED DASHBOARDS */}
      {user.role === "Admin" && <AdminDashboard />}
      {user.role === "Doctor" && <DoctorDashboard />}
      {user.role === "Registered" && <UserDashboard />}
    </div>
  );
}

export default function DashboardPage() {
  
  return <DashboardContent />;
}