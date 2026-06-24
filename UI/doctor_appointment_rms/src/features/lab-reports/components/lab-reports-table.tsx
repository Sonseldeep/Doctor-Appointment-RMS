// "use client";

// import { useState } from "react";
// import { useLabReports } from "../hooks/use-lab-reports";
// import { LabReportResponse } from "../types/lab-reports.types";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { RiEyeLine, RiAlertFill, RiCheckboxCircleFill, RiCalendarEventLine } from "@remixicon/react";

// export const LabReportsTable = () => {
//   // 1. Fetch data but do not immediately assume it is an array
//   const { data, isLoading, error } = useLabReports();
//   const [selectedReport, setSelectedReport] = useState<LabReportResponse | null>(null);

//   // 2. TypeScript Fix: Guarantee 'reports' is strictly an array of LabReportResponse
//   const reports: LabReportResponse[] = Array.isArray(data) ? data : [];

//   // Senior Fallback Rule: Defensively check multiple common JSON serialization keys 
//   // to ensure dates parse properly regardless of .NET naming conventions
//   const parseAndFormatDate = (report: any): string => {
//     const rawDate = 
//       report?.observationDateTime || 
//       report?.ObservationDateTime || 
//       report?.observationDate || 
//       report?.date;

//     if (!rawDate) return "N/A";

//     const parsed = new Date(rawDate);
//     if (isNaN(parsed.getTime())) return "N/A";

//     return parsed.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   if (isLoading) return <TableSkeleton />;
  
//   if (error) {
//     return (
//       <div className="p-8 text-center text-sm text-red-500 font-medium">
//         Failed to fetch records. Please refresh or try again later.
//       </div>
//     );
//   }

//   // 3. This length check now works perfectly because we forced it into an array
//   if (reports.length === 0) {
//     return (
//       <div className="p-12 text-center text-sm text-slate-400 font-medium">
//         No lab reports found in your medical history.
//       </div>
//     );
//   }

//   return (
//     <>
//       <Table>
//         <TableHeader className="bg-slate-50/70">
//           <TableRow>
//             <TableHead className="font-semibold text-slate-700 h-12">Lab Facility</TableHead>
//             <TableHead className="font-semibold text-slate-700 h-12">Diagnostic Panel</TableHead>
//             <TableHead className="font-semibold text-slate-700 h-12">Date Ordered</TableHead>
//             <TableHead className="font-semibold text-slate-700 h-12 text-right pr-6">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {/* 4. report is implicitly understood as LabReportResponse here */}
//           {reports.map((report) => (
//             <TableRow key={report.id || report.panelName} className="hover:bg-slate-50/40 transition-colors border-slate-100">
//               <TableCell className="font-semibold text-slate-900 py-4">{report.labName}</TableCell>
//               <TableCell className="text-slate-600 py-4">{report.panelName}</TableCell>
//               <TableCell className="text-slate-500 py-4">
//                 <div className="flex items-center gap-1.5">
//                   <RiCalendarEventLine className="w-4 h-4 text-slate-400" />
//                   {parseAndFormatDate(report)}
//                 </div>
//               </TableCell>
//               <TableCell className="text-right py-4 pr-6">
//                 <button
//                   onClick={() => setSelectedReport(report)}
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-all duration-200 shadow-sm"
//                 >
//                   <RiEyeLine className="w-3.5 h-3.5" /> View Results
//                 </button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Optimized Detail Modal for Health Observations */}
//       <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
//         <DialogContent className="sm:max-w-xl md:max-w-2xl w-full bg-white rounded-2xl p-6 shadow-xl gap-0 border border-slate-100">
//           <DialogHeader className="pb-4 border-b border-slate-100">
//             <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
//               {selectedReport?.panelName}
//             </DialogTitle>
//             <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1">
//               <span>Facility: <strong className="text-slate-700 font-semibold">{selectedReport?.labName}</strong></span>
//               <span className="text-slate-300">•</span>
//               <span className="flex items-center gap-1">
//                 <RiCalendarEventLine className="w-3.5 h-3.5 text-slate-400" />
//                 Verified on {selectedReport && parseAndFormatDate(selectedReport)}
//               </span>
//             </div>
//           </DialogHeader>

