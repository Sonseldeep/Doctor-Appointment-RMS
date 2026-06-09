"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
              <TableHead>Specialization</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
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
              <TableHead>Specialization</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-muted-foreground">No doctors found</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Specialization</TableHead>
            <TableHead className="font-semibold">Consultation Fee</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.doctorProfileId} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {doctor.profilePhotoUrl ? (
                    <img
                      src={doctor.profilePhotoUrl}
                      alt={doctor.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-sm">
                      👨‍⚕️
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.bio}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {doctor.specialization}
                </span>
              </TableCell>
              <TableCell>
                <p className="font-medium">₹{doctor.consultationFee}</p>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : doctor.status === "Suspended"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doctor.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DoctorActions doctor={doctor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
