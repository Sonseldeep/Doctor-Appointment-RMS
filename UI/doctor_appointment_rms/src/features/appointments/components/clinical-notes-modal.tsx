// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { CompleteAppointmentDto } from "../types/appointments.types";
// import { useCreateClinicalNotes, useCompleteAppointment } from "../hooks/use-my-appointment";
// import { toast } from "sonner";
// import { PlusCircle, Trash2, CalendarDays, ClipboardCheck, Pill, Stethoscope, Save } from "lucide-react";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   appointmentId: string;
// }

// export function ClinicalNotesModal({ isOpen, onClose, appointmentId }: Props) {
//   const clinicalNotesMutation = useCreateClinicalNotes();
//   const completeMutation = useCompleteAppointment();
  
//   const [formData, setFormData] = useState({
//     diagnosis: "",
//     observations: "",
//     treatmentSummary: "",
//     followUpDate: new Date().toISOString().slice(0, 16),
//     followUpInstructions: "",
//   });

//   const [medications, setMedications] = useState<CompleteAppointmentDto['medications']>([]);

//   const addMedication = () => {
//     setMedications([
//       ...medications, 
//       { name: "", dosage: "", frequency: "", durationInDays: 0, instructions: "" }
//     ]);
//   };

//   const removeMedication = (index: number) => {
//     setMedications(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateMedication = (index: number, field: keyof CompleteAppointmentDto['medications'][0], value: any) => {
//     setMedications(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const handleSave = async () => {
//   if (!formData.diagnosis || !formData.treatmentSummary) {
//     toast.error("Please provide at least a diagnosis and treatment summary.");
//     return;
//   }
  
//   // 1. Define the payload once
//   const payload: CompleteAppointmentDto = { 
//     appointmentId, 
//     diagnosis: formData.diagnosis,
//     observations: formData.observations,
//     treatmentSummary: formData.treatmentSummary,
//     followUpDate: new Date(formData.followUpDate).toISOString(),
//     followUpInstructions: formData.followUpInstructions,
//     medications: medications
//   };

//   try {
//     // 2. Call the clinical notes API
//     await clinicalNotesMutation.mutateAsync(payload);
    
//     // 3. Call the complete appointment API
//     // We pass the same payload object, no need to spread it again
//     await completeMutation.mutateAsync(payload);
    
//     toast.success("Clinical notes saved and appointment completed.");
//     onClose();
//   } catch (error) {
//     console.error("Mutation failed:", error);
//     toast.error("Failed to save clinical notes or complete appointment.");
//   }
// };
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
//         <DialogHeader className="p-6 pb-2 border-b bg-slate-50 rounded-t-lg">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-100 text-blue-700 p-2.5 rounded-full">
//               <Stethoscope size={24} />
//             </div>
//             <DialogTitle className="text-2xl font-bold text-gray-950">Add Clinical Notes & Prescription</DialogTitle>
//           </div>
//         </DialogHeader>
        
//         <div className="p-6 space-y-8">
//           <section className="space-y-4">
//             <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
//               <ClipboardCheck className="text-gray-400" /> 1. Clinical Observations
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnosis</label>
//                 <textarea 
//                   className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500"
//                   value={formData.diagnosis}
//                   onChange={e => setFormData({...formData, diagnosis: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Observations</label>
//                 <textarea 
//                   className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500"
//                   value={formData.observations}
//                   onChange={e => setFormData({...formData, observations: e.target.value})}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Treatment Summary</label>
//               <textarea 
//                 className="w-full p-3 border border-gray-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500"
//                 value={formData.treatmentSummary}
//                 onChange={e => setFormData({...formData, treatmentSummary: e.target.value})}
//               />
//             </div>
//           </section>

//           <section className="space-y-4 pt-6 border-t border-gray-100">
//             <div className="flex justify-between items-center gap-4">
//               <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
//                 <Pill className="text-gray-400" /> 2. Prescription Management
//               </h3>
//               <button 
//                 type="button"
//                 onClick={addMedication}
//                 className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium hover:bg-blue-100"
//               >
//                 <PlusCircle size={18} className="mr-2" /> Add Medication
//               </button>
//             </div>
            
