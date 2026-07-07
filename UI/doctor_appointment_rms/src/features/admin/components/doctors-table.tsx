"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiUserHeartLine } from "@remixicon/react";
import type { AdminDoctor } from "../types/admin-doctor.types";
import { DoctorActions } from "./doctor-actions";

interface DoctorsTableProps {
  doctors: AdminDoctor[];
  isLoading: boolean;
}

export function DoctorsTable({ doctors, isLoading }: DoctorsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead> {/* NEW COLUMN */}
              <TableHead>Specialization</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">Loading doctors...</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead> {/* NEW COLUMN */}
              <TableHead>Specialization</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">No doctors found</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="font-semibold text-gray-700 h-11">Name</TableHead>
            <TableHead className="font-semibold text-gray-700 h-11">Email Address</TableHead>
            <TableHead className="font-semibold text-gray-700 h-11">NMC No.</TableHead> {/* NEW COLUMN */}
            <TableHead className="font-semibold text-gray-700 h-11">Specialization</TableHead>
            <TableHead className="font-semibold text-gray-700 h-11">Consultation Fee</TableHead>
            <TableHead className="font-semibold text-gray-700 h-11">Status</TableHead>
            <TableHead className="font-semibold text-right text-gray-700 h-11">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors.map((doctor) => (
            <TableRow
              key={doctor.doctorProfileId}
              className="hover:bg-blue-50/50 transition-colors"
            >
              {/* Profile Photo and Name */}
              <TableCell className="font-medium py-3">
                <div className="flex items-center gap-3">
                  {doctor.profilePhotoUrl ? (
                    <img
                      src={doctor.profilePhotoUrl}
                      alt={doctor.firstName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <RiUserHeartLine size={16} className="text-blue-600" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </span>
                    <span className="text-[11px] text-slate-500 max-w-[180px] truncate">
                      {doctor.bio || "No biography provided"}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Email Address */}
              <TableCell className="py-3">
                <span className="text-sm text-slate-600 font-medium">
                  {doctor.email || "—"}
                </span>
              </TableCell>

              {/* NMC Number */}
              <TableCell className="py-3">
                <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {doctor.nmcNumber || "—"}
                </span>
              </TableCell>

              {/* Specialization */}
              <TableCell className="py-3">
                <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-md border border-indigo-100">
                  {doctor.specialization}
                </span>
              </TableCell>

              {/* Consultation Fee */}
              <TableCell className="py-3">
                <span className="font-semibold text-slate-700 text-sm">
                  NPR {doctor.consultationFee}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell className="py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    doctor.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : doctor.status === "Suspended"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {doctor.status}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right py-3">
                <DoctorActions doctor={doctor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}