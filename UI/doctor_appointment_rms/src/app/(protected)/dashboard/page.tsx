// "use client";

// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

// export default function DashboardPage() {
//   const { data: user, isLoading, isError } = useCurrentUser();

//   if (isLoading) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <p className="text-sm text-muted-foreground">Loading dashboard...</p>
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
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Welcome back 👋
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Here’s your system overview
//         </p>
//       </div>

//       {/* User Info Card */}
//       <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-black">
//         <h2 className="text-lg font-medium">Your Profile</h2>

//         <div className="mt-4 space-y-2 text-sm">
//           <p>
//             <span className="font-medium">Name:</span>{" "}
//   {(user?.firstName || user?.lastName)
//     ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
//     : "N/A"}
//           </p>

//           <p>
//             <span className="font-medium">Email:</span>{" "}
//             {user?.email ?? "N/A"}
//           </p>

//           <p>
//             <span className="font-medium">Role:</span>{" "}
//             {user?.role ?? "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* Placeholder Stats */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <div className="rounded-xl border p-5">
//           <p className="text-sm text-muted-foreground">Total Appointments</p>
//           <p className="text-2xl font-semibold">12</p>
//         </div>

//         <div className="rounded-xl border p-5">
//           <p className="text-sm text-muted-foreground">Pending</p>
//           <p className="text-2xl font-semibold">3</p>
//         </div>

//         <div className="rounded-xl border p-5">
//           <p className="text-sm text-muted-foreground">Completed</p>
//           <p className="text-2xl font-semibold">9</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { DoctorDashboard } from "@/features/dashboard/components/doctor-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";

export default function DashboardPage() {
  const { data: user, isLoading, isError } =
    useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load user session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back 👋
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