
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useLogout } from "@/features/auth/hooks/use-logout";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useNotifications } from "@/features/notifications/hooks/use-notifications";
// import { PrescriptionHistoryModal } from "@/features/appointments/components/prescription-history-modal";
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

// interface NavItem {
//   label: string;
//   href: string;
//   icon: React.ReactNode;
//   badge?: number;
// }

// export function Sidebar() {
//   const pathname = usePathname();
//   const { logout } = useLogout();
//   const { data: user } = useCurrentUser();
//   const { unreadCount } = useNotifications();
  
//   // State for the Prescription Modal
//   const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

//   const userNavItems: NavItem[] = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Appointments", href: "/dashboard/appointments", icon: <RiCalendarLine /> },
//     { label: "Medical Records", href: "/dashboard/medical-records", icon: <RiFileListLine /> },
//     { label: "Prescriptions", href: "/dashboard/prescriptions", icon: <RiCapsuleLine /> },
//     { label: "Notifications", href: "/dashboard/notifications", icon: <RiNotificationLine />, badge: unreadCount },
//     { label: "Doctors", href: "/dashboard/doctors", icon: <RiStethoscopeLine /> },
//   ];

//   const adminNavItems: NavItem[] = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Doctor Management", href: "/dashboard/admin/doctors", icon: <RiStethoscopeLine /> },
//     { label: "Users", href: "/dashboard/admin/users", icon: <RiGroupLine /> },
//     { label: "Reports", href: "/dashboard/admin/reports", icon: <RiBarChart2Line /> },
//   ];

//   const navItems = user?.role === "Admin" ? adminNavItems : userNavItems;

//   const handleLogout = async () => {
//     await logout();
//   };

//   const getDashboardSubtitle = () => {
//     if (user?.role === "Admin") return "Admin Panel";
//     if (user?.role?.toLowerCase() === "doctor") return "Doctor Dashboard";
//     return "Patient Dashboard";
//   };

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2"> 
//           <RiStethoscopeLine /> MediLink
//         </h2>
//         <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
//           {getDashboardSubtitle()}
//         </p>
//       </div>

//       <nav className="flex-1 space-y-2">
//         {navItems.map((item) => {
//           // Logic for Prescriptions Button
//           if (item.label === "Prescriptions") {
//             return (
//               <button
//                 key={item.href}
//                 onClick={() => setIsPrescriptionModalOpen(true)}
//                 className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-gray-700 hover:bg-gray-100 text-left"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-xl">{item.icon}</span>
//                   <span className="text-sm">{item.label}</span>
//                 </div>
//               </button>
//             );
//           }

//           const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//           return (
//             <Link key={item.href} href={item.href}>
//               <button
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-left ${
//                   isActive
//                     ? "bg-blue-600 text-white font-medium shadow-sm"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-xl">{item.icon}</span>
//                   <span className="text-sm">{item.label}</span>
//                 </div>
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <span className={`text-xs px-2 py-0.5 font-bold rounded-full transition ${
//                     isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"
//                   }`}>
//                     {item.badge}
//                   </span>
//                 )}
//               </button>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Modal Component */}
//       <PrescriptionHistoryModal 
//         isOpen={isPrescriptionModalOpen} 
//         onClose={() => setIsPrescriptionModalOpen(false)} 
//       />

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

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useLogout } from "@/features/auth/hooks/use-logout";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useNotifications } from "@/features/notifications/hooks/use-notifications";
// import { PrescriptionHistoryModal } from "@/features/appointments/components/prescription-history-modal";
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

// interface NavItem {
//   label: string;
//   href: string;
//   icon: React.ReactNode;
//   badge?: number;
// }

// export function Sidebar() {
//   const pathname = usePathname();
//   const { logout } = useLogout();
//   const { data: user } = useCurrentUser();
//   const { unreadCount } = useNotifications();
  
//   const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

