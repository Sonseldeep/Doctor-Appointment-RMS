"use client";

import { ReactNode } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { UserRole } from "@/features/auth/types/roles";

type Props = {
  allow: UserRole[];
  children: ReactNode;
};

export function RoleGuard({ allow, children }: Props) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return null;

  if (!user || !allow.includes(user.role)) {
    return (
      <div className="text-sm text-red-500">
        You don’t have access to this section.
      </div>
    );
  }

  return <>{children}</>;
}