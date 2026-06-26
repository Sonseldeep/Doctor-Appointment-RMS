// "use client";

// import { useRef, useState, useEffect } from "react";
// import { toast } from "sonner"; // IMPORT TOASTER UTILITY
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { useUploadProfilePhoto } from "@/features/auth/hooks/use-upload-profile-photo";
// import { 
//   useUpdatePatientProfile, 
//   useCreateDoctorProfile, 
//   useUpdateDoctorProfile  
// } from "@/features/auth/hooks/use-update-profile";
// import { isDoctorProfile, isPatientProfile, DoctorProfile } from "@/features/auth/types/auth.types";

// export default function ProfilePage() {
//   const { data: user } = useCurrentUser();
//   const { mutate: uploadPhoto, isPending: isPhotoUploading } = useUploadProfilePhoto();
  
//   const updatePatient = useUpdatePatientProfile();
//   const createDoctor = useCreateDoctorProfile(); 
//   const updateDoctor = useUpdateDoctorProfile(); 

//   const [isEditing, setIsEditing] = useState(false);
//   const [patientForm, setPatientForm] = useState({ phoneNumber: "", address: "", sex: "Unknown" });
//   const [doctorForm, setDoctorForm] = useState({ nmcNumber: "", bio: "", specialization: "General", consultationFee: 0 });

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

//   const isDoctor = user && isDoctorProfile(user);
//   const hasDoctorProfileRecord = isDoctor && !!(user as DoctorProfile).doctorProfileId;

//   useEffect(() => {
//     if (user) {
//       if (isPatientProfile(user)) {
//         setPatientForm({
//           phoneNumber: user.phoneNumber || "",
//           address: user.address || "",
//           sex: user.sex || "Unknown",
//         });
//       }
//       if (isDoctorProfile(user)) {
//         setDoctorForm({
//           nmcNumber: (user as DoctorProfile).nmcNumber || "",
//           bio: user.bio || "",
//           specialization: user.specialization || "General",
//           consultationFee: user.consultationFee || 0,
//         });
//       }
//     }
//   }, [user]);

//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       uploadPhoto(file, {
//         onSuccess: () => toast.success("Profile photo updated successfully!"),
//         onError: () => toast.error("Failed to upload profile photo."),
//       });
//     }
//   };

//   // ENHANCED TRANSACTION HANDLER WITH ADAPTIVE TOAST CHANNELS
//   const handleSaveProfile = async () => {
//     if (!user) return;
//     try {
//       if (isPatientProfile(user)) {
//         await updatePatient.mutateAsync(patientForm);
//         toast.success("Medical record profile updated successfully!");
//       } else if (isDoctorProfile(user)) {
//         const cleanFee = Number(doctorForm.consultationFee) || 0;

//         if (hasDoctorProfileRecord) {
//           // EDIT PIPELINE
//           await updateDoctor.mutateAsync({
//             bio: doctorForm.bio,
//             specialization: doctorForm.specialization,
//             consultationFee: cleanFee,
//           });
//           toast.success("Professional system attributes updated successfully!");
//         } else {
//           // CREATION PIPELINE
//           if (!doctorForm.nmcNumber.trim()) {
//             toast.error("NMC Registration Number is required to complete setup.");
//             return;
//           }
//           await createDoctor.mutateAsync({
//             nmcNumber: doctorForm.nmcNumber,
//             bio: doctorForm.bio,
//             specialization: doctorForm.specialization,
//             consultationFee: cleanFee,
//           });
//           toast.success("Doctor profile created and verified successfully!");
//         }
//       }
//       setIsEditing(false);
//     } catch (err: any) {
//       console.error("Failed to commit profile updates:", err);

//       // PARSE DETAILED SERVER VALIDATION ERRORS OUT OF AXIOS OBJECTS
//       let fallbackErrorMessage = "Failed to save profile changes. Please try again.";
      
//       if (err?.response?.data) {
//         const data = err.response.data;
//         // Handles cases where backend sends structured arrays or simple strings
//         if (typeof data.message === "string") {
//           fallbackErrorMessage = data.message;
//         } else if (Array.isArray(data.message)) {
//           fallbackErrorMessage = data.message.join(", ");
//         } else if (data.title) {
//           fallbackErrorMessage = data.title;
//         }
//       }

