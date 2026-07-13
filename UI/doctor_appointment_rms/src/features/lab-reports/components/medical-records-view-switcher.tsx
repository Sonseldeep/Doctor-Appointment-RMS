'use client';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { LabReportsTable } from './lab-reports-table';
import { DoctorMedicalRecords } from './doctor-medical-records';
import { RiPulseLine } from '@remixicon/react';

export function MedicalRecordsViewSwitcher() {
 
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-75 flex items-center justify-center text-slate-500 text-sm gap-2">
        <RiPulseLine className="animate-spin w-5 h-5 text-blue-600" />
        Authenticating profile layers...
      </div>
    );
  }

  // Check if user exists and has the doctor assignment
  if (user && 'role' in user && user.role === 'Doctor') {
    return <DoctorMedicalRecords />;
  }

  return <LabReportsTable />;
}