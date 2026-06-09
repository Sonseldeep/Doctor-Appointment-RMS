
// "use client";

// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

// import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
// import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
// import { DoctorDashboard } from "@/features/dashboard/components/doctor-dashboard";
// import { UserDashboard } from "@/features/dashboard/components/user-dashboard";

// export default function DashboardPage() {
//   const { data: user, isLoading, isError } =
//     useCurrentUser();

//   if (isLoading) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           Loading dashboard...
//         </p>
//       </div>
//     );
//   }

//   if (isError || !user) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <p className="text-sm text-red-500">
//           Failed to load user session.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Welcome back 
//         </h1>

//         <p className="text-sm text-muted-foreground">
//           Role: {user.role}
//         </p>
//       </div>

//       {/* ROLE BASED DASHBOARD */}
//       {user.role === "Admin" && <AdminDashboard />}

//       {user.role === "Doctor" && <DoctorDashboard />}

//       {user.role === "Registered" && <UserDashboard />}
//     </div>
//   );
// }



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
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Role: {user.role}
        </p>
      </div>

      {/* ROLE BASED DASHBOARD */}
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