//           {/* Clean Layout Container - Removes ugly text compression and unwanted horizontal overflow */}
//           <div className="mt-5 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
//             <div className="overflow-x-auto">
//               <Table className="w-full min-w-[500px]">
//                 <TableHeader className="bg-slate-50">
//                   <TableRow className="border-slate-100">
//                     <TableHead className="text-xs font-bold text-slate-600 h-10 w-[40%]">Test Parameter</TableHead>
//                     <TableHead className="text-xs font-bold text-slate-600 h-10 w-[30%]">Result Value</TableHead>
//                     <TableHead className="text-xs font-bold text-slate-600 h-10 w-[30%]">Reference Range</TableHead>
//                     <TableHead className="text-xs font-bold text-slate-600 h-10 text-right pr-4">Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedReport?.observations.map((obs, idx) => (
//                     <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
//                       <TableCell className="font-medium text-slate-800 text-sm py-3.5 whitespace-nowrap">
//                         {obs.testName}
//                       </TableCell>
//                       <TableCell className="text-slate-900 font-bold text-sm py-3.5">
//                         {obs.value} <span className="text-xs font-normal text-slate-400 ml-0.5">{obs.unit}</span>
//                       </TableCell>
//                       <TableCell className="text-slate-500 text-sm py-3.5 whitespace-nowrap">
//                         {obs.referenceRange}
//                       </TableCell>
//                       <TableCell className="text-right py-3.5 pr-4">
//                         {obs.isAbnormal ? (
//                           <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50/80 border border-red-100 px-2 py-0.5 rounded-md tracking-wide whitespace-nowrap">
//                             <RiAlertFill className="w-3 h-3" /> ABNORMAL
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50/80 border border-green-100 px-2 py-0.5 rounded-md tracking-wide whitespace-nowrap">
//                             <RiCheckboxCircleFill className="w-3 h-3" /> NORMAL
//                           </span>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// const TableSkeleton = () => (
//   <div className="w-full space-y-4 p-6 animate-pulse bg-white rounded-2xl">
//     <div className="h-10 bg-slate-100 rounded-lg w-full" />
//     {[1, 2, 3].map((n) => (
//       <div key={n} className="h-14 bg-slate-50 rounded-xl w-full" />
//     ))}
//   </div>
// );

"use client";

import { useState } from "react";
import { useLabReports } from "../hooks/use-lab-reports";
import { LabReportResponse } from "../types/lab-reports.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  RiHeartPulseLine,
  RiErrorWarningFill,
  RiCheckboxCircleFill,
  RiFilePdf2Line,
  RiImageLine,
  RiHospitalLine,
  RiCalendarEventLine,
  RiFileList3Line,
  RiMicroscopeLine,
  RiEyeLine,
} from "@remixicon/react";

