"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompleteAppointmentDto } from "../types/appointments.types";
import { useCreateClinicalNotes, useCompleteAppointment } from "../hooks/use-my-appointment";
import { useMyAvailability, useDoctorAvailabilityByDate } from "@/features/availability/hooks/use-availability";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { toast } from "sonner";
import { PlusCircle, Trash2, CalendarDays, ClipboardCheck, Pill, Stethoscope, Save, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export function ClinicalNotesModal({ isOpen, onClose, appointmentId }: Props) {
  const clinicalNotesMutation = useCreateClinicalNotes();
  const completeMutation = useCompleteAppointment();
  
  // Auth & Availability Data
  const { data: currentUser } = useCurrentUser();
  const { data: availableDates, isLoading: isLoadingDates } = useMyAvailability();
  
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);
  const [noFollowUpNeeded, setNoFollowUpNeeded] = useState(false);
  
  // Slot Selection State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Fetch slots when a date is selected
  const { data: slotData, isLoading: isLoadingSlots } = useDoctorAvailabilityByDate(
    (currentUser as any)?.id || (currentUser as any)?.userId, 
    selectedDate
  );

  // Safely extract slots regardless of API return structure to satisfy TypeScript
  const availableSlots = Array.isArray(slotData) 
    ? slotData 
    : (slotData as any)?.slots || (slotData as any)?.data || [];

  const [formData, setFormData] = useState({
    diagnosis: "",
    observations: "",
    treatmentSummary: "",
    followUpInstructions: "",
  });

  const [medications, setMedications] = useState<CompleteAppointmentDto['medications']>([]);

  const addMedication = () => {
    setMedications([
      ...medications, 
      { name: "", dosage: "", frequency: "", durationInDays: 0, instructions: "" }
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof CompleteAppointmentDto['medications'][0], value: any) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const isSectionComplete = (section: number) => {
    switch (section) {
      case 1:
        return formData.diagnosis.trim() !== "" && formData.treatmentSummary.trim() !== "";
      case 2:
        return true;
      case 3:
        return noFollowUpNeeded || !!selectedSlotId;
      default:
        return false;
    }
  };

  const handleSave = async () => {
    // 1. Validation
    if (!formData.diagnosis || !formData.treatmentSummary) {
      toast.error("Please provide at least a diagnosis and treatment summary.");
      return;
    }
    if (!noFollowUpNeeded && !selectedSlotId) {
      toast.error("Please select a follow-up time slot or check 'No follow-up required'.");
      return;
    }
    
    // 2. Separate Payloads
    // Create the full payload for the notes endpoint
    const notesPayload = { 
      appointmentId, 
      diagnosis: formData.diagnosis,
      observations: formData.observations,
      treatmentSummary: formData.treatmentSummary,
      followUpSlotId: noFollowUpNeeded ? null : selectedSlotId,
      followUpInstructions: noFollowUpNeeded || !formData.followUpInstructions 
        ? "" 
        : formData.followUpInstructions,
      medications: medications
    };// Cast as any if other local types haven't refreshed, preserving TS safety

    const completionPayload = { 
      appointmentId 
    };

    try {
      // 3. Sequential Mutations
      // First, save the notes
      await clinicalNotesMutation.mutateAsync(notesPayload as any);
      
      // Then, complete the appointment
      await completeMutation.mutateAsync(completionPayload as any);
      
      toast.success("Clinical notes saved and appointment completed.");
      onClose();
    } catch (error: any) {
      console.error("Mutation failed:", error);
      
      const backendDetail = error?.response?.data?.detail || error?.detail;
      const statusCode = error?.response?.status || error?.status;
      const errorCode = error?.response?.data?.type || error?.type;

      if (statusCode === 409 || errorCode === "ClinicalNote.AlreadyExists" || backendDetail?.includes("already exists")) {
        toast.error("A clinical note has already been submitted for this appointment.");
      } else if (backendDetail) {
        toast.error(backendDetail);
      } else {
        toast.error("An unexpected error occurred while saving.");
      }
    }
  };

  const showSubmitButton = currentSection === 3 || (currentSection === 2 && noFollowUpNeeded);

  // Helper to format date cleanly (e.g., "Thursday, Jul 16")
  const formatDateString = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(date);
  };

  // Helper to format time cleanly (e.g., "13:00")
  const formatTimeStr = (timeString: string) => {
    if (!timeString) return "";
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return timeString.substring(0, 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] w-[95%] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 animate-fade-in-scale">
        
        {/* Header Section */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2.5 rounded-full shadow-lg">
              <Stethoscope size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Add Clinical Notes & Prescription
            </DialogTitle>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((section) => {
              const isTabDisabled = section === 3 && noFollowUpNeeded;
              return (
                <button
                  key={section}
                  type="button"
                  disabled={isTabDisabled}
                  onClick={() => setCurrentSection(section as 1 | 2 | 3)}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentSection === section
                      ? "bg-white text-blue-600 shadow-md border border-slate-100"
                      : isTabDisabled
                        ? "bg-slate-100/40 text-slate-400 cursor-not-allowed opacity-50"
                        : "bg-slate-100/70 text-slate-500 hover:bg-slate-100"
                  } flex items-center justify-center gap-2`}
                >
                  {section === 1 && "Clinical"}
                  {section === 2 && "Prescription"}
                  {section === 3 && "Follow-up"}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Section 1: Clinical Observations */}
          {currentSection === 1 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardCheck className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">1. Clinical Observations</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Diagnosis <span className="text-red-500">*</span></label>
                  <textarea 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus:ring-2 focus:ring-blue-500 bg-white transition-smooth hover:border-gray-300"
                    placeholder="Enter patient diagnosis..."
                    value={formData.diagnosis}
                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Observations</label>
                  <textarea 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus:ring-2 focus:ring-blue-500 bg-white transition-smooth hover:border-gray-300"
                    placeholder="Clinical observations and notes..."
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Treatment Summary <span className="text-red-500">*</span></label>
                <textarea 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[110px] focus:ring-2 focus:ring-blue-500 bg-white transition-smooth hover:border-gray-300"
                  placeholder="Describe the treatment provided..."
                  value={formData.treatmentSummary}
                  onChange={e => setFormData({...formData, treatmentSummary: e.target.value})}
                />
              </div>
            </section>
          )}

          {/* Section 2: Prescription Management */}
          {currentSection === 2 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <Pill className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">2. Prescription Management</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">
                    <input
                      type="checkbox"
                      id="no-follow-up"
                      checked={noFollowUpNeeded}
                      onChange={(e) => {
                        setNoFollowUpNeeded(e.target.checked);
                        if (e.target.checked) {
                          setSelectedDate(null);
                          setSelectedSlotId(null);
                          setFormData({ ...formData, followUpInstructions: "" });
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="no-follow-up" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                      No follow-up required
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-smooth hover:scale-105 active:scale-95"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add Medication
                  </button>
                </div>
              </div>

              {medications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                  <Pill size={40} className="text-slate-300 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">No medications added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med, i) => (
                    <div key={i} className="bg-white border-2 border-gray-200 p-5 rounded-xl space-y-4 relative hover:border-gray-300 transition-smooth group">
                      <div className="absolute top-4 right-4">
                        <button type="button" onClick={() => removeMedication(i)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="text-sm font-medium text-gray-600 mb-3">Medication #{i + 1}</div>
                      
                      <div>
                        <input placeholder="Medication Name" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500" value={med.name} onChange={(e) => updateMedication(i, "name", e.target.value)} />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Dosage</label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            min="1"
                            placeholder="Amount"
                            className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                            value={med.dosage?.replace(/[^\d]/g, "") || ""}
                            onChange={(e) => {
                              const amount = e.target.value;
                              const unit = med.dosage?.includes("ml") ? "ml" : "mg";
                              updateMedication(i, "dosage", `${amount}${unit}`);
                            }}
                          />
                          <select
                            className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={med.dosage?.includes("ml") ? "ml" : "mg"}
                            onChange={(e) => {
                              const amount = med.dosage?.replace(/[^\d]/g, "") || "";
                              updateMedication(i, "dosage", `${amount}${e.target.value}`);
                            }}
                          >
                            <option value="mg">mg</option>
                            <option value="ml">ml</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Frequency</label>
                          <select
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={med.frequency}
                            onChange={(e) => updateMedication(i, "frequency", e.target.value)}
                          >
                            <option value="">Select Frequency</option>
                            <option value="Once Daily">Once Daily (1x)</option>
                            <option value="Twice Daily">Twice Daily (2x)</option>
                            <option value="Three Times Daily">Three Times Daily (3x)</option>
                            <option value="Four Times Daily">Four Times Daily (4x)</option>
                            <option value="Every 8 Hours">Every 8 Hours</option>
                            <option value="Every 12 Hours">Every 12 Hours</option>
                            <option value="As Needed (PRN)">As Needed (PRN)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Duration (Days)</label>
                          <input type="number" min="1" placeholder="Days" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500" value={med.durationInDays || ""} onChange={(e) => updateMedication(i, "durationInDays", parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Instructions</label>
                          <select
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={med.instructions}
                            onChange={(e) => updateMedication(i, "instructions", e.target.value)}
                          >
                            <option value="">Select Instruction</option>
                            <option value="Before Food">Before Food</option>
                            <option value="After Food">After Food</option>
                            <option value="With Food">With Food</option>
                            <option value="Empty Stomach">Empty Stomach</option>
                            <option value="Before Bed">Before Bed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Section 3: Follow-up Details (Dynamic Time Slots) */}
          {currentSection === 3 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-5">
                <CalendarDays className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">3. Select Follow-up Slot</h3>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3 mb-6">
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">Select an available date and time slot from your schedule below to secure the follow-up appointment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Select Date */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 mb-2">Select Date</label>
                  {isLoadingDates ? (
                    <div className="text-sm text-slate-500 animate-pulse">Loading schedule...</div>
                  ) : availableDates?.length === 0 ? (
                    <div className="text-sm text-slate-500 border border-dashed rounded-lg p-4 text-center">No availability configured.</div>
                  ) : (
                    <div className="space-y-2">
                      {availableDates?.map((av: any) => (
                        <button
                          key={av.availabilityId || av.id}
                          onClick={() => {
                            setSelectedDate(av.date);
                            setSelectedSlotId(null);
                          }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedDate === av.date
                              ? "border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm"
                              : "border-slate-100 bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span className="font-medium text-sm">{formatDateString(av.date)}</span>
                          <div className="text-xs mt-1 opacity-70 flex justify-between">
                            <span>Select to view times</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Right Column: Select Time */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                    Select Time
                    {selectedSlotId && <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Slot Selected</span>}
                  </label>
                  
                  {!selectedDate ? (
                     <div className="h-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-sm">
                       Please select a date first
                     </div>
                  ) : isLoadingSlots ? (
                     <div className="h-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-sm animate-pulse">
                       Loading time slots...
                     </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 content-start">
                      {availableSlots.map((slot: any) => (
                        <button
                          key={slot.slotId || slot.id}
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlotId(slot.slotId || slot.id)}
                          className={`
                            py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all duration-200 flex items-center justify-center gap-2
                            ${slot.isBooked 
                              ? "border-slate-100 bg-slate-100/50 text-slate-400 cursor-not-allowed" 
                              : selectedSlotId === (slot.slotId || slot.id)
                                ? "border-blue-500 bg-blue-600 text-white shadow-md hover:bg-blue-700"
                                : "border-slate-100 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                            }
                          `}
                        >
                          {!slot.isBooked && selectedSlotId !== (slot.slotId || slot.id) && <Clock size={14} className="opacity-50" />}
                          {formatTimeStr(slot.startTime || slot.startUtc)}
                        </button>
                      ))}
                      {availableSlots.length === 0 && (
                        <div className="col-span-2 text-center p-4 text-sm text-slate-500">
                          No slots available for this date.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions input at bottom of Section 3 */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Instructions (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., Fast for 12 hours before next visit..." 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white transition-smooth hover:border-gray-300"
                  value={formData.followUpInstructions} 
                  onChange={e => setFormData({...formData, followUpInstructions: e.target.value})} 
                />
              </div>
            </section>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-6 border-t bg-gradient-to-r from-slate-50 to-blue-50 sm:flex-row flex items-center justify-between w-full gap-4 rounded-b-[inherit]">
          <div>
            <button type="button" onClick={onClose} className="h-11 px-6 border-2 border-gray-300 bg-white rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center transition-all duration-200 shadow-sm">
              Cancel
            </button>
          </div>

          <div className="flex gap-2">
            {currentSection > 1 && (
              <button 
                type="button"
                onClick={() => setCurrentSection((currentSection - 1) as 1 | 2 | 3)}
                className="h-11 px-6 border-2 border-gray-300 bg-white rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                Previous
              </button>
            )}
            
            {showSubmitButton ? (
              <button 
                type="button"
                onClick={handleSave} 
                disabled={clinicalNotesMutation.isPending || completeMutation.isPending || (!noFollowUpNeeded && !selectedSlotId)}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(clinicalNotesMutation.isPending || completeMutation.isPending) ? (
                  <>
                    <div className="animate-pulse">⏳</div>
                    Finalizing...
                  </>
                ) : (
                  <>
                    <Save size={18} /> 
                    Submit Consultation
                  </>
                )}
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setCurrentSection((currentSection + 1) as 1 | 2 | 3)}
                disabled={!isSectionComplete(currentSection)}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}