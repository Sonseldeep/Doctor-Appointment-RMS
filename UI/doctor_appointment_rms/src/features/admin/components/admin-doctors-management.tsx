// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAdminDoctors } from "../hooks/use-admin-doctors";
// import type { AdminDoctor } from "../types/admin-doctor.types";
// import { DoctorsTable } from "./doctors-table";

// export function AdminDoctorsManagement() {
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   const { data, isLoading } = useAdminDoctors(pageNumber, pageSize);

//   // 🔍 BACKEND ARRAY AUTO-DETECTOR
//   // Checks all common pagination keys (.items, .doctors, .data) to extract the list safely.
//   const backendPayload = data as any;
//   const doctorsList: AdminDoctor[] = backendPayload?.data || backendPayload?.items || backendPayload?.doctors || [];

//   // Filter against our safely extracted array using optional chaining to prevent crashes
//   const filteredDoctors = doctorsList.filter(
//     (doctor: AdminDoctor) =>
//       doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const totalPages = Math.ceil((data?.totalCount || 0) / pageSize) || 1;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Doctor Management</h1>
//         <p className="text-muted-foreground mt-2">
//           Manage doctor approvals and suspensions
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         <div className="rounded-lg border p-4 bg-white shadow-sm">
//           <p className="text-sm text-muted-foreground">Total Doctors</p>
//           <p className="text-2xl font-bold mt-1">{data?.totalCount || 0}</p>
//         </div>
//         <div className="rounded-lg border p-4 bg-white shadow-sm">
//           <p className="text-sm text-muted-foreground">Active</p>
//           <p className="text-2xl font-bold text-green-600 mt-1">
//             {/* Targeted our auto-detected array safely */}
//             {doctorsList.filter((d: AdminDoctor) => d.status === "Active").length}
//           </p>
//         </div>
//         <div className="rounded-lg border p-4 bg-white shadow-sm">
//           <p className="text-sm text-muted-foreground">Suspended</p>
//           <p className="text-2xl font-bold text-red-600 mt-1">
//             {/* Targeted our auto-detected array safely */}
//             {doctorsList.filter((d: AdminDoctor) => d.status === "Suspended").length}
//           </p>
//         </div>
//       </div>

//       {/* Search */}
//       <div>
//         <Input
//           placeholder="Search by name or specialization..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setPageNumber(1);
//           }}
//           className="max-w-md bg-white"
//         />
//       </div>

//       {/* Table */}
//       <DoctorsTable doctors={filteredDoctors} isLoading={isLoading} />

//       {/* Pagination */}
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-muted-foreground">
//           Page {pageNumber} of {totalPages}
//         </p>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//             disabled={pageNumber === 1}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
//             disabled={pageNumber === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminDoctors } from "../hooks/use-admin-doctors";
import type { AdminDoctor } from "../types/admin-doctor.types";
import { DoctorsTable } from "./doctors-table";

export function AdminDoctorsManagement() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data, isLoading } = useAdminDoctors(pageNumber, pageSize);

  // 🔍 BACKEND ARRAY AUTO-DETECTOR
  const backendPayload = data as any;
  const doctorsList: AdminDoctor[] = backendPayload?.data || backendPayload?.items || backendPayload?.doctors || [];

  // Extract unique specializations dynamically for the dropdown
  const uniqueSpecializations = Array.from(
    new Set(doctorsList.map((d: AdminDoctor) => d.specialization).filter(Boolean))
  ).sort();

  // Filter against search term AND dropdowns
  const filteredDoctors = doctorsList.filter((doctor: AdminDoctor) => {
    const matchesSearch =
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === "all" || doctor.specialization === selectedSpecialization;

    const matchesStatus = 
      selectedStatus === "all" || doctor.status === selectedStatus;

    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage doctor approvals and suspensions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">Total Doctors</p>
          <p className="text-2xl font-bold mt-1">{data?.totalCount || 0}</p>
        </div>
        <div className="rounded-lg border p-4 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {doctorsList.filter((d: AdminDoctor) => d.status === "Active").length}
          </p>
        </div>
        <div className="rounded-lg border p-4 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {doctorsList.filter((d: AdminDoctor) => d.status === "Suspended").length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="w-full sm:flex-1">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            className="w-full bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedSpecialization}
            onChange={(e) => {
              setSelectedSpecialization(e.target.value);
              setPageNumber(1);
            }}
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Specializations</option>
            {uniqueSpecializations.map((spec: any) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPageNumber(1);
            }}
            className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DoctorsTable doctors={filteredDoctors} isLoading={isLoading} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {pageNumber} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
            disabled={pageNumber === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}