export const LabReportsTable = () => {
  const { data, isLoading, error } = useLabReports();

  const [selectedReport, setSelectedReport] =
    useState<LabReportResponse | null>(null);

  const reports: LabReportResponse[] =
    Array.isArray(data) ? data : [];

  const parseAndFormatDate = (report: any): string => {
    const rawDate =
      report?.observationDateTime ||
      report?.ObservationDateTime ||
      report?.observationDate ||
      report?.date;

    if (!rawDate) return "N/A";

    const parsed = new Date(rawDate);

    if (isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load medical records.
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="p-12 text-center text-slate-400">
        No medical records found.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Lab Facility</TableHead>
            <TableHead>Panel</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Document</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((report) => (
            <TableRow
              key={report.id}
              className="hover:bg-slate-50"
            >
              <TableCell className="font-semibold">
                {report.labName}
              </TableCell>

              <TableCell>
                {report.panelName}
              </TableCell>

              <TableCell>
                {parseAndFormatDate(report)}
              </TableCell>

              <TableCell>
                {report.documentType ?? "-"}
              </TableCell>

              <TableCell className="text-right">
                <button
                  onClick={() =>
                    setSelectedReport(report)
                  }
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <RiEyeLine size={16} />
                  View Record
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
  open={!!selectedReport}
  onOpenChange={(open) => !open && setSelectedReport(null)}
>
  <DialogContent
  className="
    w-[96vw]
    max-w-[1600px]
    h-[95vh]
    max-h-[95vh]
    overflow-y-auto
    p-0
    gap-0
  "
>
    {selectedReport && (
      <>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                {selectedReport.panelName}
              </h2>

              <p className="mt-2 text-blue-100 flex items-center gap-2">
                <RiHospitalLine size={18} />
                {selectedReport.labName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-blue-100">
                Report Date
              </p>

              <p className="font-semibold">
                {parseAndFormatDate(selectedReport)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border p-5 bg-white">
              <p className="text-xs uppercase text-slate-500 font-bold">
                Total Tests
              </p>

              <p className="text-3xl font-bold mt-2">
                {selectedReport.observations.length}
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-white">
              <p className="text-xs uppercase text-slate-500 font-bold">
                Normal
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {
                  selectedReport.observations.filter(
                    (o) => !o.isAbnormal
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-white">
              <p className="text-xs uppercase text-slate-500 font-bold">
                Abnormal
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {
                  selectedReport.observations.filter(
                    (o) => o.isAbnormal
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border p-5 bg-white">
              <p className="text-xs uppercase text-slate-500 font-bold">
                Document Type
              </p>

              <p className="text-lg font-semibold mt-3">
                {selectedReport.documentType || "N/A"}
              </p>
            </div>
          </div>

          {/* Alert Banner */}
          {selectedReport.observations.some(
            (o) => o.isAbnormal
          ) ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex gap-3">
                <RiErrorWarningFill
                  className="text-red-600 mt-0.5"
                  size={22}
                />

                <div>
                  <h3 className="font-bold text-red-700">
                    Attention Required
                  </h3>

                  <p className="text-sm text-red-600 mt-1">
                    One or more laboratory findings are
                    outside the normal reference range.
                    Please consult your physician.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex gap-3">
                <RiCheckboxCircleFill
                  className="text-green-600 mt-0.5"
                  size={22}
                />

                <div>
                  <h3 className="font-bold text-green-700">
                    All Results Within Range
                  </h3>

                  <p className="text-sm text-green-600 mt-1">
                    No abnormal laboratory findings
                    detected.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Document Preview */}
          {selectedReport.documentUrl && (
            <div className="rounded-2xl border overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b flex items-center gap-2 font-semibold">
                {selectedReport.mimeType?.includes("image") ? (
                  <RiImageLine />
                ) : (
                  <RiFilePdf2Line />
                )}

                Supporting Document
              </div>

              <div className="p-5">
                {selectedReport.mimeType?.includes("image") ? (
                  <img
                    src={selectedReport.documentUrl}
                    alt="Medical Document"
                    className="
                        w-full
                        h-auto
                        max-h-[900px]
                        object-contain
                        rounded-xl
                        border
                      "
                  />
                ) : selectedReport.mimeType?.includes("pdf") ? (
                  <iframe
                    src={selectedReport.documentUrl}
                    className="w-full h-[900px] rounded-xl border"
                  />
                ) : (
                  <a
                    href={selectedReport.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold"
                  >
                    Open Attached Document
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Observations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <RiMicroscopeLine
                className="text-blue-600"
                size={22}
              />

              <h3 className="text-xl font-bold">
                Laboratory Findings
              </h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {selectedReport.observations.map(
                (obs, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-5 transition-all
                    ${
                      obs.isAbnormal
                        ? "border-red-200 bg-red-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">
                          {obs.testName}
                        </h4>

                        <p className="text-3xl font-bold mt-3">
                          {obs.value}
                        </p>

                        <p className="text-sm text-slate-500">
                          {obs.unit}
                        </p>
                      </div>

                      {obs.isAbnormal ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          ABNORMAL
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          NORMAL
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs uppercase text-slate-500 font-bold">
                        Reference Range
                      </p>

                      <p className="font-medium mt-1">
                        {obs.referenceRange}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="rounded-2xl border bg-slate-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <RiHeartPulseLine
                className="text-blue-600"
                size={22}
              />

              <h3 className="font-bold text-lg">
                Clinical Summary
              </h3>
            </div>

            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                • Total laboratory tests performed:{" "}
                {selectedReport.observations.length}
              </li>

              <li>
                • Abnormal findings detected:{" "}
                {
                  selectedReport.observations.filter(
                    (o) => o.isAbnormal
                  ).length
                }
              </li>

              <li>
                • Laboratory provider:{" "}
                {selectedReport.labName}
              </li>

              <li>
                • Panel performed:{" "}
                {selectedReport.panelName}
              </li>

              {selectedReport.observations
                .filter((o) => o.isAbnormal)
                .map((o) => (
                  <li
                    key={o.testName}
                    className="text-red-600"
                  >
                    • Elevated finding detected in{" "}
                    {o.testName}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </>
  );
};

const TableSkeleton = () => (
  <div className="space-y-4 p-6 animate-pulse">
    <div className="h-12 bg-slate-100 rounded-xl" />
    <div className="h-12 bg-slate-100 rounded-xl" />
    <div className="h-12 bg-slate-100 rounded-xl" />
  </div>
);