//             <div className="space-y-3">
//               {medications.map((med, i) => (
//                 <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 relative">
//                   <button type="button" onClick={() => removeMedication(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
//                     <Trash2 size={18} />
//                   </button>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
//                     <input placeholder="Medication Name" className="p-2.5 border rounded-lg text-sm bg-white" value={med.name} onChange={e => updateMedication(i, 'name', e.target.value)} />
//                     <input placeholder="Dosage" className="p-2.5 border rounded-lg text-sm bg-white" value={med.dosage} onChange={e => updateMedication(i, 'dosage', e.target.value)} />
//                   </div>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     <input placeholder="Frequency" className="p-2.5 border rounded-lg text-sm bg-white" value={med.frequency} onChange={e => updateMedication(i, 'frequency', e.target.value)} />
//                     <input type="number" placeholder="Days" className="p-2.5 border rounded-lg text-sm bg-white" value={med.durationInDays} onChange={e => updateMedication(i, 'durationInDays', parseInt(e.target.value))} />
//                     <input placeholder="Instructions" className="p-2.5 border rounded-lg text-sm bg-white md:col-span-2" value={med.instructions} onChange={e => updateMedication(i, 'instructions', e.target.value)} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section className="space-y-4 pt-6 border-t border-gray-100">
//             <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
//               <CalendarDays className="text-gray-400" /> 3. Follow-up Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               <input type="datetime-local" className="p-3 border border-gray-200 rounded-xl text-sm" value={formData.followUpDate} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
//               <input placeholder="Follow-up instructions" className="p-3 border border-gray-200 rounded-xl text-sm md:col-span-2" value={formData.followUpInstructions} onChange={e => setFormData({...formData, followUpInstructions: e.target.value})} />
//             </div>
//           </section>
//         </div>

//         <DialogFooter className="p-6 pt-2 border-t bg-slate-50 rounded-b-lg">
//           <button type="button" onClick={onClose} className="py-2.5 px-6 border rounded-xl text-gray-700 hover:bg-gray-100">Cancel</button>
//           <button 
//             type="button"
//             onClick={handleSave} 
//             disabled={clinicalNotesMutation.isPending || completeMutation.isPending}
//             className="py-2.5 px-10 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {(clinicalNotesMutation.isPending || completeMutation.isPending) ? "Finalizing..." : <><Save size={18} /> Submit Consultation</>}
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { CompleteAppointmentDto } from "../types/appointments.types";
// import { useCreateClinicalNotes, useCompleteAppointment } from "../hooks/use-my-appointment";
// import { toast } from "sonner";
// import { PlusCircle, Trash2, CalendarDays, ClipboardCheck, Pill, Stethoscope, Save, CheckCircle2, AlertCircle } from "lucide-react";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   appointmentId: string;
// }

// export function ClinicalNotesModal({ isOpen, onClose, appointmentId }: Props) {
//   const clinicalNotesMutation = useCreateClinicalNotes();
//   const completeMutation = useCompleteAppointment();
  
//   const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);
//   const [formData, setFormData] = useState({
//     diagnosis: "",
//     observations: "",
//     treatmentSummary: "",
//     followUpDate: new Date().toISOString().slice(0, 16),
//     followUpInstructions: "",
//   });

//   const [medications, setMedications] = useState<CompleteAppointmentDto['medications']>([]);

//   const addMedication = () => {
//     setMedications([
//       ...medications, 
//       { name: "", dosage: "", frequency: "", durationInDays: 0, instructions: "" }
//     ]);
//   };