//       toast.error(fallbackErrorMessage, {
//         description: "Status Code: " + (err?.response?.status || "Network Error"),
//       });
//     }
//   };

//   const isSaving = updatePatient.isPending || createDoctor.isPending || updateDoctor.isPending;

//   return (
//     <div className="mx-auto max-w-3xl space-y-6 pb-12">
//       <div className="flex items-center justify-between border-b pb-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
//           <p className="text-sm text-muted-foreground mt-0.5">Manage your digital account details and profile fields.</p>
//         </div>
        
//         {!isEditing ? (
//           <Button onClick={() => setIsEditing(true)} variant="default" className="shadow-sm">
//             {isDoctor && !hasDoctorProfileRecord ? "Setup Profile" : "Edit Profile"}
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button variant="outline" disabled={isSaving} onClick={() => setIsEditing(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
//               {isSaving 
//                 ? "Saving..." 
//                 : isDoctor && !hasDoctorProfileRecord 
//                   ? "Create Profile" 
//                   : "Save Changes"}
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* CORE IDENTITY CARD */}
//       <Card className="shadow-sm">
//         <CardContent className="pt-6 space-y-6">
//           <div className="flex flex-col sm:flex-row items-center gap-5">
//             <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
//               <AvatarImage src={user?.profilePhotoUrl || ""} alt={user?.firstName} />
//               <AvatarFallback className="text-xl font-semibold bg-slate-100 text-slate-700">{initials || "U"}</AvatarFallback>
//             </Avatar>
//             <div className="text-center sm:text-left space-y-1.5">
//               <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
//               <p className="text-sm font-medium text-slate-500 capitalize">{user?.role}</p>
//               <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
//               <Button type="button" variant="outline" size="sm" disabled={isPhotoUploading} onClick={() => fileInputRef.current?.click()}>
//                 {isPhotoUploading ? "Uploading..." : "Change Photo"}
//               </Button>
//             </div>
//           </div>

//           <div className="grid gap-4 border-t pt-5 md:grid-cols-2 text-sm">
//             <div>
//               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Access Email</p>
//               <p className="font-medium text-gray-900 mt-1">{user?.email || "—"}</p>
//             </div>
            
//             {/* --- DYNAMIC STATUS BLOCK FOR DOCTORS --- */}
//             {isDoctor && (
//               <div>
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Profile Status</p>
//                 <div className="mt-1">
//                   {hasDoctorProfileRecord ? (
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
//                       (user as any).status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                         : "bg-amber-50 text-amber-700 border-amber-200"
//                     }`}>
//                       {(user as any).status || "Active"}
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
//                       Pending Setup
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* DOCTOR-SPECIFIC PROFESSIONAL PROFILE VIEW */}
//       {user && isDoctorProfile(user) && (
//         <Card className="shadow-sm border-blue-100">
//           <CardHeader className="bg-blue-50/50 border-b border-blue-100/40">
//             <CardTitle className="text-lg text-blue-900 font-bold">Professional System Attributes</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-6 space-y-5">
//             <div className="grid gap-5 md:grid-cols-2">
              
