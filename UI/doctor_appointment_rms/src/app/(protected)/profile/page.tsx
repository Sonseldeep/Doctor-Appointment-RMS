"use client";

import { useRef } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { useUploadProfilePhoto } from "@/features/auth/hooks/use-upload-profile-photo";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();

  const { mutate: uploadPhoto, isPending } =
    useUploadProfilePhoto();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const initials =
    `${user?.firstName?.[0] ?? ""}${
      user?.lastName?.[0] ?? ""
    }`;

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadPhoto(file);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            My Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          
          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28 border">
              <AvatarImage
                src={user?.profilePhotoUrl || ""}
                alt={user?.firstName}
              />

              <AvatarFallback className="text-lg">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              {isPending
                ? "Uploading..."
                : "Change Photo"}
            </Button>
          </div>

          {/* USER INFO */}
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