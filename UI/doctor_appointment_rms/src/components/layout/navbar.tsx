"use client";

import Link from "next/link";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function Navbar() {
  const { data: user } = useCurrentUser();

  const { logout } = useLogout();

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6">
      
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-bold text-blue-600">
          
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-10 w-10 cursor-pointer border">
  <AvatarImage
    src={user?.profilePhotoUrl || ""}
    alt={user?.firstName}
  />

  <AvatarFallback className="bg-blue-600 text-white">
    {initials || "U"}
  </AvatarFallback>
</Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user?.firstName} {user?.lastName}
                </span>

                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile">
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings">
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}