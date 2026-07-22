"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  useApproveDoctorMutation,
  useSuspendDoctorMutation,
} from "../hooks/use-admin-doctors";
import type { AdminDoctor } from "../types/admin-doctor.types";

interface DoctorActionsProps {
  doctor: AdminDoctor;
}

export function DoctorActions({ doctor }: DoctorActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);

  const approveMutation = useApproveDoctorMutation();
  const suspendMutation = useSuspendDoctorMutation();

  const handleApprove = () => {
    approveMutation.mutate(doctor.userId);
    setShowApproveDialog(false);
  };

  const handleSuspend = () => {
    suspendMutation.mutate(doctor.userId);
    setShowSuspendDialog(false);
  };

  const isPending = approveMutation.isPending || suspendMutation.isPending;

  return (
    <>
      <div className="flex gap-2 justify-center items-center">
        {doctor.status !== "Active" && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowApproveDialog(true)}
            disabled={isPending}
          >
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
        )}

        {doctor.status !== "Suspended" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowSuspendDialog(true)}
            disabled={isPending}
          >
            {suspendMutation.isPending ? "Suspending..." : "Suspend"}
          </Button>
        )}
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve Dr. {doctor.firstName}{" "}
              {doctor.lastName}? They will be able to accept appointments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 px-6 py-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend Dr. {doctor.firstName}{" "}
              {doctor.lastName}? They will not be able to accept appointments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 px-6 py-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className="bg-red-600 hover:bg-red-700"
            >
              Suspend
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}