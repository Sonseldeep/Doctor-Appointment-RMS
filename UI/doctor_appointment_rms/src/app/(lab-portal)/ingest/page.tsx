"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { labReportsApi, IngestLabReportDto } from "@/features/lab-reports/api/lab-reports-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Modern, scannable asynchronous notification framework
import { 
  RiLoader4Line, 
  RiLock2Line, 
  RiCheckboxCircleLine,
  RiIdCardLine,
  RiFileUploadLine,
  RiUploadCloud2Line,
  RiInformationLine,
  RiImage2Line,
  RiCheckLine
} from "@remixicon/react";

const DOCK_PANELS = {
  "Full Blood Count": [
    { name: "Hemoglobin and Red Blood Cell (RBC)", unit: "g/dL", range: "13.8-17.2" },
    { name: "White Blood Cell (WBC)", unit: "x10^3/µL", range: "4.5-11.0" },
    { name: "Platelet Count", unit: "x10^3/µL", range: "150-450" }
  ],
  "Lipid Panel": [
    { name: "Total Cholesterol", unit: "mg/dL", range: "< 200" },
    { name: "HDL Cholesterol", unit: "mg/dL", range: "> 40" },
    { name: "LDL Cholesterol", unit: "mg/dL", range: "< 100" }
  ]
};

