"use client";

import { useLogout } from "@/features/auth/hooks/use-logout";

export function Navbar() {
  const { logout } = useLogout();

  return (
    <nav className="flex h-14 items-center justify-between border-b px-6 bg-white">
      <div className="font-semibold">Dashboard</div>

      <button
        onClick={logout}
        className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}