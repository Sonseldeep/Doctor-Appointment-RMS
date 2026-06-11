"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUploadProfilePhoto } from "@/features/auth/hooks/use-upload-profile-photo";
import { useUpdatePatientProfile, useUpdateDoctorProfile } from "@/features/auth/hooks/use-update-profile";
import { isDoctorProfile, isPatientProfile } from "@/features/auth/types/auth.types";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const { mutate: uploadPhoto, isPending: isPhotoUploading } = useUploadProfilePhoto();
  
  const updatePatient = useUpdatePatientProfile();
  const updateDoctor = useUpdateDoctorProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [patientForm, setPatientForm] = useState({ phoneNumber: "", address: "", sex: "Unknown" });
  const [doctorForm, setDoctorForm] = useState({ bio: "", specialization: "General", consultationFee: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  useEffect(() => {
    if (user) {
      if (isPatientProfile(user)) {
        setPatientForm({
          phoneNumber: user.phoneNumber || "",
          address: user.address || "",
          sex: user.sex || "Unknown",
        });
      }
      if (isDoctorProfile(user)) {
        setDoctorForm({
          bio: user.bio || "",
          specialization: user.specialization || "General",
          consultationFee: user.consultationFee || 0,
        });
      }
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      if (isPatientProfile(user)) {
        await updatePatient.mutateAsync(patientForm);
      } else if (isDoctorProfile(user)) {
        await updateDoctor.mutateAsync(doctorForm);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to commit profile updates:", err);
    }
  };

  const isSaving = updatePatient.isPending || updateDoctor.isPending;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your digital account details and profile fields.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="default" className="shadow-sm">
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" disabled={isSaving} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* CORE IDENTITY CARD */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
              <AvatarImage src={user?.profilePhotoUrl || ""} alt={user?.firstName} />
              <AvatarFallback className="text-xl font-semibold bg-slate-100 text-slate-700">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm font-medium text-slate-500 capitalize">{user?.role} Account Registry</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <Button type="button" variant="outline" size="sm" disabled={isPhotoUploading} onClick={() => fileInputRef.current?.click()}>
                {isPhotoUploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 border-t pt-5 md:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">System Account Access Email</p>
              <p className="font-medium text-gray-900 mt-1">{user?.email || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DOCTOR-SPECIFIC PROFESSIONAL PROFILE VIEW */}
      {user && isDoctorProfile(user) && (
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100/40">
            <CardTitle className="text-lg text-blue-900 font-bold">Professional System Attributes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clinical Area Specialization</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-1.5">{user.specialization || "General"}</p>
                ) : (
                  <Input 
                    className="mt-1" 
                    value={doctorForm.specialization} 
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} 
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Consultation Fee Rate ($)</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-1.5">{user.consultationFee ? `$${user.consultationFee}` : "$0"}</p>
                ) : (
                  <Input 
                    type="number" 
                    className="mt-1" 
                    value={doctorForm.consultationFee} 
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: Number(e.target.value) })} 
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Practitioner Statement Biography</label>
              {!isEditing ? (
                <p className="font-medium text-gray-700 whitespace-pre-wrap bg-slate-50 border p-3 rounded-xl mt-1.5 italic">
                  {user.bio || "No professional biography ledger filed."}
                </p>
              ) : (
                <textarea 
                  rows={4} 
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1 border-slate-200" 
                  value={doctorForm.bio} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDoctorForm({ ...doctorForm, bio: e.target.value })} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PATIENT-SPECIFIC PROFILE VIEW */}
      {user && isPatientProfile(user) && (
        <Card className="shadow-sm border-emerald-100">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/40">
            <CardTitle className="text-lg text-emerald-900 font-bold">Medical Record Profile Ledger</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Assigned Gender</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-1.5 capitalize">{user.sex || "Unknown"}</p>
                ) : (
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm mt-1 outline-none focus:ring-1 focus:ring-slate-400"
                    value={patientForm.sex}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPatientForm({ ...patientForm, sex: e.target.value })}
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Primary Contact Phone Number</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-1.5">{user.phoneNumber || "—"}</p>
                ) : (
                  <Input 
                    className="mt-1" 
                    value={patientForm.phoneNumber} 
                    onChange={(e) => setPatientForm({ ...patientForm, phoneNumber: e.target.value })} 
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Residential Location Address</label>
              {!isEditing ? (
                <p className="font-semibold text-gray-800 mt-1.5">{user.address || "—"}</p>
              ) : (
                <Input 
                  className="mt-1" 
                  value={patientForm.address} 
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}