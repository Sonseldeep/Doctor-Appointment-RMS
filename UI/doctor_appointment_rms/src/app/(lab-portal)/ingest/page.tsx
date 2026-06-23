"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { labReportsApi, IngestLabReportDto } from "@/features/lab-reports/api/lab-reports-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiShieldKeyholeLine, RiLoader4Line, RiFlaskLine, RiAlertFill, RiCheckDoubleLine } from "@remixicon/react";

const DOCK_PANELS = {
  "Full Blood Count": [
    { name: "Hemoglobin and red Blood Cell (RBC)", unit: "g/dL", range: "13.8-17.2" },
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
  // 1. "Developer Touch": State management for persistent auth
  const [labAccessKey, setLabAccessKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  const [patientEmail, setPatientEmail] = useState("");
  const [labName, setLabName] = useState("Apex Diagnostics");
  const [panelName, setPanelName] = useState("Full Blood Count");
  const [testRows, setTestRows] = useState(DOCK_PANELS["Full Blood Count"]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [abnormalMap, setAbnormalMap] = useState<Record<string, boolean>>({});

  // Load key from storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("x-lab-access-key");
    if (savedKey) {
      setLabAccessKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (labAccessKey.length < 5) return alert("Please enter a valid Access Key");
    localStorage.setItem("x-lab-access-key", labAccessKey);
    setIsKeySaved(true);
  };

  const handleClearKey = () => {
    localStorage.removeItem("x-lab-access-key");
    setLabAccessKey("");
    setIsKeySaved(false);
  };

  const { mutate: uploadReport, isPending } = useMutation({
    mutationFn: (payload: IngestLabReportDto) => labReportsApi.ingestLabReport(payload, labAccessKey),
    onSuccess: () => {
      alert("Success! Medical report recorded.");
      setPatientEmail("");
      setTestValues({});
      setAbnormalMap({});
    },
    onError: () => {
      alert("Ingestion Rejected: Ensure X-Lab-Access-Key is valid.");
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
    if (!isKeySaved) return alert("You must authenticate with an Access Key first.");

    const payload: IngestLabReportDto = {
      patientEmail,
      labName,
      panelName,
      observationDate: new Date().toISOString(),
      observations: testRows.map(row => ({
        testName: row.name,
        value: testValues[row.name] || "0",
        unit: row.unit,
        referenceRange: row.range,
        isAbnormal: !!abnormalMap[row.name]
      }))
    };

    uploadReport(payload);
  };

  return (
    <div className="space-y-6">
      {/* Auth/Connection Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <RiShieldKeyholeLine className="w-4 h-4" /> Connection Settings
          </h2>
          {isKeySaved && (
            <button onClick={handleClearKey} className="text-xs text-red-500 font-semibold hover:underline">Revoke Access</button>
          )}
        </div>
        
        {!isKeySaved ? (
          <div className="flex gap-2">
            <Input 
              type="password"
              placeholder="Enter X-Lab-Access-Key"
              value={labAccessKey}
              onChange={(e) => setLabAccessKey(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSaveKey}>Authenticate</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 w-fit">
            <RiCheckDoubleLine className="w-4 h-4" />
            <span className="text-sm font-medium">Authorized: Transmission Enabled</span>
          </div>
        )}
      </div>

      {/* Main Ingestion Form (Visible only if authenticated) */}
      {isKeySaved && (
        <form onSubmit={onFormSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Email</label>
              <Input required type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lab Facility</label>
              <Input required value={labName} onChange={e => setLabName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template</label>
              <select value={panelName} onChange={e => handlePanelSwitch(e.target.value)} className="w-full bg-white border border-slate-200 h-10 px-3 rounded-xl text-sm">
                <option value="Full Blood Count">Full Blood Count (FBC)</option>
                <option value="Lipid Panel">Lipid Panel</option>
              </select>
            </div>
          </div>

          {/* ... Observation Rows ... */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-sm text-slate-700">Observation Data</div>
            <div className="p-6 space-y-4">
              {testRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{row.name}</h4>
                    <p className="text-xs text-slate-400">Ref: {row.range}</p>
                  </div>
                  <Input 
                    required 
                    placeholder="Value"
                    value={testValues[row.name] || ""}
                    onChange={e => setTestValues(prev => ({ ...prev, [row.name]: e.target.value }))}
                  />
                  <div className="md:col-span-2 flex justify-end">
                    <button type="button" onClick={() => setAbnormalMap(prev => ({ ...prev, [row.name]: !prev[row.name] }))} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${abnormalMap[row.name] ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {abnormalMap[row.name] ? "Abnormal Flagged" : "Mark Normal"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-2xl">
            {isPending ? <><RiLoader4Line className="animate-spin mr-2" /> Sending...</> : "Submit Lab Report"}
          </Button>
        </form>
      )}
    </div>
  );
}