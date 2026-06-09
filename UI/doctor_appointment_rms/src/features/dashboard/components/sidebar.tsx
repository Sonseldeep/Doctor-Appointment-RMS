"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { data: user } = useCurrentUser();

  const userNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Appointments", href: "/dashboard/appointments", icon: "📅" },
    { label: "Medical Records", href: "/dashboard/medical-records", icon: "📋" },
    { label: "Prescriptions", href: "/dashboard/prescriptions", icon: "💊" },
    { label: "Notifications", href: "/dashboard/notifications", icon: "🔔" },
  ];

  const adminNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Doctor Management", href: "/dashboard/admin/doctors", icon: "👨‍⚕️" },
    { label: "Users", href: "/dashboard/admin/users", icon: "👥" },
    { label: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
  ];

  const navItems = user?.role === "Admin" ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600">🏥 MediLink</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {user?.role === "Admin" ? "Admin Panel" : "Patient Dashboard"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
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
        <span>👋</span>
        Logout
      </Button>
    </aside>
  );
}