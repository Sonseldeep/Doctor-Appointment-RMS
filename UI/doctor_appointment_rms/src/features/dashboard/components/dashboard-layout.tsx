"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="p-8 text-sm text-slate-500 font-medium">Loading layout context...</div>;
  }

  if (!user) {
    return <div className="p-8 text-sm text-red-500 font-medium">Please log in</div>;
  }

  return (
    <div className="flex w-full">
      {/* Main Content Wrapper */}
      <div className="flex-1 w-full">
        {/* UPDATED: Removed duplicate fixed max-width limits and background gradients 
            so the dashboard elements can seamlessly stretch across your widescreen viewports. */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}