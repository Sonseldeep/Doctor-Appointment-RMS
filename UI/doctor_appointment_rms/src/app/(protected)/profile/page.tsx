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

import { 
  isDoctorProfile, 
  isPatientProfile 
} from "@/features/auth/types/auth.types";

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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* BASIC PROFILE CARD */}
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

          {/* BASIC USER INFO - COMMON FOR ALL ROLES */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-semibold text-lg">
              Basic Information
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  First Name
                </p>
                <p className="font-medium">
                  {user?.firstName || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Last Name
                </p>
                <p className="font-medium">
                  {user?.lastName || "—"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>
              <p className="font-medium">
                {user?.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Role
              </p>
              <p className="font-medium capitalize">
                {user?.role || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DOCTOR-SPECIFIC PROFILE CARD */}
      {user && isDoctorProfile(user) && (
        <Card className="shadow-sm border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">
              Professional Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Specialization
                </p>
                <p className="font-medium">
                  {user.specialization || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Consultation Fee
                </p>
                <p className="font-medium">
                  {user.consultationFee 
                    ? `$${user.consultationFee}` 
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>
                <p className="font-medium capitalize">
                  {user.status || "—"}
                </p>
              </div>
            </div>

            {user.bio && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Bio
                </p>
                <p className="font-medium whitespace-pre-wrap">
                  {user.bio}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PATIENT-SPECIFIC PROFILE CARD */}
      {user && isPatientProfile(user) && (
        <Card className="shadow-sm border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">
              Medical Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Gender
                </p>
                <p className="font-medium capitalize">
                  {user.sex || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Phone Number
                </p>
                <p className="font-medium">
                  {user.phoneNumber || "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">
                  Address
                </p>
                <p className="font-medium">
                  {user.address || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}