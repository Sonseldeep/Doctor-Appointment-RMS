"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              First Name
            </p>

            <p className="font-medium">
              {user?.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Name
            </p>

            <p className="font-medium">
              {user?.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="font-medium">
              {user?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Role
            </p>

            <p className="font-medium">
              {user?.role}
            </p>
          </div>

          {/* <div>
            <p className="text-sm text-muted-foreground">
              User ID
            </p>

            <p className="font-medium break-all">
              {user?.id}
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}