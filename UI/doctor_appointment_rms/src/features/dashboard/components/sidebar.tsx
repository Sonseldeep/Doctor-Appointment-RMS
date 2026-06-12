// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useLogout } from "@/features/auth/hooks/use-logout";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import {
//   RiDashboardLine,
//   RiCalendarLine,
//   RiFileListLine,
//   RiCapsuleLine,
//   RiNotificationLine,
//   RiStethoscopeLine,
//   RiGroupLine,
//   RiBarChart2Line,
//   RiLogoutBoxLine,
// } from "@remixicon/react";

// export function Sidebar() {
//   const pathname = usePathname();
//   const { logout } = useLogout();
//   const { data: user } = useCurrentUser();

//   const userNavItems = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Appointments", href: "/dashboard/appointments", icon: <RiCalendarLine /> },
//     { label: "Medical Records", href: "/dashboard/medical-records", icon: <RiFileListLine /> },
//     { label: "Prescriptions", href: "/dashboard/prescriptions", icon: <RiCapsuleLine /> },
//     { label: "Notifications", href: "/dashboard/notifications", icon: <RiNotificationLine /> },
//     { label: "Doctors", href: "/dashboard/doctors", icon: <RiStethoscopeLine /> },
//   ];

//   const adminNavItems = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Doctor Management", href: "/dashboard/admin/doctors", icon: <RiStethoscopeLine /> },
//     { label: "Users", href: "/dashboard/admin/users", icon: <RiGroupLine /> },
//     { label: "Reports", href: "/dashboard/admin/reports", icon: <RiBarChart2Line /> },
    
//   ];

//   const navItems = user?.role === "Admin" ? adminNavItems : userNavItems;

//   const handleLogout = async () => {
//     await logout();
//   };

//   // Helper calculation to show a descriptive title based on user role
//   const getDashboardSubtitle = () => {
//     if (user?.role === "Admin") return "Admin Panel";
//     if (user?.role?.toLowerCase() === "doctor") return "Doctor Dashboard";
//     return "Patient Dashboard";
//   };

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
//       {/* Logo */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2"> 
//           <RiStethoscopeLine /> MediLink
//         </h2>
//         <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
//           {getDashboardSubtitle()}
//         </p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-2">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//           return (
//             <Link key={item.href} href={item.href}>
//               <button
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
//                   isActive
//                     ? "bg-blue-600 text-white font-medium shadow-sm"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="text-sm">{item.label}</span>
//               </button>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <Button
//         onClick={handleLogout}
//         variant="outline"
//         className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//       >
//         <RiLogoutBoxLine className="text-xl" />
//         Logout
//       </Button>
//     </aside>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import {
  RiDashboardLine,
  RiCalendarLine,
  RiFileListLine,
  RiCapsuleLine,
  RiNotificationLine,
  RiStethoscopeLine,
  RiGroupLine,
  RiBarChart2Line,
  RiLogoutBoxLine,
} from "@remixicon/react";

// 👈 Define an explicit NavItem interface to fix the type inference error
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { data: user } = useCurrentUser();
  const { unreadCount } = useNotifications();

  // 👈 Explicitly type the navigation array structures as NavItem[]
  const userNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
    { label: "Appointments", href: "/dashboard/appointments", icon: <RiCalendarLine /> },
    { label: "Medical Records", href: "/dashboard/medical-records", icon: <RiFileListLine /> },
    { label: "Prescriptions", href: "/dashboard/prescriptions", icon: <RiCapsuleLine /> },
    { label: "Notifications", href: "/dashboard/notifications", icon: <RiNotificationLine />, badge: unreadCount },
    { label: "Doctors", href: "/dashboard/doctors", icon: <RiStethoscopeLine /> },
  ];

  const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
    { label: "Doctor Management", href: "/dashboard/admin/doctors", icon: <RiStethoscopeLine /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <RiGroupLine /> },
    { label: "Reports", href: "/dashboard/admin/reports", icon: <RiBarChart2Line /> },
  ];

  const navItems = user?.role === "Admin" ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
  };

  const getDashboardSubtitle = () => {
    if (user?.role === "Admin") return "Admin Panel";
    if (user?.role?.toLowerCase() === "doctor") return "Doctor Dashboard";
    return "Patient Dashboard";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2"> 
          <RiStethoscopeLine /> MediLink
        </h2>
        <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
          {getDashboardSubtitle()}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-left ${
                  isActive
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </div>
                
                {/* 👈 TypeScript now safely recognizes item.badge as a number */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 font-bold rounded-full transition ${
                    isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <RiLogoutBoxLine className="text-xl" />
        Logout
      </Button>
    </aside>
  );
}