//   const removeMedication = (index: number) => {
//     setMedications(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateMedication = (index: number, field: keyof CompleteAppointmentDto['medications'][0], value: any) => {
//     setMedications(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const isSectionComplete = (section: number) => {
//     switch (section) {
//       case 1:
//         return formData.diagnosis.trim() !== "" && formData.treatmentSummary.trim() !== "";
//       case 2:
//         return true;
//       case 3:
//         return formData.followUpDate !== "";
//       default:
//         return false;
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.diagnosis || !formData.treatmentSummary) {
//       toast.error("Please provide at least a diagnosis and treatment summary.");
//       return;
//     }
    
//     const payload: CompleteAppointmentDto = { 
//       appointmentId, 
//       diagnosis: formData.diagnosis,
//       observations: formData.observations,
//       treatmentSummary: formData.treatmentSummary,
//       followUpDate: new Date(formData.followUpDate).toISOString(),
//       followUpInstructions: formData.followUpInstructions,
//       medications: medications
//     };

//     try {
//       await clinicalNotesMutation.mutateAsync(payload);
//       await completeMutation.mutateAsync(payload);
//       toast.success("Clinical notes saved and appointment completed.");
//       onClose();
//     } catch (error) {
//       console.error("Mutation failed:", error);
//       toast.error("Failed to save clinical notes or complete appointment.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 animate-fade-in-scale">
//         {/* Header */}
//         <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2.5 rounded-full shadow-lg">
//               <Stethoscope size={24} />
//             </div>
//             <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
//               Add Clinical Notes & Prescription
//             </DialogTitle>
//           </div>
          
//           {/* Progress Indicator */}
// <div className="flex gap-2">
//   {[1, 2, 3].map((section) => (
//     <button
//       key={section}
//       onClick={() => setCurrentSection(section as 1 | 2 | 3)}
//       className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
//         currentSection === section
//           ? "bg-white text-blue-600 shadow-md border border-slate-100"
//           : "bg-slate-100/70 text-slate-500 hover:bg-slate-100"
//       } flex items-center justify-center gap-2`}
//     >
//       {section === 1 && "Clinical"}
//       {section === 2 && "Prescription"}
//       {section === 3 && "Follow-up"}
//     </button>
//   ))}
// </div>
//         </DialogHeader>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {/* Section 1: Clinical Observations */}
//           {currentSection === 1 && (
//             <section className="space-y-5 animate-slide-up">
//               <div className="flex items-center gap-2 mb-5">
//                 <ClipboardCheck className="text-blue-600" size={20} />
//                 <h3 className="text-lg font-semibold text-gray-900">1. Clinical Observations</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Diagnosis <span className="text-red-500">*</span>
//                   </label>
//                   <textarea 
//                     className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus-ring bg-white transition-smooth hover:border-gray-300"
//                     placeholder="Enter patient diagnosis..."
//                     value={formData.diagnosis}
//                     onChange={e => setFormData({...formData, diagnosis: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Observations
//                   </label>
//                   <textarea 
//                     className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus-ring bg-white transition-smooth hover:border-gray-300"
//                     placeholder="Clinical observations and notes..."
//                     value={formData.observations}
//                     onChange={e => setFormData({...formData, observations: e.target.value})}
//                   />
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Treatment Summary <span className="text-red-500">*</span>
//                 </label>
//                 <textarea 
//                   className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[110px] focus-ring bg-white transition-smooth hover:border-gray-300"
//                   placeholder="Describe the treatment provided..."
//                   value={formData.treatmentSummary}
//                   onChange={e => setFormData({...formData, treatmentSummary: e.target.value})}
//                 />
//               </div>

//               {/* Section Complete Indicator */}
//               {isSectionComplete(1) && (
//                 <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <CheckCircle2 size={18} className="text-green-600" />
//                   <span className="text-sm text-green-700 font-medium">Section completed</span>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* Section 2: Prescription Management */}
//           {currentSection === 2 && (
//             <section className="space-y-5 animate-slide-up">
//               <div className="flex items-center justify-between gap-2 mb-5">
//                 <div className="flex items-center gap-2">
//                   <Pill className="text-blue-600" size={20} />
//                   <h3 className="text-lg font-semibold text-gray-900">2. Prescription Management</h3>
//                 </div>
//                 <button 
//                   type="button"
//                   onClick={addMedication}
//                   className="flex items-center text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-smooth hover:scale-105 active:scale-95"
//                 >
//                   <PlusCircle size={18} className="mr-2" /> Add Medication
//                 </button>
//               </div>
              
//               {medications.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
//                   <Pill size={40} className="text-slate-300 mb-3" />
//                   <p className="text-slate-600 font-medium mb-1">No medications added yet</p>
//                   <p className="text-slate-500 text-sm">Click &quot;Add Medication&quot; to add prescriptions</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {medications.map((med, i) => (
//                     <div 
//                       key={i} 
//                       className="bg-white border-2 border-gray-200 p-5 rounded-xl space-y-4 relative hover:border-gray-300 transition-smooth group"
//                     >
//                       <div className="absolute top-4 right-4">
//                         <button 
//                           type="button" 
//                           onClick={() => removeMedication(i)} 
//                           className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 hover:bg-red-50 rounded-lg"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
                      
//                       <div className="text-sm font-medium text-gray-600 mb-3">
//                         Medication #{i + 1}
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input 
//                           placeholder="Medication Name" 
//                           className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
//                           value={med.name} 
//                           onChange={e => updateMedication(i, 'name', e.target.value)} 
//                         />
//                         <input 
//                           placeholder="Dosage (e.g., 500mg)" 
//                           className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
//                           value={med.dosage} 
//                           onChange={e => updateMedication(i, 'dosage', e.target.value)} 
//                         />
//                       </div>
                      
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <input 
//                           placeholder="Frequency (e.g., 2x daily)" 
//                           className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
//                           value={med.frequency} 
//                           onChange={e => updateMedication(i, 'frequency', e.target.value)} 
//                         />
//                         <input 
//                           type="number" 
//                           placeholder="Days" 
//                           className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
//                           value={med.durationInDays} 
//                           onChange={e => updateMedication(i, 'durationInDays', parseInt(e.target.value) || 0)} 
//                         />
//                         <input 
//                           placeholder="Instructions" 
//                           className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300 md:col-span-2"
//                           value={med.instructions} 
//                           onChange={e => updateMedication(i, 'instructions', e.target.value)} 
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* Section 3: Follow-up Details */}
//           {currentSection === 3 && (
//             <section className="space-y-5 animate-slide-up">
//               <div className="flex items-center gap-2 mb-5">
//                 <CalendarDays className="text-blue-600" size={20} />
//                 <h3 className="text-lg font-semibold text-gray-900">3. Follow-up Details</h3>
//               </div>
              
