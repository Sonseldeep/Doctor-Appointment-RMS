"use client";

import { useState, useEffect, useRef } from "react";
import { useLabReports } from "../hooks/use-lab-reports";
import { LabReportResponse } from "../types/lab-reports.types";
import { labReportsApi } from "../api/lab-reports-api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

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
} from "@/components/ui/dialog";

import {
  RiHeartPulseLine,
  RiErrorWarningFill,
  RiCheckboxCircleFill,
  RiFilePdf2Line,
  RiImageLine,
  RiHospitalLine,
  RiMicroscopeLine,
  RiEyeLine,
  RiExternalLinkLine,
  RiFlaskLine
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const LabReportsTable = () => {
  const { data, isLoading, error } = useLabReports();
  const [selectedReport, setSelectedReport] = useState<LabReportResponse | null>(null);
  const searchParams = useSearchParams();
  
  const hasAutoOpened = useRef(false);

  // Download Trigger Handler Mechanism
  const { mutate: exportPdf, isPending: isExporting } = useMutation({
    mutationFn: (reportId: string) => labReportsApi.exportLabReportPdf(reportId),
    onSuccess: (blob, reportId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `MedicalReport_${reportId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("PDF report downloaded successfully!");
    },
    onError: (err) => {
      console.error("PDF Export failed:", err);
      toast.error("Failed to generate download package. Please try again.");
    },
  });

  const reports: LabReportResponse[] = Array.isArray(data) ? data : [];

  // Helper utility to safely cross-reference any incoming route token against the report record
  const checkReportMatch = (report: any): boolean => {
    const URL_PARAMS = ["id", "reportId", "labReportId", "appointmentId", "noteId", "clinicalNoteId"];
    const RECORD_KEYS = ["id", "reportId", "labReportId", "appointmentId", "noteId", "clinicalNoteId"];

    for (const param of URL_PARAMS) {
      const paramValue = searchParams.get(param);
      if (!paramValue) continue;

      for (const key of RECORD_KEYS) {
        if (report[key] && String(report[key]) === String(paramValue)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const hasActiveQuery = ["id", "reportId", "labReportId", "appointmentId", "noteId", "clinicalNoteId"].some(
      (param) => !!searchParams.get(param)
    );

    if (reports.length > 0 && hasActiveQuery && !hasAutoOpened.current) {
      const matchingReport = reports.find((r) => checkReportMatch(r));
    }
  }, [reports, searchParams]);

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
      <div className="p-12 text-center bg-red-50 rounded-xl border border-red-100">
        <RiErrorWarningFill className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-red-800">Failed to load medical records</h3>
        <p className="text-sm text-red-600 mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <RiFlaskLine className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-900 text-lg">No medical records found</h3>
        <p className="text-slate-500 mt-1 max-w-sm">
          You don't have any diagnostic panels or lab reports available in your history yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader className="bg-slate-50/80 border-b border-slate-200">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-slate-600">Lab Facility</TableHead>
            <TableHead className="font-semibold text-slate-600">Panel</TableHead>
            <TableHead className="font-semibold text-slate-600">Date</TableHead>
            <TableHead className="font-semibold text-slate-600">Document</TableHead>
            <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((report) => {
            const isHighlighted = checkReportMatch(report);

            return (
              <TableRow
                key={report.id}
                className={`transition-all group cursor-pointer ${
                  isHighlighted
                    ? "bg-blue-50/80! hover:bg-blue-50/90! shadow-[inset_4px_0_0_0_#3b82f6] font-medium"
                    : "hover:bg-blue-50/50"
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <RiHospitalLine className="text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                    {report.labName}
                  </div>
                </TableCell>

                <TableCell className="text-slate-700 font-medium">
                  {report.panelName}
                </TableCell>

                <TableCell className="text-slate-600 text-sm">
                  {parseAndFormatDate(report)}
                </TableCell>

                <TableCell>
  {report.documents && report.documents.length > 0 ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider">
      {report.documents[0].documentType === 'PDF' || report.documents[0].mimeType?.includes('pdf') ? (
        <RiFilePdf2Line size={14} className="text-red-500" />
      ) : (
        <RiImageLine size={14} className="text-blue-500" />
      )}
      {report.documents.length > 1 ? `${report.documents[0].documentType} (+${report.documents.length - 1})` : report.documents[0].documentType}
    </span>
  ) : (
    <span className="text-slate-400 text-sm">-</span>
  )}
</TableCell>

                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setSelectedReport(report);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all font-medium text-sm shadow-sm"
                  >
                    <RiEyeLine size={16} />
                    View Record
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-5xl lg:max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-50 rounded-2xl gap-0 border border-slate-200 shadow-2xl">
          {selectedReport && (
            <>
              {/* Header section - Fixed height at top */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 sm:px-8 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedReport.panelName}
                  </h2>
                  <p className="mt-1 text-slate-500 flex items-center gap-2 text-sm font-medium">
                    <RiHospitalLine size={16} className="text-blue-600" />
                    {selectedReport.labName}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col sm:items-end text-sm">
                    <span className="text-slate-500 font-medium">Report Date</span>
                    <span className="font-bold text-slate-900 text-base">
                      {parseAndFormatDate(selectedReport)}
                    </span>
                  </div>

                  {/* PDF Download Button */}
                  <Button
                    onClick={() => exportPdf(selectedReport.id)}
                    disabled={isExporting}
                    className="gap-2 px-4 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <RiFilePdf2Line className="size-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Scrollable Body - Two Column Grid */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* LEFT COLUMN: Summary & Stats */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm">
                        <p className="text-[10px] tracking-wider uppercase text-slate-500 font-bold mb-1">Total Tests</p>
                        <p className="text-3xl font-black text-slate-800">{selectedReport.observations.length}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-sm">
                        <p className="text-[10px] tracking-wider uppercase text-slate-500 font-bold mb-1">Doc Type</p>
                        <p className="text-lg font-bold text-slate-800 mt-2">
                          {selectedReport.documents && selectedReport.documents.length > 0 ? selectedReport.documents[0].documentType : "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-green-200 p-4 bg-green-50/50 shadow-sm">
                        <p className="text-[10px] tracking-wider uppercase text-green-700 font-bold mb-1">Normal</p>
                        <p className="text-3xl font-black text-green-600">
                          {selectedReport.observations.filter((o) => !o.isAbnormal).length}
                        </p>
                      </div>
                      <div className="rounded-xl border border-red-200 p-4 bg-red-50/50 shadow-sm">
                        <p className="text-[10px] tracking-wider uppercase text-red-700 font-bold mb-1">Abnormal</p>
                        <p className="text-3xl font-black text-red-600">
                          {selectedReport.observations.filter((o) => o.isAbnormal).length}
                        </p>
                      </div>
                    </div>

                    {/* Clinical Summary Widget */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <RiHeartPulseLine className="text-blue-600" size={20} />
                        <h3 className="font-bold text-slate-900">Clinical Summary</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-slate-600 font-medium">
                        <li className="flex justify-between items-center">
                          <span>Total Tests Performed</span>
                          <span className="text-slate-900">{selectedReport.observations.length}</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Laboratory</span>
                          <span className="text-slate-900 text-right">{selectedReport.labName}</span>
                        </li>
                        {selectedReport.observations.filter((o) => o.isAbnormal).length > 0 && (
                          <li className="pt-2 mt-2 border-t border-slate-100">
                            <span className="text-red-600 font-bold text-xs uppercase tracking-wider block mb-2">Elevated Findings</span>
                            {selectedReport.observations
                              .filter((o) => o.isAbnormal)
                              .map((o) => (
                                <div key={o.testName} className="text-slate-800 mb-1">
                                  • {o.testName}
                                </div>
                              ))}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Alert, Findings, Document */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Alert Banner */}
                    {selectedReport.observations.some((o) => o.isAbnormal) ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm flex items-start gap-3">
                        <RiErrorWarningFill className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div>
                          <h3 className="font-bold text-red-800 text-sm">Attention Required</h3>
                          <p className="text-sm text-red-600 mt-0.5">
                            One or more findings are outside the normal reference range. Please consult your physician.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm flex items-start gap-3">
                        <RiCheckboxCircleFill className="text-green-600 shrink-0 mt-0.5" size={20} />
                        <div>
                          <h3 className="font-bold text-green-800 text-sm">All Results Within Range</h3>
                          <p className="text-sm text-green-600 mt-0.5">
                            No abnormal laboratory findings were detected in this panel.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Laboratory Findings */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <RiMicroscopeLine className="text-blue-600" size={20} />
                        <h3 className="text-lg font-bold text-slate-900">Laboratory Findings</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedReport.observations.map((obs, index) => (
                          <div
                            key={index}
                            className={`rounded-xl border p-4 shadow-sm ${
                              obs.isAbnormal ? "border-red-200 bg-white" : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-900">{obs.testName}</h4>
                              {obs.isAbnormal ? (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold uppercase tracking-wider">Abnormal</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700 font-bold uppercase tracking-wider">Normal</span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1 mt-3">
                              <span className={`text-2xl font-black ${obs.isAbnormal ? "text-red-600" : "text-slate-800"}`}>
                                {obs.value}
                              </span>
                              <span className="text-sm text-slate-500 font-medium">{obs.unit}</span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-slate-500 uppercase tracking-wider font-bold">Ref Range</span>
                              <span className="font-medium text-slate-700">{obs.referenceRange}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Preview Section */}
                    {selectedReport.documents && selectedReport.documents.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                          <RiFilePdf2Line className="text-blue-600" size={20} />
                          <h3 className="text-lg font-bold text-slate-900">
                            Supporting Documents ({selectedReport.documents.length})
                          </h3>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                          <Table>
                            <TableHeader className="bg-slate-50 border-b border-slate-200">
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-slate-600">File Name</TableHead>
                                <TableHead className="font-semibold text-slate-600">Type</TableHead>
                                <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedReport.documents.map((doc) => {
                                const isPdf = doc.mimeType?.includes("pdf") || doc.documentType === 'PDF';
                                
                                return (
                                  <TableRow key={doc.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                      <div className="flex items-center gap-2">
                                        {isPdf ? (
                                          <RiFilePdf2Line size={16} className="text-red-500 shrink-0" />
                                        ) : (
                                          <RiImageLine size={16} className="text-blue-500 shrink-0" />
                                        )}
                                        <span className="truncate max-w-[200px] sm:max-w-[300px]">
                                          {doc.fileName || "Document"}
                                        </span>
                                      </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-slate-600 text-sm">
                                      <span className="px-2 py-1 rounded bg-slate-100 text-[11px] font-bold uppercase tracking-wider">
                                        {doc.documentType || (isPdf ? "PDF" : "Image")}
                                      </span>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                      <a
                                        href={doc.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors text-xs font-semibold shadow-sm"
                                      >
                                        <RiExternalLinkLine size={14} />
                                        View
                                      </a>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
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
  <div className="space-y-3 p-2 animate-pulse">
    <div className="h-14 bg-slate-100 rounded-lg w-full" />
    <div className="h-14 bg-slate-50 rounded-lg w-full" />
    <div className="h-14 bg-slate-50 rounded-lg w-full" />
    <div className="h-14 bg-slate-50 rounded-lg w-full" />
  </div>
);