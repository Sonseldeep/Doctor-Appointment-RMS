"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CompleteAppointmentDto } from "../types/appointments.types";
import { useCreateClinicalNotes, useCompleteAppointment } from "../hooks/use-my-appointment";
import { toast } from "sonner";
import { PlusCircle, Trash2, CalendarDays, ClipboardCheck, Pill, Stethoscope, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export function ClinicalNotesModal({ isOpen, onClose, appointmentId }: Props) {
  const clinicalNotesMutation = useCreateClinicalNotes();
  const completeMutation = useCompleteAppointment();
  
  const [formData, setFormData] = useState({
    diagnosis: "",
    observations: "",
    treatmentSummary: "",
    followUpDate: new Date().toISOString().slice(0, 16),
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

  const handleSave = async () => {
  if (!formData.diagnosis || !formData.treatmentSummary) {
    toast.error("Please provide at least a diagnosis and treatment summary.");
    return;
  }
  
  // 1. Define the payload once
  const payload: CompleteAppointmentDto = { 
    appointmentId, 
    diagnosis: formData.diagnosis,
    observations: formData.observations,
    treatmentSummary: formData.treatmentSummary,
    followUpDate: new Date(formData.followUpDate).toISOString(),
    followUpInstructions: formData.followUpInstructions,
    medications: medications
  };

  try {
    // 2. Call the clinical notes API
    await clinicalNotesMutation.mutateAsync(payload);
    
    // 3. Call the complete appointment API
    // We pass the same payload object, no need to spread it again
    await completeMutation.mutateAsync(payload);
    
    toast.success("Clinical notes saved and appointment completed.");
    onClose();
  } catch (error) {
    console.error("Mutation failed:", error);
    toast.error("Failed to save clinical notes or complete appointment.");
  }
};
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2 border-b bg-slate-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 p-2.5 rounded-full">
              <Stethoscope size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-950">Add Clinical Notes & Prescription</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
              <ClipboardCheck className="text-gray-400" /> 1. Clinical Observations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnosis</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500"
                  value={formData.diagnosis}
                  onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observations</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500"
                  value={formData.observations}
                  onChange={e => setFormData({...formData, observations: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Treatment Summary</label>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500"
                value={formData.treatmentSummary}
                onChange={e => setFormData({...formData, treatmentSummary: e.target.value})}
              />
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center gap-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
                <Pill className="text-gray-400" /> 2. Prescription Management
              </h3>
              <button 
                type="button"
                onClick={addMedication}
                className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium hover:bg-blue-100"
              >
                <PlusCircle size={18} className="mr-2" /> Add Medication
              </button>
            </div>
            
            <div className="space-y-3">
              {medications.map((med, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 relative">
                  <button type="button" onClick={() => removeMedication(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    <input placeholder="Medication Name" className="p-2.5 border rounded-lg text-sm bg-white" value={med.name} onChange={e => updateMedication(i, 'name', e.target.value)} />
                    <input placeholder="Dosage" className="p-2.5 border rounded-lg text-sm bg-white" value={med.dosage} onChange={e => updateMedication(i, 'dosage', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input placeholder="Frequency" className="p-2.5 border rounded-lg text-sm bg-white" value={med.frequency} onChange={e => updateMedication(i, 'frequency', e.target.value)} />
                    <input type="number" placeholder="Days" className="p-2.5 border rounded-lg text-sm bg-white" value={med.durationInDays} onChange={e => updateMedication(i, 'durationInDays', parseInt(e.target.value))} />
                    <input placeholder="Instructions" className="p-2.5 border rounded-lg text-sm bg-white md:col-span-2" value={med.instructions} onChange={e => updateMedication(i, 'instructions', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CalendarDays className="text-gray-400" /> 3. Follow-up Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <input type="datetime-local" className="p-3 border border-gray-200 rounded-xl text-sm" value={formData.followUpDate} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
              <input placeholder="Follow-up instructions" className="p-3 border border-gray-200 rounded-xl text-sm md:col-span-2" value={formData.followUpInstructions} onChange={e => setFormData({...formData, followUpInstructions: e.target.value})} />
            </div>
          </section>
        </div>

        <DialogFooter className="p-6 pt-2 border-t bg-slate-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="py-2.5 px-6 border rounded-xl text-gray-700 hover:bg-gray-100">Cancel</button>
          <button 
            type="button"
            onClick={handleSave} 
            disabled={clinicalNotesMutation.isPending || completeMutation.isPending}
            className="py-2.5 px-10 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {(clinicalNotesMutation.isPending || completeMutation.isPending) ? "Finalizing..." : <><Save size={18} /> Submit Consultation</>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}