//               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3 mb-5">
//                 <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-blue-800">Schedule the follow-up appointment and provide any additional instructions for the patient.</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Follow-up Date <span className="text-red-500">*</span>
//                   </label>
//                   <input 
//                     type="datetime-local" 
//                     className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus-ring bg-white transition-smooth hover:border-gray-300"
//                     value={formData.followUpDate} 
//                     onChange={e => setFormData({...formData, followUpDate: e.target.value})} 
//                   />
//                 </div>
                
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Follow-up Instructions
//                   </label>
//                   <input 
//                     type="text"
//                     placeholder="e.g., Rest for 2-3 days, avoid heavy activity..." 
//                     className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus-ring bg-white transition-smooth hover:border-gray-300"
//                     value={formData.followUpInstructions} 
//                     onChange={e => setFormData({...formData, followUpInstructions: e.target.value})} 
//                   />
//                 </div>
//               </div>

//               {/* Section Complete Indicator */}
//               {/* {isSectionComplete(3) && (
//                 <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <CheckCircle2 size={18} className="text-green-600" />
//                   <span className="text-sm text-green-700 font-medium">Section completed</span>
//                 </div>
//               )} */}
//             </section>
//           )}
//         </div>

//         {/* Footer */}
//         <DialogFooter className="p-6 border-t bg-gradient-to-r from-slate-50 to-blue-50 rounded-b-lg flex items-center justify-between">
//           <div className="flex gap-2">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="py-2.5 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-smooth font-medium"
//             >
//               Cancel
//             </button>
//           </div>

//           <div className="flex gap-2">
//             {currentSection > 1 && (
//               <button 
//                 type="button"
//                 onClick={() => setCurrentSection((currentSection - 1) as 1 | 2 | 3)}
//                 className="py-2.5 px-6 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-smooth font-medium"
//               >
//                 Previous
//               </button>
//             )}
            