//   const userNavItems: NavItem[] = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Appointments", href: "/dashboard/appointments", icon: <RiCalendarLine /> },
//     { label: "Medical Records", href: "/dashboard/medical-records", icon: <RiFileListLine /> },
//     { label: "Prescriptions", href: "/dashboard/prescriptions", icon: <RiCapsuleLine /> },
//     { label: "Notifications", href: "/dashboard/notifications", icon: <RiNotificationLine />, badge: unreadCount },
//     { label: "Doctors", href: "/dashboard/doctors", icon: <RiStethoscopeLine /> },
//   ];

//   const adminNavItems: NavItem[] = [
//     { label: "Dashboard", href: "/dashboard", icon: <RiDashboardLine /> },
//     { label: "Doctor Management", href: "/dashboard/admin/doctors", icon: <RiStethoscopeLine /> },
//     { label: "Users", href: "/dashboard/admin/users", icon: <RiGroupLine /> },
//     { label: "Reports", href: "/dashboard/admin/reports", icon: <RiBarChart2Line /> },
//   ];

//   const navItems = user?.role === "Admin" ? adminNavItems : userNavItems;

//   const handleLogout = async () => {
//     await logout();
//   };

//   const getDashboardSubtitle = () => {
//     if (user?.role === "Admin") return "Admin Panel";
//     if (user?.role?.toLowerCase() === "doctor") return "Doctor Dashboard";
//     return "Patient Dashboard";
//   };

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between shadow-sm z-40 select-none">
//       {/* Top Branding Header */}
//       <div>
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 tracking-tight"> 
//             <RiStethoscopeLine className="w-7 h-7" /> MediLink
//           </h2>
//           <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
//             {getDashboardSubtitle()}
//           </p>
//         </div>

//         {/* Dynamic Navigation Links */}
//         <nav className="space-y-1.5">
//           {navItems.map((item) => {
//             // Check active safely without route overlapping matching on "/dashboard" root
//             const isActive = item.href === "/dashboard"
//               ? pathname === "/dashboard"
//               : pathname === item.href || pathname.startsWith(item.href + "/");

//             // Modal presentation for Prescriptions item
//             if (item.label === "Prescriptions") {
//               return (
//                 <button
//                   key={item.href}
//                   type="button"
//                   onClick={() => setIsPrescriptionModalOpen(true)}
//                   className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium group text-left"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xl text-slate-400 group-hover:text-blue-500 transition-colors">
//                       {item.icon}
//                     </span>
//                     <span className="text-sm">{item.label}</span>
//                   </div>
//                 </button>
//               );
//             }

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
//                     : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className={`text-xl transition-colors ${
//                     isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
//                   }`}>
//                     {item.icon}
//                   </span>
//                   <span>{item.label}</span>
//                 </div>
                
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <span className={`text-[11px] px-2 py-0.5 font-bold rounded-full transition-colors ${
//                     isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"
//                   }`}>
//                     {item.badge}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Modal and Bottom Action Anchor */}
//       <div>
//         <PrescriptionHistoryModal 
//           isOpen={isPrescriptionModalOpen} 
//           onClose={() => setIsPrescriptionModalOpen(false)} 
//         />

//         <Button
//           onClick={handleLogout}
//           variant="outline"
//           className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50/70 border-slate-200/80 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 mt-4"
//         >
//           <RiLogoutBoxLine className="text-lg" />
//           Logout
//         </Button>
//       </div>
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between shadow-sm z-40 select-none">
      {/* Top Branding Header */}
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 tracking-tight"> 
            <RiStethoscopeLine className="w-7 h-7" /> MediLink
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
            {getDashboardSubtitle()}
          </p>
        </div>
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between shadow-sm z-40 select-none">
      {/* Top Branding Header */}
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 tracking-tight"> 
            <RiStethoscopeLine className="w-7 h-7" /> MediLink
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
            {getDashboardSubtitle()}
          </p>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            // Check active safely without route overlapping matching on "/dashboard" root
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  <span className={`text-xl transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 font-bold rounded-full transition-colors ${
                  <span className={`text-[11px] px-2 py-0.5 font-bold rounded-full transition-colors ${
                    isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action Anchor */}
      {/* <div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50/70 border-slate-200/80 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 mt-4"
        >
          <RiLogoutBoxLine className="text-lg" />
          Logout
        </Button>
      </div> */}
    </aside>
  );
}