"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
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
  RiCloseLine,
  RiDeleteBinLine,
  RiAddLine,
  RiFilePdf2Line
} from "@remixicon/react";
import { PatientSearchResult } from "@/features/lab-reports/types/lab-reports.types";

const DOCK_PANELS = {
  "Full Blood Count": [
    { testName: "Hemoglobin and Red Blood Cell (RBC)", unit: "g/dL", referenceRange: "13.8-17.2", value: "", isAbnormal: false },
    { testName: "White Blood Cell (WBC)", unit: "x10^3/µL", referenceRange: "4.5-11.0", value: "", isAbnormal: false },
    { testName: "Platelet Count", unit: "x10^3/µL", referenceRange: "150-450", value: "", isAbnormal: false }
  ],
  "Lipid Panel": [
    { testName: "Total Cholesterol", unit: "mg/dL", referenceRange: "< 200", value: "", isAbnormal: false },
    { testName: "HDL Cholesterol", unit: "mg/dL", referenceRange: "> 40", value: "", isAbnormal: false },
    { testName: "LDL Cholesterol", unit: "mg/dL", referenceRange: "< 100", value: "", isAbnormal: false }
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
  
  if (cleanRange.startsWith('<')) return val >= parseFloat(cleanRange.substring(1));
  if (cleanRange.startsWith('>')) return val <= parseFloat(cleanRange.substring(1));
  if (cleanRange.includes('-')) {
    const [minStr, maxStr] = cleanRange.split('-');
    return val < parseFloat(minStr) || val > parseFloat(maxStr);
  }
  return false;
};

type FormValues = {
  labName: string;
  panelName: string;
  observations: {
    testName: string;
    unit: string;
    referenceRange: string;
    value: string;
    isAbnormal: boolean;
  }[];
};

export default function LabIngestPage() {
  // Patient Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // File Array State
  const [documents, setDocuments] = useState<File[]>([]);

  // React Hook Form Initialization
  const { register, control, handleSubmit, setValue, getValues, watch, reset } = useForm<FormValues>({
    defaultValues: {
      labName: "Apex Diagnostics",
      panelName: "Lipid Panel",
      observations: DOCK_PANELS["Lipid Panel"]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "observations"
  });

  // Watch panel changes
  const selectedPanel = watch("panelName");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["patientSearchLab", debouncedSearch],
    queryFn: () => labReportsApi.searchLabPatients(debouncedSearch),
    enabled: debouncedSearch.length > 1, 
  });

  const { mutate: uploadReport, isPending } = useMutation({
    mutationFn: (payload: IngestLabReportDto) => labReportsApi.ingestLabReport(payload),
    onSuccess: () => {
      toast.success("Ingestion Completed", {
        description: "Medical lab report has been recorded safely.",
      });
      // Reset everything on success
      setPatientEmail("");
      setSearchTerm("");
      setDocuments([]);
      reset({
        labName: getValues("labName"),
        panelName: getValues("panelName"),
        observations: DOCK_PANELS[getValues("panelName") as keyof typeof DOCK_PANELS] || []
      });
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

  // UPDATED: Appends panels instead of replacing them
  const handleAddPanel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosenPanel = e.target.value;
    const targetRows = DOCK_PANELS[chosenPanel as keyof typeof DOCK_PANELS] || [];
    append(targetRows);
  };

  const handleFileDrop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = (indexToRemove: number) => {
    setDocuments(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = (data: FormValues) => {
    if (!patientEmail) {
      toast.error("Validation Error", { description: "Please search and select a registered patient profile." });
      return;
    }

    const payload: IngestLabReportDto = {
      patientEmail,
      labName: data.labName,
      panelName: data.panelName,
      observationDate: new Date().toISOString(),
      // Ensure empty values default to "0.0"
      observations: data.observations.map(obs => ({
        ...obs,
        value: obs.value || "0.0",
      })),
      documents: documents,
    };

    uploadReport(payload);
  };

  const showSpinner = searchTerm.length > 0 && (searchTerm.length < 2 || isSearching);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PATIENT & LAB INFO */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800">
              <RiIdCardLine className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm">Patient Information & Lab Details</h3>
            </div>
            <div className="p-6 space-y-5">
              
              {/* PATIENT SEARCH */}
              <div className="space-y-1.5 relative z-20">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Patient Email Address
                </label>
                <div className="relative flex items-center">
                  {showSpinner ? (
                    <RiLoader4Line className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 animate-spin" />
                  ) : (
                    <RiSearchLine className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  )}
                  
                  <Input
                    ref={searchInputRef}
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
                    className="rounded-xl h-10 pl-9 pr-9 border-slate-200 focus-visible:ring-blue-600"
                    autoComplete="off"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setSearchTerm(""); setPatientEmail(""); setIsDropdownOpen(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {isDropdownOpen && searchTerm.length > 0 && (
                  <div className="absolute w-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                    {showSpinner ? (
                      <div className="p-8 text-sm text-slate-500 flex flex-col items-center justify-center gap-2">
                        <RiLoader4Line className="animate-spin w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-xs text-slate-400 tracking-wide">Searching registry...</span>
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <ul className="py-1">
                        {searchResults.map((patient: PatientSearchResult) => {
                          const imageUrl = patient.profilePhotoUrl || (patient as any).profilePictureUrl || (patient as any).profilePhoto || (patient as any).photoUrl;
                          
                          return (
                            <li 
                              key={patient.id}
                              onMouseDown={() => handlePatientSelect(patient.email)} 
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center transition-colors border-b border-slate-50 last:border-b-0"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                                {imageUrl ? (
                                  <img src={imageUrl} alt={patient.firstName} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-blue-700 font-semibold text-sm">
                                    {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                  </span>
                                )}
                              </div>

                              <div className="ml-3 flex flex-col flex-1">
                                <span className="text-sm font-bold text-slate-800">{patient.firstName} {patient.lastName}</span>
                                <span className="text-xs text-slate-500 mt-0.5">{patient.email}</span>
                              </div>
                              <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-md">
                                DOB: {formatDate(patient.dateOfBirth)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <RiSearchLine className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-sm text-slate-700 font-semibold">No matches found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* LAB NAME & PANEL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lab Facility</label>
                <Input required {...register("labName")} className="rounded-xl h-10 border-slate-200" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add Test Panel Template</label>
                <select
                  value="" 
                  onChange={handleAddPanel}
                  className="w-full bg-white border border-slate-200 h-10 px-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="" disabled>Select a panel to add...</option>
                  <option value="Full Blood Count">Full Blood Count</option>
                  <option value="Lipid Panel">Lipid Panel</option>
                </select>
              </div>
            </div>
          </div>

          {/* MULTI-FILE UPLOAD ZONE */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex gap-2 items-center text-slate-800 shrink-0">
              <RiFileUploadLine className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm">Supporting Documents</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
               <label className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl py-6 flex flex-col items-center justify-center cursor-pointer mb-4">
                  <RiUploadCloud2Line className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">Drag & Drop</span>
                  <span className="text-xs text-slate-400 mt-1">or click to add files</span>
                  <input 
                    type="file" 
                    multiple
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileDrop}
                  />
               </label>
               
               {/* Document Roster */}
               {documents.length > 0 ? (
                 <div className="space-y-2 flex-1 overflow-y-auto max-h-[160px] pr-1">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <RiFilePdf2Line className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 truncate">{doc.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <RiCloseLine className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="space-y-1.5 mt-auto">
                   <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><RiImage2Line className="w-3.5 h-3.5" /> Supports: PDF, JPG, PNG</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* OBSERVATION TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">Observation Data Entry</h3>
            <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">{fields.length} Tests</span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-white items-center">
                <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Name</div>
                <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</div>
                <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Ref. Range</div>
                <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</div>
                <div className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</div>
                <div className="col-span-1 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</div>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {fields.map((field, idx) => {
                   const isAbnormal = watch(`observations.${idx}.isAbnormal`);
                   
                   return (
                    <div key={field.id} className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-slate-50/50 transition-colors">
                      
                      {/* Name */}
                      <div className="col-span-3">
                        <Input required {...register(`observations.${idx}.testName`)} className="h-9 text-sm" placeholder="e.g., Hemoglobin" />
                      </div>
                      
                      {/* Unit */}
                      <div className="col-span-2">
                        <Input {...register(`observations.${idx}.unit`)} className="h-9 text-sm" placeholder="e.g., g/dL" />
                      </div>

                      {/* Reference Range */}
                      <div className="col-span-2">
                        <Input 
                           {...register(`observations.${idx}.referenceRange`)} 
                           className="h-9 text-sm bg-slate-50 border-slate-200" 
                           placeholder="e.g., 13.8-17.2"
                           onChange={(e) => {
       
                             setValue(`observations.${idx}.referenceRange`, e.target.value);
                             const currentVal = getValues(`observations.${idx}.value`);
                             if (currentVal) {
                               setValue(`observations.${idx}.isAbnormal`, checkIsAbnormal(currentVal, e.target.value));
                             }
                           }}
                        />
                      </div>

                      <div className="col-span-2">
                        <Input 
                          required 
                          placeholder="0.0"
                          {...register(`observations.${idx}.value`)}
                          onChange={e => {
                            const val = e.target.value;
                            setValue(`observations.${idx}.value`, val);
                            const currentRange = getValues(`observations.${idx}.referenceRange`);
                            setValue(`observations.${idx}.isAbnormal`, checkIsAbnormal(val, currentRange));
                          }}
                          className="w-full h-9 rounded-lg border-slate-200 text-sm font-medium"
                        />
                      </div>

                      <div className="col-span-2">
                        <button 
                          type="button" 
                          onClick={() => setValue(`observations.${idx}.isAbnormal`, !isAbnormal)} 
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border transition-colors w-full justify-center ${
                              isAbnormal 
                              ? "bg-red-50 text-red-600 border-red-200" 
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <RiCheckLine className="w-3.5 h-3.5" />
                          {isAbnormal ? "Abnormal" : "Normal"}
                        </button>
                      </div>

                      <div className="col-span-1 flex justify-end">
                         <button 
                           type="button" 
                           onClick={() => remove(idx)}
                           className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                         >
                           <RiDeleteBinLine className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                   )
                })}
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                 <button
                   type="button"
                   onClick={() => append({ testName: "", unit: "", referenceRange: "", value: "", isAbnormal: false })}
                   className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                 >
                    <RiAddLine className="w-4 h-4" />
                    Add Custom Test
                 </button>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-[#f0f5ff] text-blue-800 p-4 rounded-xl flex gap-3 items-start text-sm border border-[#d6e4ff]">
          <RiInformationLine className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Smart Auto-Flagging:</span> Values outside the reference range are automatically flagged as abnormal. You can manually toggle this status or add unlimited custom test rows below the template.
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