//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">NMC Registration Number</label>
//                 {!isEditing ? (
//                   <p className="font-semibold text-gray-800 mt-1.5">{(user as DoctorProfile).nmcNumber || "—"}</p>
//                 ) : (
//                   <Input 
//                     className="mt-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" 
//                     placeholder="Enter NMC Number"
//                     value={doctorForm.nmcNumber} 
//                     disabled={hasDoctorProfileRecord}
//                     onChange={(e) => setDoctorForm({ ...doctorForm, nmcNumber: e.target.value })} 
//                   />
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clinical Area Specialization</label>
//                 {!isEditing ? (
//                   <p className="font-semibold text-gray-800 mt-1.5">{user.specialization || "General"}</p>
//                 ) : (
//                   <Input 
//                     className="mt-1" 
//                     value={doctorForm.specialization} 
//                     onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} 
//                   />
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Consultation Fee Rate ($)</label>
//                 {!isEditing ? (
//                   <p className="font-semibold text-gray-800 mt-1.5">{user.consultationFee ? `$${user.consultationFee}` : "$0"}</p>
//                 ) : (
//                   <Input 
//                     type="number" 
//                     className="mt-1" 
//                     value={doctorForm.consultationFee} 
//                     onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: Number(e.target.value) })} 
//                   />
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Practitioner Statement Biography</label>
//               {!isEditing ? (
//                 <p className="font-medium text-gray-700 whitespace-pre-wrap bg-slate-50 border p-3 rounded-xl mt-1.5 italic">
//                   {user.bio || "No professional biography ledger filed."}
//                 </p>
//               ) : (
//                 <textarea 
//                   rows={4} 
//                   className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-1 border-slate-200" 
//                   value={doctorForm.bio} 
//                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDoctorForm({ ...doctorForm, bio: e.target.value })} 
//                 />
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* PATIENT-SPECIFIC PROFILE VIEW */}
//       {user && isPatientProfile(user) && (
//         <Card className="shadow-sm border-emerald-100">
//           <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/40">
//             <CardTitle className="text-lg text-emerald-900 font-bold">Medical Record Profile Ledger</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-6 space-y-5">
//             <div className="grid gap-5 md:grid-cols-2">
//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gender</label>
//                 {!isEditing ? (
//                   <p className="font-semibold text-gray-800 mt-1.5 capitalize">{user.sex || "Unknown"}</p>
//                 ) : (
//                   <select
//                     className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm mt-1 outline-none focus:ring-1 focus:ring-slate-400"
//                     value={patientForm.sex}
//                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPatientForm({ ...patientForm, sex: e.target.value })}
//                   >
//                     <option value="Unknown">Unknown</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                   </select>
//                 )}
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Primary Contact Phone Number</label>
//                 {!isEditing ? (
//                   <p className="font-semibold text-gray-800 mt-1.5">{user.phoneNumber || "—"}</p>
//                 ) : (
//                   <Input 
//                     className="mt-1" 
//                     value={patientForm.phoneNumber} 
//                     onChange={(e) => setPatientForm({ ...patientForm, phoneNumber: e.target.value })} 
//                   />
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Residential Location Address</label>
//               {!isEditing ? (
//                 <p className="font-semibold text-gray-800 mt-1.5">{user.address || "—"}</p>
//                 ) : (
//                 <Input 
//                   className="mt-1" 
//                   value={patientForm.address} 
//                   onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })} 
//                 />
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner"; // IMPORT TOASTER UTILITY
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUploadProfilePhoto } from "@/features/auth/hooks/use-upload-profile-photo";
import { 
  useUpdatePatientProfile, 
  useCreateDoctorProfile, 
  useUpdateDoctorProfile  
} from "@/features/auth/hooks/use-update-profile";
import { isDoctorProfile, isPatientProfile, DoctorProfile } from "@/features/auth/types/auth.types";
import { Sidebar } from "@/features/dashboard/components/sidebar"; // IMPORT THE SIDEBAR

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const { mutate: uploadPhoto, isPending: isPhotoUploading } = useUploadProfilePhoto();
  
  const updatePatient = useUpdatePatientProfile();
  const createDoctor = useCreateDoctorProfile(); 
  const updateDoctor = useUpdateDoctorProfile(); 

  const [isEditing, setIsEditing] = useState(false);
  const [patientForm, setPatientForm] = useState({ phoneNumber: "", address: "", sex: "Unknown" });
  const [doctorForm, setDoctorForm] = useState({ nmcNumber: "", bio: "", specialization: "General", consultationFee: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  const isDoctor = user && isDoctorProfile(user);
  const hasDoctorProfileRecord = isDoctor && !!(user as DoctorProfile).doctorProfileId;

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
          nmcNumber: (user as DoctorProfile).nmcNumber || "",
          bio: user.bio || "",
          specialization: user.specialization || "General",
          consultationFee: user.consultationFee || 0,
        });
      }
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto(file, {
        onSuccess: () => toast.success("Profile photo updated successfully!"),
        onError: () => toast.error("Failed to upload profile photo."),
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      if (isPatientProfile(user)) {
        await updatePatient.mutateAsync(patientForm);
        toast.success("Medical record profile updated successfully!");
      } else if (isDoctorProfile(user)) {
        const cleanFee = Number(doctorForm.consultationFee) || 0;

        if (hasDoctorProfileRecord) {
          await updateDoctor.mutateAsync({
            bio: doctorForm.bio,
            specialization: doctorForm.specialization,
            consultationFee: cleanFee,
          });
          toast.success("Professional system attributes updated successfully!");
        } else {
          if (!doctorForm.nmcNumber.trim()) {
            toast.error("NMC Registration Number is required to complete setup.");
            return;
          }
          await createDoctor.mutateAsync({
            nmcNumber: doctorForm.nmcNumber,
            bio: doctorForm.bio,
            specialization: doctorForm.specialization,
            consultationFee: cleanFee,
          });
          toast.success("Doctor profile created and verified successfully!");
        }
      }
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to commit profile updates:", err);

      let fallbackErrorMessage = "Failed to save profile changes. Please try again.";
      
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data.message === "string") {
          fallbackErrorMessage = data.message;
        } else if (Array.isArray(data.message)) {
          fallbackErrorMessage = data.message.join(", ");
        } else if (data.title) {
          fallbackErrorMessage = data.title;
        }
      }

      toast.error(fallbackErrorMessage, {
        description: "Status Code: " + (err?.response?.status || "Network Error"),
      });
    }
  };

  const isSaving = updatePatient.isPending || createDoctor.isPending || updateDoctor.isPending;

  return (
    <div className="flex min-h-screen bg-slate-50/40">
      {/* SIDEBAR NAVIGATION REGION */}
      <Sidebar />

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1 pl-64">
        <div className="mx-auto max-w-3xl space-y-6 px-8 pt-8 pb-12">
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your digital account details and profile fields.</p>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="default" className="shadow-sm">
                {isDoctor && !hasDoctorProfileRecord ? "Setup Profile" : "Edit Profile"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" disabled={isSaving} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving 
                    ? "Saving..." 
                    : isDoctor && !hasDoctorProfileRecord 
                      ? "Create Profile" 
                      : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* CORE IDENTITY CARD */}
          <Card className="shadow-sm bg-white">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
                  <AvatarImage src={user?.profilePhotoUrl || ""} alt={user?.firstName} />
                  <AvatarFallback className="text-xl font-semibold bg-slate-100 text-slate-700">{initials || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-1.5">
                  <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm font-medium text-slate-500 capitalize">{user?.role}</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <Button type="button" variant="outline" size="sm" disabled={isPhotoUploading} onClick={() => fileInputRef.current?.click()}>
                    {isPhotoUploading ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 border-t pt-5 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Access Email</p>
                  <p className="font-medium text-gray-900 mt-1">{user?.email || "—"}</p>
                </div>
                
                {/* --- DYNAMIC STATUS BLOCK FOR DOCTORS --- */}
                {isDoctor && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Profile Status</p>
                    <div className="mt-1">
                      {hasDoctorProfileRecord ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          (user as any).status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {(user as any).status || "Active"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                          Pending Setup
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* DOCTOR-SPECIFIC PROFESSIONAL PROFILE VIEW */}
          {user && isDoctorProfile(user) && (
            <Card className="shadow-sm border-blue-100 bg-white">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100/40">
                <CardTitle className="text-lg text-blue-900 font-bold">Professional System Attributes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">NMC Registration Number</label>
                    {!isEditing ? (
                      <p className="font-semibold text-gray-800 mt-1.5">{(user as DoctorProfile).nmcNumber || "—"}</p>
                    ) : (
                      <Input 
                        className="mt-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" 
                        placeholder="Enter NMC Number"
                        value={doctorForm.nmcNumber} 
                        disabled={hasDoctorProfileRecord}
                        onChange={(e) => setDoctorForm({ ...doctorForm, nmcNumber: e.target.value })} 
                      />
                    )}
                  </div>

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
            <Card className="shadow-sm border-emerald-100 bg-white">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/40">
                <CardTitle className="text-lg text-emerald-900 font-bold">Medical Record Profile Ledger</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gender</label>
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
      </main>
    </div>
  );
}