import { Metadata } from "next";
import { MedicalRecordsViewSwitcher } from "@/features/lab-reports/components/medical-records-view-switcher";
import { RiFileListLine } from "@remixicon/react";

export const metadata: Metadata = {
  title: "Medical Records | MediLink",
  description: "View and manage diagnostic lab results and clinical observations.",
};

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <RiFileListLine className="w-6 h-6 text-blue-600" />
          Medical Records
        </h1>
        <p className="text-sm text-slate-500">
          Access complete electronic health records, diagnostic panels, and vital clinical metrics securely.
        </p>
      </div>

      {/* Main Content Area */}
      <main className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Swaps elegantly depending on who's visiting */}
        <MedicalRecordsViewSwitcher />
      </main>
    </div>
  );
}