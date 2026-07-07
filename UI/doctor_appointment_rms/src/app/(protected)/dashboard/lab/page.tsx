"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { labReportsApi, IngestLabReportDto } from "@/features/lab-reports/api/lab-reports-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 
import { 
  RiLoader4Line, 
  RiCheckboxCircleLine,
  RiIdCardLine,
  RiFileUploadLine,
  RiUploadCloud2Line,
  RiInformationLine,
  RiImage2Line,
  RiCheckLine,
  RiSearchLine,
  RiCloseLine
} from "@remixicon/react";
import { PatientSearchResult } from "@/features/lab-reports/types/lab-reports.types";

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

const formatDate = (dateString?: string) => {
  if (!dateString || dateString.startsWith("0001")) return "N/A";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const checkIsAbnormal = (valueStr: string, rangeStr: string): boolean => {
  const val = parseFloat(valueStr);
  if (isNaN(val)) return false; 

  const cleanRange = rangeStr.replace(/\s+/g, '');
  
  if (cleanRange.startsWith('<')) {
    return val >= parseFloat(cleanRange.substring(1));
  }
  if (cleanRange.startsWith('>')) {
    return val <= parseFloat(cleanRange.substring(1));
  }
  if (cleanRange.includes('-')) {
    const [minStr, maxStr] = cleanRange.split('-');
    return val < parseFloat(minStr) || val > parseFloat(maxStr);
  }
  
  return false;
};

export default function LabIngestPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [patientEmail, setPatientEmail] = useState("");
  const [labName, setLabName] = useState("Apex Diagnostics");
  const [panelName, setPanelName] = useState("Lipid Panel");
  const [testRows, setTestRows] = useState(DOCK_PANELS["Lipid Panel"]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [abnormalMap, setAbnormalMap] = useState<Record<string, boolean>>({});
  const [document, setDocument] = useState<File | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["patientSearchLab", debouncedSearch],
    queryFn: () => labReportsApi.searchLabPatients(debouncedSearch),
    enabled: debouncedSearch.length > 0, 
  });

  const { mutate: uploadReport, isPending } = useMutation({
    mutationFn: (payload: IngestLabReportDto) => labReportsApi.ingestLabReport(payload),
    onSuccess: () => {
      toast.success("Ingestion Completed", {
        description: "Medical lab report has been recorded safely.",
      });
      setPatientEmail("");
      setSearchTerm("");
      setTestValues({});
      setAbnormalMap({});
      setDocument(null);
    },
    onError: () => {
      toast.error("Ingestion Failed", {
        description: "An error occurred while uploading the records. Please try again.",
      });
    }
  });

  const handlePatientSelect = (email: string) => {
    setPatientEmail(email);
    setSearchTerm(email);
    setIsDropdownOpen(false);
  };

  const clearSelection = () => {
    setPatientEmail("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };

  const handlePanelSwitch = (chosenPanel: string) => {
    setPanelName(chosenPanel);
    const targetRows = DOCK_PANELS[chosenPanel as keyof typeof DOCK_PANELS] || [];
    setTestRows(targetRows);
    setTestValues({});
    setAbnormalMap({});
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientEmail) {
      toast.error("Validation Error", {
        description: "Please search and select a registered patient profile.",
      });
      return;
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
      <form onSubmit={onFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800">
              <RiIdCardLine className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm">Patient Information & Lab Details</h3>
            </div>
            <div className="p-6 space-y-5">
              
              <div className="space-y-1.5 relative z-20">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Patient Email Address
                </label>
                <div className="relative flex items-center">
                  <RiSearchLine className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    ref={searchInputRef}
                    required={!patientEmail}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPatientEmail(""); 
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
                    placeholder="Type to search patients by name or email..."
                    className="rounded-xl h-10 pl-9 pr-9 border-slate-200"
                    autoComplete="off"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        clearSelection();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  )}
                </div>

                
                {isDropdownOpen && searchTerm.length > 0 && (
                  <div className="absolute z-30 w-[92%] sm:w-[85%] left-1/2 -translate-x-1/2 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-sm text-slate-500 flex items-center justify-center gap-2">
                        <RiLoader4Line className="animate-spin w-4 h-4 text-blue-600" /> Searching Registry...
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <ul className="py-1">
                        {searchResults.map((patient: PatientSearchResult) => {
                          const initial = patient.firstName ? patient.firstName.charAt(0).toUpperCase() : "?";
                          
                          return (
                            <li 
                              key={patient.id}
                              onMouseDown={() => handlePatientSelect(patient.email)} 
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center transition-colors border-b border-slate-50 last:border-b-0"
                            >
                              <div className="relative shrink-0 w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden text-blue-600 font-bold text-sm">
                                {patient.profilePhotoUrl ? (
                                  <img 
                                    src={patient.profilePhotoUrl} 
                                    alt={`${patient.firstName} ${patient.lastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{initial}</span>
                                )}
                              </div>

                              <div className="ml-3 flex flex-col flex-1 truncate">
                                <span className="text-sm font-bold text-slate-800 truncate">
                                  {patient.firstName} {patient.lastName}
                                </span>
                                <span className="text-xs text-slate-500 truncate mt-0.5">
                                  {patient.email}
                                </span>
                              </div>

                              <div className="shrink-0 ml-2">
                                <span className="inline-block px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-md">
                                  DOB: {formatDate(patient.dateOfBirth)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="p-4 text-sm text-slate-400 text-center font-medium">
                        No registered patients matching your search query.
                      </div>
                    )}
                  </div>
                )}
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

          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800">
              <RiFileUploadLine className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm">Supporting Document</h3>
            </div>
            <div className="p-6">
               <label className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl h-45 flex flex-col items-center justify-center cursor-pointer mb-4">
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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">Observation Data Entry</h3>
            <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">{testRows.length} Tests</span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-white">
                <div className="col-span-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Name</div>
                <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference Range</div>
                <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</div>
                <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</div>
              </div>

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
                          onChange={e => {
                            const newValue = e.target.value;
                            setTestValues(prev => ({ ...prev, [row.name]: newValue }));
                            setAbnormalMap(prev => ({ 
                              ...prev, 
                              [row.name]: checkIsAbnormal(newValue, row.range) 
                            }));
                          }}
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
    </div>
  );
}