export default function LabIngestPage() {
  const [labAccessKey, setLabAccessKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  const [patientEmail, setPatientEmail] = useState("patient@example.com");
  const [labName, setLabName] = useState("Apex Diagnostics");
  const [panelName, setPanelName] = useState("Lipid Panel");
  const [testRows, setTestRows] = useState(DOCK_PANELS["Lipid Panel"]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [abnormalMap, setAbnormalMap] = useState<Record<string, boolean>>({});
  const [document, setDocument] = useState<File | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("x-lab-access-key");
    if (savedKey) {
      setLabAccessKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  // Safe credential validation mutation
  const { mutate: verifyKey, isPending: isVerifying } = useMutation({
    mutationFn: (key: string) => labReportsApi.verifyAccessKey(key),
    onSuccess: () => {
      localStorage.setItem("x-lab-access-key", labAccessKey);
      setIsKeySaved(true);
      toast.success("Authentication Successful!", {
        description: "Your access key has been accepted.",
      });
    },
    onError: () => {
      toast.error("Authentication Failed", {
        description: "The provided Access Key is invalid or expired.",
      });
      setIsKeySaved(false);
    }
  });

  const handleSaveKey = () => {
    if (labAccessKey.length < 5) {
      return toast.warning("Invalid Key Format", {
        description: "Please enter a valid, complete Access Key.",
      });
    }
    verifyKey(labAccessKey);
  };

  const handleClearKey = () => {
    localStorage.removeItem("x-lab-access-key");
    setLabAccessKey("");
    setIsKeySaved(false);
    toast.info("Session Cleared", {
      description: "Gateway connection was closed successfully.",
    });
  };

  // Secure transmission handler
  const { mutate: uploadReport, isPending } = useMutation({
    mutationFn: (payload: IngestLabReportDto) => labReportsApi.ingestLabReport(payload, labAccessKey),
    onSuccess: () => {
      toast.success("Ingestion Completed", {
        description: "Medical lab report has been recorded safely.",
      });
      setPatientEmail("");
      setTestValues({});
      setAbnormalMap({});
      setDocument(null);
    },
    onError: (error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session Expired", {
          description: "Authorization key is no longer valid. Access revoked.",
        });
        handleClearKey();
      } else {
        toast.error("Ingestion Failed", {
          description: "Network error occurred. Please check your connection and retry.",
        });
      }
    }
  });

  const handlePanelSwitch = (chosenPanel: string) => {
    setPanelName(chosenPanel);
    const targetRows = DOCK_PANELS[chosenPanel as keyof typeof DOCK_PANELS] || [];
    setTestRows(targetRows);
    setTestValues({});
    setAbnormalMap({});
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKeySaved) {
      return toast.error("Authentication Required", {
        description: "You must authenticate with an Access Key before submitting records.",
      });
    }

    const payload: IngestLabReportDto = {
      patientEmail,
      labName,
      panelName,
      observationDate: new Date().toISOString(),
      observations: testRows.map(row => ({
        testName: row.name,
        value: testValues[row.name] || "0.0",
        unit: row.unit,
        referenceRange: row.range,
        isAbnormal: !!abnormalMap[row.name]
      })),
      document,
    };

    uploadReport(payload);
  };

  return (
    <div className="space-y-6">
      {/* Auth/Connection Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <RiLock2Line className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                Connection Status
              </h2>
              <p className="text-xs text-slate-400">Secure API Authentication Gateway</p>
            </div>
          </div>
          {isKeySaved && (
            <button type="button" onClick={handleClearKey} className="text-sm font-semibold text-red-600 hover:text-red-700 underline-offset-2 hover:underline">
              Revoke Access
            </button>
          )}
        </div>
        
        {!isKeySaved ? (
          <div className="flex gap-3">
            <Input 
              type="password"
              placeholder="Enter X-Lab-Access-Key"
              value={labAccessKey}
              disabled={isVerifying}
              onChange={(e) => setLabAccessKey(e.target.value)}
              className="max-w-sm rounded-xl h-11"
            />
            <Button 
              onClick={handleSaveKey} 
              disabled={isVerifying} 
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RiLoader4Line className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authenticate Gateway"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60 w-full">
            <RiCheckboxCircleLine className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-bold">Authorized: Secure Transmission Enabled</p>
              <p className="text-xs text-emerald-600">Lab technician authenticated. Ready for data ingestion.</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Ingestion Form */}
      {isKeySaved && (
        <form onSubmit={onFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Patient & Lab Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800">
                <RiIdCardLine className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm">Patient Information & Lab Details</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Patient Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="rounded-xl h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Lab Facility
                  </label>
                  <Input
                    required
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="rounded-xl h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Test Panel Template
                  </label>
                  <select
                    value={panelName}
                    onChange={(e) => handlePanelSwitch(e.target.value)}
                    className="w-full bg-white border border-slate-200 h-10 px-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="Full Blood Count">Full Blood Count</option>
                    <option value="Lipid Panel">Lipid Panel</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Supporting Document */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800">
                <RiFileUploadLine className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm">Supporting Document</h3>
              </div>
              <div className="p-6">
                 <label className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl h-[180px] flex flex-col items-center justify-center cursor-pointer mb-4">
                    <RiUploadCloud2Line className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">Drag & Drop</span>
                    <span className="text-xs text-slate-400 mt-1">or click to upload</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
                    />
                 </label>
                 
                 {document ? (
                    <div className="text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-lg truncate border border-emerald-100">
                      File: {document.name}
                    </div>
                 ) : (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><RiImage2Line className="w-3.5 h-3.5" /> Supports: PDF, JPG, PNG</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.44405 3.44476 2 3.9934 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path></svg> Max size: 10 MB</p>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Observation Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800">Observation Data Entry</h3>
              <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">{testRows.length} Tests</span>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-white">
                  <div className="col-span-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Name</div>
                  <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference Range</div>
                  <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</div>
                  <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100 bg-white">
                  {testRows.map((row, idx) => {
                     const isAbnormal = abnormalMap[row.name];
                     return (
                      <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                        <div className="col-span-4">
                          <h4 className="text-sm font-bold text-slate-800">{row.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Unit: {row.unit}</p>
                        </div>
                        <div className="col-span-3">
                            <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">{row.range}</span>
                        </div>
                        <div className="col-span-3">
                          <Input 
                            required 
                            placeholder="0.0"
                            value={testValues[row.name] || ""}
                            onChange={e => setTestValues(prev => ({ ...prev, [row.name]: e.target.value }))}
                            className="w-24 h-9 rounded-lg border-slate-200 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <button 
                            type="button" 
                            onClick={() => setAbnormalMap(prev => ({ ...prev, [row.name]: !isAbnormal }))} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border transition-colors ${
                               isAbnormal 
                               ? "bg-red-50 text-red-600 border-red-200" 
                               : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <RiCheckLine className="w-3.5 h-3.5" />
                            {isAbnormal ? "Abnormal" : "Normal"}
                          </button>
                        </div>
                      </div>
                     )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Auto-Flagging Alert */}
          <div className="bg-[#f0f5ff] text-blue-800 p-4 rounded-xl flex gap-3 items-start text-sm border border-[#d6e4ff]">
            <RiInformationLine className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Smart Auto-Flagging:</span> Values outside the reference range are automatically flagged as abnormal. You can manually toggle this status with the button in the Status column.
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-[15px] font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2">
            {isPending ? (
               <><RiLoader4Line className="animate-spin w-5 h-5" /> Submitting Report...</>
            ) : (
               <><RiCheckboxCircleLine className="w-5 h-5" /> Submit Lab Report</>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}