//             {currentSection < 3 ? (
//               <button 
//                 type="button"
//                 onClick={() => setCurrentSection((currentSection + 1) as 1 | 2 | 3)}
//                 className="py-2.5 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-smooth hover:scale-105 active:scale-95"
//               >
//                 Next
//               </button>
//             ) : (
//               <button 
//                 type="button"
//                 onClick={handleSave} 
//                 disabled={clinicalNotesMutation.isPending || completeMutation.isPending}
//                 className="py-2.5 px-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {(clinicalNotesMutation.isPending || completeMutation.isPending) ? (
//                   <>
//                     <div className="animate-pulse-soft">⏳</div>
//                     Finalizing...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} /> 
//                     Submit Consultation
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CompleteAppointmentDto } from "../types/appointments.types";
import { useCreateClinicalNotes, useCompleteAppointment } from "../hooks/use-my-appointment";
import { toast } from "sonner";
import { PlusCircle, Trash2, CalendarDays, ClipboardCheck, Pill, Stethoscope, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export function ClinicalNotesModal({ isOpen, onClose, appointmentId }: Props) {
  const clinicalNotesMutation = useCreateClinicalNotes();
  const completeMutation = useCompleteAppointment();
  
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);
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

  const isSectionComplete = (section: number) => {
    switch (section) {
      case 1:
        return formData.diagnosis.trim() !== "" && formData.treatmentSummary.trim() !== "";
      case 2:
        return true;
      case 3:
        return formData.followUpDate !== "";
      default:
        return false;
    }
  };

  const handleSave = async () => {
    if (!formData.diagnosis || !formData.treatmentSummary) {
      toast.error("Please provide at least a diagnosis and treatment summary.");
      return;
    }
    
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
      await clinicalNotesMutation.mutateAsync(payload);
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
      {/* MODAL RESPONSIVE SIZE INCREASED HERE */}
      <DialogContent className="sm:max-w-[950px] w-[95%] max-h-[90vh] overflow-hidden flex flex-col p-0 animate-fade-in-scale">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2.5 rounded-full shadow-lg">
              <Stethoscope size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Add Clinical Notes & Prescription
            </DialogTitle>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex gap-2">
            {[1, 2, 3].map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setCurrentSection(section as 1 | 2 | 3)}
                className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentSection === section
                    ? "bg-white text-blue-600 shadow-md border border-slate-100"
                    : "bg-slate-100/70 text-slate-500 hover:bg-slate-100"
                } flex items-center justify-center gap-2`}
              >
                {section === 1 && "Clinical"}
                {section === 2 && "Prescription"}
                {section === 3 && "Follow-up"}
              </button>
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Section 1: Clinical Observations */}
          {currentSection === 1 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-5">
                <ClipboardCheck className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">1. Clinical Observations</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus-ring bg-white transition-smooth hover:border-gray-300"
                    placeholder="Enter patient diagnosis..."
                    value={formData.diagnosis}
                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observations
                  </label>
                  <textarea 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[130px] focus-ring bg-white transition-smooth hover:border-gray-300"
                    placeholder="Clinical observations and notes..."
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Treatment Summary <span className="text-red-500">*</span>
                </label>
                <textarea 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm min-h-[110px] focus-ring bg-white transition-smooth hover:border-gray-300"
                  placeholder="Describe the treatment provided..."
                  value={formData.treatmentSummary}
                  onChange={e => setFormData({...formData, treatmentSummary: e.target.value})}
                />
              </div>

              {/* Section Complete Indicator */}
              {isSectionComplete(1) && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Section completed</span>
                </div>
              )}
            </section>
          )}

          {/* Section 2: Prescription Management */}
          {/* {currentSection === 2 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <Pill className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">2. Prescription Management</h3>
                </div>
                <button 
                  type="button"
                  onClick={addMedication}
                  className="flex items-center text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-smooth hover:scale-105 active:scale-95"
                >
                  <PlusCircle size={18} className="mr-2" /> Add Medication
                </button>
              </div>
              
              {medications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                  <Pill size={40} className="text-slate-300 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">No medications added yet</p>
                  <p className="text-slate-500 text-sm">Click &quot;Add Medication&quot; to add prescriptions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med, i) => (
                    <div 
                      key={i} 
                      className="bg-white border-2 border-gray-200 p-5 rounded-xl space-y-4 relative hover:border-gray-300 transition-smooth group"
                    >
                      <div className="absolute top-4 right-4">
                        <button 
                          type="button" 
                          onClick={() => removeMedication(i)} 
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-600 mb-3">
                        Medication #{i + 1}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          placeholder="Medication Name" 
                          className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
                          value={med.name} 
                          onChange={e => updateMedication(i, 'name', e.target.value)} 
                        />
                        <input 
                          placeholder="Dosage (e.g., 500mg)" 
                          className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
                          value={med.dosage} 
                          onChange={e => updateMedication(i, 'dosage', e.target.value)} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input 
                          placeholder="Frequency (e.g., 2x daily)" 
                          className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
                          value={med.frequency} 
                          onChange={e => updateMedication(i, 'frequency', e.target.value)} 
                        />
                        <input 
                          type="number" 
                          placeholder="Days" 
                          className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
                          value={med.durationInDays || ""} 
                          onChange={e => updateMedication(i, 'durationInDays', parseInt(e.target.value) || 0)} 
                        />
                        <input 
                          placeholder="Instructions" 
                          className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300 md:col-span-2"
                          value={med.instructions} 
                          onChange={e => updateMedication(i, 'instructions', e.target.value)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )} */}
          {/* Section 2: Prescription Management */}
{currentSection === 2 && (
  <section className="space-y-5 animate-slide-up">
    <div className="flex items-center justify-between gap-2 mb-5">
      <div className="flex items-center gap-2">
        <Pill className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">
          2. Prescription Management
        </h3>
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

    {medications.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
        <Pill size={40} className="text-slate-300 mb-3" />
        <p className="text-slate-600 font-medium mb-1">
          No medications added yet
        </p>
        <p className="text-slate-500 text-sm">
          Click "Add Medication" to add prescriptions
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {medications.map((med, i) => (
          <div
            key={i}
            className="bg-white border-2 border-gray-200 p-5 rounded-xl space-y-4 relative hover:border-gray-300 transition-smooth group"
          >
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => removeMedication(i)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="text-sm font-medium text-gray-600 mb-3">
              Medication #{i + 1}
            </div>

            {/* Medication Name */}
            <div>
              <input
                placeholder="Medication Name"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring transition-smooth hover:border-gray-300"
                value={med.name}
                onChange={(e) =>
                  updateMedication(i, "name", e.target.value)
                }
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Dosage
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="1"
                  placeholder="Amount"
                  className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring"
                  value={med.dosage?.replace(/[^\d]/g, "") || ""}
                  onChange={(e) => {
                    const amount = e.target.value;

                    const unit = med.dosage?.includes("ml")
                      ? "ml"
                      : "mg";

                    updateMedication(
                      i,
                      "dosage",
                      `${amount}${unit}`
                    );
                  }}
                />

                <select
                  className="p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring"
                  value={
                    med.dosage?.includes("ml")
                      ? "ml"
                      : "mg"
                  }
                  onChange={(e) => {
                    const amount =
                      med.dosage?.replace(/[^\d]/g, "") || "";

                    updateMedication(
                      i,
                      "dosage",
                      `${amount}${e.target.value}`
                    );
                  }}
                >
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>

            {/* Frequency + Duration + Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Frequency */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Frequency
                </label>

                <select
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring"
                  value={med.frequency}
                  onChange={(e) =>
                    updateMedication(
                      i,
                      "frequency",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Frequency
                  </option>

                  <option value="1">
                    1 
                  </option>

                  <option value="2">
                    2
                  </option>

                  <option value="3">
                    3 
                  </option>

                  <option value="4">
                    4 
                  </option>

                  <option value="5">
                    5 
                  </option>

                  <option value="6">
                    6 
                  </option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Duration (Days)
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Days"
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring"
                  value={med.durationInDays || ""}
                  onChange={(e) =>
                    updateMedication(
                      i,
                      "durationInDays",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Instructions
                </label>

                <select
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus-ring"
                  value={med.instructions}
                  onChange={(e) =>
                    updateMedication(
                      i,
                      "instructions",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Instruction
                  </option>

                  <option value="Before Food">
                    Before Food
                  </option>

                  <option value="After Food">
                    After Food
                  </option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)}



          {/* Section 3: Follow-up Details */}
          {currentSection === 3 && (
            <section className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-5">
                <CalendarDays className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">3. Follow-up Details</h3>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3 mb-5">
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">Schedule the follow-up appointment and provide any additional instructions for the patient.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Follow-up Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="datetime-local" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus-ring bg-white transition-smooth hover:border-gray-300"
                    value={formData.followUpDate} 
                    onChange={e => setFormData({...formData, followUpDate: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Follow-up Instructions
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g., Rest for 2-3 days, avoid heavy activity..." 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-sm focus-ring bg-white transition-smooth hover:border-gray-300"
                    value={formData.followUpInstructions} 
                    onChange={e => setFormData({...formData, followUpInstructions: e.target.value})} 
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Area with Uniform Blue Branding and Explicit Row Justification */}
        <DialogFooter className="p-6 border-t bg-gradient-to-r from-slate-50 to-blue-50 rounded-b-lg sm:flex-row flex items-center justify-between w-full gap-4">
          <div>
            <button 
              type="button" 
              onClick={onClose} 
              className="h-11 px-6 border-2 border-gray-300 bg-white rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center transition-all duration-200 shadow-sm"
            >
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
            
            {currentSection < 3 ? (
              <button 
                type="button"
                onClick={() => setCurrentSection((currentSection + 1) as 1 | 2 | 3)}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Next
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSave} 
                disabled={clinicalNotesMutation.isPending || completeMutation.isPending}
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
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}