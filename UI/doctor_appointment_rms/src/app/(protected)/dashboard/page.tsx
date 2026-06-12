"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { DoctorDashboard } from "@/features/dashboard/components/doctor-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";

function DashboardContent() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
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
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}