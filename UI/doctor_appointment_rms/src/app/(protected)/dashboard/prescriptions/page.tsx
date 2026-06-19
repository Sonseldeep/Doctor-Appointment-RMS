"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetClinicalNotesHistory } from "@/features/appointments/hooks/use-my-appointment";
import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { 
  Calendar, 
  Pill, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  ChevronRight, 
  Filter, 
  ClipboardList, 
  Activity,
  FileText,
  Clock,
  User
} from "lucide-react";

import { 
  Calendar, 
  Pill, 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  ChevronRight, 
  Filter, 
  ClipboardList, 
  Activity,
  FileText,
  Clock,
  User
} from "lucide-react";


export default function PrescriptionHistoryPage() {
  const { data: history, isLoading } = useGetClinicalNotesHistory();
  const { data: user } = useCurrentUser();
  const updateMutation = useUpdateClinicalNote();
  
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  
  // State for follow-up logic
  const [noFollowUpNeeded, setNoFollowUpNeeded] = useState(false);
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState<string>("");

  const isDoctor = user?.role?.toLowerCase() === "doctor";
  
  const handleEditInit = (note: any) => {
    setEditForm(JSON.parse(JSON.stringify(note)));
    setNoFollowUpNeeded(!note.followUpDate);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editForm || !editForm.id) return;
    
    try {
      await updateMutation.mutateAsync({
        clinicalNoteId: editForm.id, 
        data: {
          diagnosis: editForm.diagnosis,
          observations: editForm.observations,
          treatmentSummary: editForm.treatmentSummary,
          followUpDate: noFollowUpNeeded ? null : editForm.followUpDate,
          followUpInstructions: noFollowUpNeeded ? null : editForm.followUpInstructions,
          medications: editForm.medications,
        }
      });
      setIsEditing(false);
      setSelectedNote({ ...editForm, followUpDate: noFollowUpNeeded ? null : editForm.followUpDate });
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const updateMedication = (index: number, field: string, value: any) => {
    const updatedMeds = [...editForm.medications];
    updatedMeds[index] = { ...updatedMeds[index], [field]: value };
    setEditForm({ ...editForm, medications: updatedMeds });
  };

  // Timeline Filtering
  const filteredHistory = history?.filter((note: any) => {
    if (!dateFilter) return true;
    const rawDate = note.createdAt || note.date || note.followUpDate;
    if (!rawDate) return false;
    try {
      const noteDateString = new Date(rawDate).toISOString().split("T")[0];
      return noteDateString === dateFilter;
    } catch (e) { return false; }
  });

  // Timeline Grouping
  const groupedHistory = filteredHistory?.reduce((acc: any, note: any) => {
    const rawDate = note.createdAt || note.date || note.followUpDate;
    const formattedDate = rawDate 
      ? new Date(rawDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "General History";
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(note);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 min-h-screen bg-slate-50/30">
      
      {/* --- STICKY HEADER  --- */}
<div className="flex items-center justify-between border-b border-slate-200 py-4 md:py-3 px-5 md:px-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 transition-all rounded-3xl shadow-sm">
  <div className="flex items-center gap-4">
    {selectedNote && (
      <button 
        onClick={() => { setSelectedNote(null); setIsEditing(false); }} 
        className="p-2.5 hover:bg-slate-50 text-slate-600 active:scale-95 rounded-xl transition-all border border-slate-200 shadow-sm bg-white flex items-center justify-center self-center"
      >
        <ArrowLeft size={18} className="stroke-[2.5]" />
      </button>
    )}
    <div className="flex flex-col justify-center">
      <h1 className="text-xl md:text-xl font-bold text-slate-900 tracking-tight leading-tight">
        {selectedNote ? (isEditing ? "Modify Record" : "Consultation Details") : "Prescription History"}
      </h1>
      <p className="text-xs text-slate-500 font-medium mt-1 leading-none">
        {selectedNote ? "View and update clinical indicators" : "Comprehensive electronic health logs"}
      </p>
    </div>
  </div>
  
  {selectedNote && isDoctor && !isEditing && (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => handleEditInit(selectedNote)} 
      className="rounded-xl font-semibold shadow-sm border-slate-200 bg-white hover:bg-slate-50 text-slate-700 gap-2 h-10 flex items-center justify-center self-center px-4"
    >
      <Edit3 size={15} /> Edit Note
    </Button>
  )}
</div>
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 min-h-screen bg-slate-50/30">
      
      {/* --- STICKY HEADER  --- */}
<div className="flex items-center justify-between border-b border-slate-200 py-4 md:py-3 px-5 md:px-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 transition-all rounded-3xl shadow-sm">
  <div className="flex items-center gap-4">
    {selectedNote && (
      <button 
        onClick={() => { setSelectedNote(null); setIsEditing(false); }} 
        className="p-2.5 hover:bg-slate-50 text-slate-600 active:scale-95 rounded-xl transition-all border border-slate-200 shadow-sm bg-white flex items-center justify-center self-center"
      >
        <ArrowLeft size={18} className="stroke-[2.5]" />
      </button>
    )}
    <div className="flex flex-col justify-center">
      <h1 className="text-xl md:text-xl font-bold text-slate-900 tracking-tight leading-tight">
        {selectedNote ? (isEditing ? "Modify Record" : "Consultation Details") : "Prescription History"}
      </h1>
      <p className="text-xs text-slate-500 font-medium mt-1 leading-none">
        {selectedNote ? "View and update clinical indicators" : "Comprehensive electronic health logs"}
      </p>
    </div>
  </div>
  
  {selectedNote && isDoctor && !isEditing && (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => handleEditInit(selectedNote)} 
      className="rounded-xl font-semibold shadow-sm border-slate-200 bg-white hover:bg-slate-50 text-slate-700 gap-2 h-10 flex items-center justify-center self-center px-4"
    >
      <Edit3 size={15} /> Edit Note
    </Button>
  )}
</div>

      <div>
      <div>
        {isLoading ? (
          <div className="py-24 text-center text-slate-400 font-medium tracking-wide text-sm animate-pulse flex flex-col items-center justify-center gap-3 bg-white border rounded-2xl shadow-sm">
            <Activity className="text-blue-500 animate-spin" size={24} />
            Retrieving clinical files...
          </div>
          <div className="py-24 text-center text-slate-400 font-medium tracking-wide text-sm animate-pulse flex flex-col items-center justify-center gap-3 bg-white border rounded-2xl shadow-sm">
            <Activity className="text-blue-500 animate-spin" size={24} />
            Retrieving clinical files...
          </div>
        ) : isEditing ? (
          
        
          //EDIT VIEW 
     
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-3xl mx-auto">
            
            {/* Core Diagnosis Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList size={14} className="text-blue-500" /> Primary Diagnosis
              </label>
              <Input 
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500 font-medium h-10 text-slate-900" 
                value={editForm.diagnosis} 
                onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})} 
              />
          
        
          //EDIT VIEW 
     
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in max-w-3xl mx-auto">
            
            {/* Core Diagnosis Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList size={14} className="text-blue-500" /> Primary Diagnosis
              </label>
              <Input 
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500 font-medium h-10 text-slate-900" 
                value={editForm.diagnosis} 
                onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})} 
              />
            </div>
            
            {/* Notes & Summaries Grid */}
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-500" /> Clinical Observations
                </label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-sm min-h-[100px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  value={editForm.observations} 
                  onChange={(e) => setEditForm({...editForm, observations: e.target.value})} 
                />
              </div>
            {/* Notes & Summaries Grid */}
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-500" /> Clinical Observations
                </label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-sm min-h-[100px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  value={editForm.observations} 
                  onChange={(e) => setEditForm({...editForm, observations: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-blue-500" /> Treatment Summary
                </label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-sm min-h-[100px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  value={editForm.treatmentSummary} 
                  onChange={(e) => setEditForm({...editForm, treatmentSummary: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-blue-500" /> Treatment Summary
                </label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-sm min-h-[100px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  value={editForm.treatmentSummary} 
                  onChange={(e) => setEditForm({...editForm, treatmentSummary: e.target.value})} 
                />
              </div>
            </div>
            
            {/* Follow-up Section */}
            <div className="pt-5 border-t border-slate-100 space-y-4">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 cursor-pointer select-none">
            {/* Follow-up Section */}
            <div className="pt-5 border-t border-slate-100 space-y-4">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={noFollowUpNeeded} 
                  onChange={(e) => setNoFollowUpNeeded(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                No follow-up action required
                No follow-up action required
              </label>
              
              {!noFollowUpNeeded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Follow-up Window</label>
                    <Input 
                      type="datetime-local" 
                      className="rounded-xl border-slate-200 bg-white h-10"
                      value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} 
                      onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})} 
                    />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Follow-up Window</label>
                    <Input 
                      type="datetime-local" 
                      className="rounded-xl border-slate-200 bg-white h-10"
                      value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} 
                      onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Directed Instructions</label>
                    <Input 
                      className="rounded-xl border-slate-200 bg-white h-10"
                      placeholder="e.g. Return if symptoms worsen"
                      value={editForm.followUpInstructions || ""} 
                      onChange={(e) => setEditForm({...editForm, followUpInstructions: e.target.value})} 
                    />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Directed Instructions</label>
                    <Input 
                      className="rounded-xl border-slate-200 bg-white h-10"
                      placeholder="e.g. Return if symptoms worsen"
                      value={editForm.followUpInstructions || ""} 
                      onChange={(e) => setEditForm({...editForm, followUpInstructions: e.target.value})} 
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Medications Configuration Block */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Pill size={14} className="text-blue-500" /> Active Prescriptions
              </h4>
              
              {editForm.medications && editForm.medications.map((med: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border border-slate-200/80 rounded-xl bg-white shadow-sm text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Medication Designation</label>
                    <Input className="h-9 rounded-lg border-slate-200 text-slate-800" placeholder="Medication Name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Dosage Volume</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        type="number"
                        min="1"
                        className="col-span-2 h-9 rounded-lg border-slate-200 text-slate-800"
                        placeholder="Amt" 
                        value={med.dosage?.replace(/[^\d]/g, "") || ""} 
                        onChange={(e) => {
                          const amount = e.target.value;
                          const unit = med.dosage?.includes("ml") ? "ml" : "mg";
                          updateMedication(idx, 'dosage', `${amount}${unit}`);
                        }} 
                      />
                      <select 
                        className="p-2 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none h-9 text-slate-700 font-medium" 
                        value={med.dosage?.includes("ml") ? "ml" : "mg"} 
                        onChange={(e) => {
                          const amount = med.dosage?.replace(/[^\d]/g, "") || "";
                          updateMedication(idx, 'dosage', `${amount}${e.target.value}`);
                        }}
                      >
                        <option value="mg">mg</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Frequency Metrics</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg bg-white h-9 focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}>
                        <option value="">Select Frequency</option>
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} times / day</option>)}
                    </select>
                  </div>
            {/* Medications Configuration Block */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Pill size={14} className="text-blue-500" /> Active Prescriptions
              </h4>
              
              {editForm.medications && editForm.medications.map((med: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border border-slate-200/80 rounded-xl bg-white shadow-sm text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Medication Designation</label>
                    <Input className="h-9 rounded-lg border-slate-200 text-slate-800" placeholder="Medication Name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Dosage Volume</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        type="number"
                        min="1"
                        className="col-span-2 h-9 rounded-lg border-slate-200 text-slate-800"
                        placeholder="Amt" 
                        value={med.dosage?.replace(/[^\d]/g, "") || ""} 
                        onChange={(e) => {
                          const amount = e.target.value;
                          const unit = med.dosage?.includes("ml") ? "ml" : "mg";
                          updateMedication(idx, 'dosage', `${amount}${unit}`);
                        }} 
                      />
                      <select 
                        className="p-2 border border-slate-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none h-9 text-slate-700 font-medium" 
                        value={med.dosage?.includes("ml") ? "ml" : "mg"} 
                        onChange={(e) => {
                          const amount = med.dosage?.replace(/[^\d]/g, "") || "";
                          updateMedication(idx, 'dosage', `${amount}${e.target.value}`);
                        }}
                      >
                        <option value="mg">mg</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Frequency Metrics</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg bg-white h-9 focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}>
                        <option value="">Select Frequency</option>
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} times / day</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Intake Instructions</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg bg-white h-9 focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium" value={med.instructions} onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}>
                        <option value="">Select Instruction</option>
                        <option value="Before Food">Before Food</option>
                        <option value="After Food">After Food</option>
                    </select>
                  </div>
                  
                  <div className="col-span-full space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Therapy Duration (Days)</label>
                    <Input className="h-9 rounded-lg border-slate-200 text-slate-800" placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Intake Instructions</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg bg-white h-9 focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-700 font-medium" value={med.instructions} onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}>
                        <option value="">Select Instruction</option>
                        <option value="Before Food">Before Food</option>
                        <option value="After Food">After Food</option>
                    </select>
                  </div>
                  
                  <div className="col-span-full space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Therapy Duration (Days)</label>
                    <Input className="h-9 rounded-lg border-slate-200 text-slate-800" placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Control Panel Actions */}
            <div className="flex gap-2.5 justify-end pt-5 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl shadow-sm border-slate-200 px-4 h-10 font-semibold text-slate-600 hover:bg-slate-50">
                <X size={15} className="mr-1.5" /> Cancel
              </Button>
              <Button type="button" onClick={handleUpdate} disabled={updateMutation.isPending} className="rounded-xl shadow-sm px-5 h-10 font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <Save size={15} className="mr-1.5" /> Commit Changes
              </Button>
              ))}
            </div>
            
            {/* Control Panel Actions */}
            <div className="flex gap-2.5 justify-end pt-5 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl shadow-sm border-slate-200 px-4 h-10 font-semibold text-slate-600 hover:bg-slate-50">
                <X size={15} className="mr-1.5" /> Cancel
              </Button>
              <Button type="button" onClick={handleUpdate} disabled={updateMutation.isPending} className="rounded-xl shadow-sm px-5 h-10 font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <Save size={15} className="mr-1.5" /> Commit Changes
              </Button>
            </div>
          </div>
        ) : selectedNote ? (
          
          // Read View
          <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
            
            {/* Diagnosis Module */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis File</h4>
                <p className="font-bold text-lg text-slate-900 mt-0.5">{selectedNote.diagnosis}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ClipboardList size={20} />
              </div>
          
          // Read View
          <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
            
            {/* Diagnosis Module */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis File</h4>
                <p className="font-bold text-lg text-slate-900 mt-0.5">{selectedNote.diagnosis}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ClipboardList size={20} />
              </div>
            </div>
            
            {/* Observations Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <FileText size={14} className="text-slate-400" /> Observations & Clinical Summary
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 border border-slate-100 rounded-xl whitespace-pre-line font-medium">
                  {selectedNote.observations}
                </p>
              </div>
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Activity size={14} className="text-slate-400" /> Treatment Protocol
                </h4>
                <p className="text-sm text-slate-800 font-semibold pl-1">
                  {selectedNote.treatmentSummary}
                </p>
              </div>
            </div>

            {/* Follow-up Tracking Module */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Follow-up Parameters
              </h4>
            {/* Follow-up Tracking Module */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Follow-up Parameters
              </h4>
              {selectedNote.followUpDate ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Target Window</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      {new Date(selectedNote.followUpDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Directives</p>
                    <p className="text-sm text-slate-700 font-semibold mt-0.5">{selectedNote.followUpInstructions || "Standard clinical surveillance"}</p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-medium italic py-1 pl-1">
                  Discharged — No subsequent follow-up matrix scheduled.
                </div>
                <div className="text-xs text-slate-500 font-medium italic py-1 pl-1">
                  Discharged — No subsequent follow-up matrix scheduled.
                </div>
              )}
            </div>
            
            {/* Clean, Premium Prescription Ledger (Goodbye high-contrast dark box) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <Pill size={16} className="text-blue-500 stroke-[2.5]" /> Assigned Medications
                </h4>
                <span className="text-xs font-bold bg-slate-200/70 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {selectedNote.medications?.length || 0} Units
                </span>
              </div>
              
              <div className="p-4 md:p-6 divide-y divide-slate-100">
                {selectedNote.medications?.length > 0 ? (
                  selectedNote.medications.map((med: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {med.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                          {med.instructions || "As directed by physician"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2.5 self-start sm:self-center">
                        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                          {med.dosage}
            {/* Clean, Premium Prescription Ledger (Goodbye high-contrast dark box) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <Pill size={16} className="text-blue-500 stroke-[2.5]" /> Assigned Medications
                </h4>
                <span className="text-xs font-bold bg-slate-200/70 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {selectedNote.medications?.length || 0} Units
                </span>
              </div>
              
              <div className="p-4 md:p-6 divide-y divide-slate-100">
                {selectedNote.medications?.length > 0 ? (
                  selectedNote.medications.map((med: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {med.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                          {med.instructions || "As directed by physician"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2.5 self-start sm:self-center">
                        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                          {med.dosage}
                        </span>
                        {(med.frequency || med.durationInDays) && (
                          <div className="text-xs font-semibold text-slate-600 flex gap-2">
                            <span className="bg-slate-100/80 px-2 py-1 rounded-lg text-slate-600">
                              {med.frequency}x/day
                            </span>
                            <span className="bg-slate-100/80 px-2 py-1 rounded-lg text-slate-600">
                              {med.durationInDays} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No therapeutic agents prescribed.</p>
                )}
                        {(med.frequency || med.durationInDays) && (
                          <div className="text-xs font-semibold text-slate-600 flex gap-2">
                            <span className="bg-slate-100/80 px-2 py-1 rounded-lg text-slate-600">
                              {med.frequency}x/day
                            </span>
                            <span className="bg-slate-100/80 px-2 py-1 rounded-lg text-slate-600">
                              {med.durationInDays} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No therapeutic agents prescribed.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          
         //List View
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Modern Control Filter Header */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Filter size={15} className="text-blue-500 stroke-[2.5]" />
                <span>Timeline Filter</span>
          
         //List View
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Modern Control Filter Header */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Filter size={15} className="text-blue-500 stroke-[2.5]" />
                <span>Timeline Filter</span>
              </div>
              <input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="p-1.5 px-3 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer" 
              />
              <input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="p-1.5 px-3 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer" 
              />
            </div>

            {/* Structured Medical Timeline Grid */}
            <div className="space-y-8 relative pl-5 border-l-2 border-slate-200 ml-3">
            {/* Structured Medical Timeline Grid */}
            <div className="space-y-8 relative pl-5 border-l-2 border-slate-200 ml-3">
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 text-slate-400 font-medium text-sm shadow-sm">
                  No chronological medical records found.
                </div>
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 text-slate-400 font-medium text-sm shadow-sm">
                  No chronological medical records found.
                </div>
              ) : (
                Object.entries(groupedHistory).map(([dateGroup, items]: [string, any]) => (
                  <div key={dateGroup} className="space-y-3 relative">
                    
                    {/* Floating Timeline Bullet node */}
                    <div className="absolute -left-[28.5px] top-1 bg-white w-3.5 h-3.5 rounded-full border-2 border-blue-500 ring-4 ring-slate-50" />
                    
                    <div className="flex items-center gap-1.5 mb-1 py-0.5 sticky top-[55px] z-10 w-max pr-4">
                      <Calendar size={13} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dateGroup}</span>
                  <div key={dateGroup} className="space-y-3 relative">
                    
                    {/* Floating Timeline Bullet node */}
                    <div className="absolute -left-[28.5px] top-1 bg-white w-3.5 h-3.5 rounded-full border-2 border-blue-500 ring-4 ring-slate-50" />
                    
                    <div className="flex items-center gap-1.5 mb-1 py-0.5 sticky top-[55px] z-10 w-max pr-4">
                      <Calendar size={13} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dateGroup}</span>
                    </div>
                    
                    <div className="grid gap-2.5">
                    
                    <div className="grid gap-2.5">
                      {items.map((note: any) => (
                        <button 
                          key={note.id} 
                          onClick={() => setSelectedNote(note)} 
                          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md active:scale-[0.99] transition-all text-left flex justify-between items-center group w-full"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 transition-colors">
                                <User size={14} />
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                                {isDoctor ? note.patientName : note.doctorName}
                              </h4>
                            </div>
                            <p className="text-xs text-blue-600 font-bold bg-blue-50/70 inline-block px-2.5 py-1 rounded-lg border border-blue-100/50">
                              {note.diagnosis}
                            </p>
                        <button 
                          key={note.id} 
                          onClick={() => setSelectedNote(note)} 
                          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md active:scale-[0.99] transition-all text-left flex justify-between items-center group w-full"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 transition-colors">
                                <User size={14} />
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                                {isDoctor ? note.patientName : note.doctorName}
                              </h4>
                            </div>
                            <p className="text-xs text-blue-600 font-bold bg-blue-50/70 inline-block px-2.5 py-1 rounded-lg border border-blue-100/50">
                              {note.diagnosis}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                          <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}